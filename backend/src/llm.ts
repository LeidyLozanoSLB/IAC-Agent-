import OpenAI from "openai";

if (!process.env.GITHUB_TOKEN) {
  throw new Error(
    "GITHUB_TOKEN env var is required. " +
      "Create a PAT with `models:read` scope at https://github.com/settings/tokens"
  );
}

/**
 * GitHub Models is OpenAI-compatible.
 * Base URL: https://models.inference.ai.azure.com
 * Auth: GitHub PAT with `models:read`.
 */
export const llm = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

export const MODEL = process.env.MODEL ?? "gpt-4o";
