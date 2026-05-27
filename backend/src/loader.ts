import { readFileSync } from "node:fs";
import matter from "gray-matter";

export interface AgentDef {
  name: string;
  description: string;
  /** Body of the .agent.md (everything after the YAML frontmatter). */
  systemPrompt: string;
  tools: unknown[];
  handoffs: unknown[];
}

/**
 * Loads a `.agent.md` file from disk and splits frontmatter from body.
 * The body becomes the system prompt for the LLM.
 */
export function loadAgent(path: string): AgentDef {
  const raw = readFileSync(path, "utf-8");
  const { data, content } = matter(raw);
  return {
    name: data.name ?? "unknown",
    description: data.description ?? "",
    systemPrompt: content.trim(),
    tools: data.tools ?? [],
    handoffs: data.handoffs ?? [],
  };
}
