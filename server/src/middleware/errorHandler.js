import { z } from 'zod';

/**
 * Central Express error-handling middleware.
 * Intercepts validation errors (returning 400) and unhandled server errors (returning safe 500).
 */
export function errorHandler(err, req, res, next) {
    // 1. Zod validation errors
    if (err instanceof z.ZodError || err.name === 'ZodError') {
        const message = err.issues?.map((issue) => issue.message).join(', ') || 'Validation failed';
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message,
            },
        });
    }

    // 2. Malformed JSON payload in request body
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid JSON payload received',
            },
        });
    }

    // 3. Unexpected internal errors — log real details only to console
    console.error('Unhandled internal error:', err);

    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Something went wrong',
        },
    });
}
