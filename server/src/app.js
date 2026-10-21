import express from 'express';
import cors from 'cors';
import askRouter from './routes/ask.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', askRouter);

// Central error handler must be mounted LAST after all routes
app.use(errorHandler);

export default app;
