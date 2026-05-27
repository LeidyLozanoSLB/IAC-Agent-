import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export const SESSIONS_ROOT = process.env.SESSIONS_ROOT ?? "sessions";

export interface PendingTool {
  name: string;
  args: any;
  toolCallId: string;
}

export interface SessionState {
  id: string;
  project: string;
  step: number;
  subStep: string;
  /** OpenAI-format message log (system, user, assistant, tool roles). */
  messages: any[];
  pendingTool?: PendingTool;
  artifacts: string[];
  createdAt: string;
  updatedAt: string;
}

export function newSession(project: string): SessionState {
  const id = randomUUID();
  const now = new Date().toISOString();
  const s: SessionState = {
    id,
    project,
    step: 1,
    subStep: "phase_1_questions",
    messages: [],
    artifacts: [],
    createdAt: now,
    updatedAt: now,
  };
  save(s);
  return s;
}

export function load(id: string): SessionState {
  const path = join(SESSIONS_ROOT, id, "state.json");
  if (!existsSync(path)) throw new Error(`session ${id} not found`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function save(s: SessionState) {
  s.updatedAt = new Date().toISOString();
  mkdirSync(join(SESSIONS_ROOT, s.id, "agent-output"), { recursive: true });
  writeFileSync(
    join(SESSIONS_ROOT, s.id, "state.json"),
    JSON.stringify(s, null, 2)
  );
}
