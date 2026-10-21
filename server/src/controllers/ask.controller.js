import { z } from 'zod';
import { generateAnswer } from '../services/llm.service.js';

// Schema enforcing a trimmed string between 1 and 500 characters
const askSchema = z.object({
    question: z
        .string({
            required_error: 'Question is required',
            invalid_type_error: 'Question must be a string',
        })
        .trim()
        .min(1, 'Question cannot be empty')
        .max(500, 'Question must not exceed 500 characters'),
});

/**
 * Controller handling POST /api/ask
 */
export async function handleAsk(req, res, next) {
    try {
        // Validate request body
        const { question } = askSchema.parse(req.body);

        // Measure execution latency of the Gemini service call
        const startTime = Date.now();
        const { answer, inputTokens, outputTokens } = await generateAnswer(question);
        const latencyMs = Date.now() - startTime;

        return res.status(200).json({
            answer,
            usage: {
                inputTokens,
                outputTokens,
            },
            latencyMs,
        });
    } catch (err) {
        next(err);
    }
}
