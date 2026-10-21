import { Router } from 'express';
import { handleAsk } from '../controllers/ask.controller.js';

const router = Router();

// GET /api/health
router.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

// POST /api/ask
router.post('/ask', handleAsk);

export default router;
