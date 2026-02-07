import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import dataRoutes from './routes/dataRoutes.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

connectDB();

app.use('/api', dataRoutes);

export default app;
