import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with backend
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Body:', JSON.stringify(req.body));
    next();
});

// Routes
// Mount authentication routes at /api/auth
app.use('/api/auth', authRoutes);

// MongoDB Connection
// Connect to the MongoDB database using the URI from environment variables
console.log('Attempting to connect to MongoDB...');
// Note: The URI is loaded from the .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        // process.exit(1); // Optional: Exit if DB fails
    });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
