import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Calls Google Gemini with the provided question and extracts the response and token counts.
 *
 * @param {string} question - The validated user question.
 * @returns {Promise<{ answer: string, inputTokens: number, outputTokens: number }>}
 */
export async function generateAnswer(question) {
    const model = process.env.GEMINI_MODEL;
    if (!model) {
        throw new Error('GEMINI_MODEL environment variable is not defined.');
    }

    const response = await ai.models.generateContent({
        model,
        contents: question,
    });

    return {
        answer: response.text ?? '',
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
    };
}
