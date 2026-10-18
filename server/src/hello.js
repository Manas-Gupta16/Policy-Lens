import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const question =
    process.argv.slice(2).join(' ') || 'Explain tokens to a beginner in 2 sentences.';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

try {
    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL,
        contents: question,
    });

    console.log(response.text);
    console.log('--- usage ---');
    console.log('Input tokens:', response.usageMetadata.promptTokenCount);
    console.log('Output tokens:', response.usageMetadata.candidatesTokenCount);
    console.log('Total tokens:', response.usageMetadata.totalTokenCount);
} catch (err) {
    console.error('Request failed:', err.message);
}