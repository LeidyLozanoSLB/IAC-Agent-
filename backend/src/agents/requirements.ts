import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { loadAgent } from "../loader.js";
import {
  load,
  newSession,
  save,
  SESSIONS_ROOT,
  type SessionState,
} from "../state.js";
import { llm, MODEL } from "../llm.js";
import { askQuestionsSchema } from "../tools/askQuestions.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolves `.github/agents/` relative to this file by default.
 * Layout: <repo>/backend/src/agents/requirements.ts  →  <repo>/.github/agents/
 */
const AGENTS_DIR =
  process.env.AGENTS_DIR ?? resolve(__dirname, "../../../.github/agents");
const AGENT_PATH = join(AGENTS_DIR, "02-requirements.agent.md");

const AGENT = loadAgent(AGENT_PATH);
const TOOLS = [askQuestionsSchema];
const MAX_TURNS = 30;

console.log(`[requirements] loaded agent definition from ${AGENT_PATH}`);

export type RunResult =
  | {
      sessionId: string;
      status: "awaiting_answer";
      question: any;
    }
  | {
      sessionId: string;
      status: "complete";
      artifactPath: string;
      artifactUrl: string;
    };

export async function startRequirements(
  project: string,
  userMessage: string
): Promise<RunResult> {
  const s = newSession(project);
  s.messages.push(
    { role: "system", content: AGENT.systemPrompt },
    { role: "user", content: `Project: ${project}\n\n${userMessage}` }
  );
  return runUntilPauseOrDone(s);
}

export async function continueRequirements(
  sessionId: string,
  answers: unknown
): Promise<RunResult> {
  const s = load(sessionId);
  if (!s.pendingTool) {
    throw new Error("no pending question for this session");
  }
  s.messages.push({
    role: "tool",
    tool_call_id: s.pendingTool.toolCallId,
    content: JSON.stringify({ answers }),
  });
  s.pendingTool = undefined;
  return runUntilPauseOrDone(s);
}

/**
 * Drives the LLM loop. Returns when the model either:
 *   - calls `askQuestions` (pause, return the question to the HTTP caller)
 *   - returns plain text with no tool calls (treat as the final artifact)
 *
 * Any other tool call is an error in this POC — extend the dispatch
 * branch when adding more tools.
 */
async function runUntilPauseOrDone(s: SessionState): Promise<RunResult> {
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const resp = await llm.chat.completions.create({
      model: MODEL,
      messages: s.messages,
      tools: TOOLS,
      tool_choice: "auto",
    });
    const msg = resp.choices[0].message;
    s.messages.push(msg as any);

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      const artifactPath = join(
        SESSIONS_ROOT,
        s.id,
        "agent-output",
        "01-requirements.md"
      );
      writeFileSync(artifactPath, msg.content ?? "");
      s.artifacts.push("01-requirements.md");
      save(s);
      return {
        sessionId: s.id,
        status: "complete",
        artifactPath,
        artifactUrl: `/sessions/${s.id}/artifacts/01-requirements.md`,
      };
    }

    const call = msg.tool_calls[0];
    if (call.function.name === "askQuestions") {
      s.pendingTool = {
        name: "askQuestions",
        args: JSON.parse(call.function.arguments),
        toolCallId: call.id,
      };
      save(s);
      return {
        sessionId: s.id,
        status: "awaiting_answer",
        question: s.pendingTool.args,
      };
    }

    throw new Error(
      `unsupported tool: ${call.function.name} (only askQuestions is wired in this POC)`
    );
  }
  throw new Error(`turn limit (${MAX_TURNS}) exceeded`);
}
