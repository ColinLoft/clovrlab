import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Creates an OpenRouter-backed AI provider using the existing `@ai-sdk/openai-compatible`
 * package. Requires `OPENROUTER_API_KEY` in your environment.
 *
 * Usage:
 *   const provider = createAiProvider(process.env.OPENROUTER_API_KEY!);
 *   const model = provider("google/gemini-2.0-flash-001:free");
 */
export function createAiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "openrouter",
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}
