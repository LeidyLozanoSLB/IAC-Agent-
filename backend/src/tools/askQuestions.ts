import type { ChatCompletionTool } from "openai/resources/chat/completions";

/**
 * Tool schema for `askQuestions` — mirrors the Claude Code tool the agent
 * body already expects. The LLM emits a call; the backend pauses and returns
 * the question to the HTTP caller. The caller posts answers back, which
 * become the tool result on the next turn.
 */
export const askQuestionsSchema: ChatCompletionTool = {
  type: "function",
  function: {
    name: "askQuestions",
    description:
      "Ask the user 1-4 questions and pause until they answer. Use this " +
      "to gather required information before generating artifacts.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          minItems: 1,
          maxItems: 4,
          items: {
            type: "object",
            required: ["question", "header", "options"],
            properties: {
              question: {
                type: "string",
                description: "The full question text shown to the user.",
              },
              header: {
                type: "string",
                description:
                  "Short label (under 12 chars), e.g. 'Environment'.",
              },
              multiSelect: {
                type: "boolean",
                description: "Allow multiple answers when true.",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  required: ["label"],
                  properties: {
                    label: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      required: ["questions"],
    },
  },
};
