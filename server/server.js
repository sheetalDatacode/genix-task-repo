import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE CONFIGURATION ---
const MONGO_URI ='mongodb+srv://sheetal:sheetal123@cluster0.pow75qz.mongodb.net/arGenixDB?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected');
    seedDatabase(); // Check if we need to add initial data
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema & Model
const DataSchema = new mongoose.Schema({
  id: { type: Number, index: true }, // Indexing for high-speed lookup
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const DataPacket = mongoose.model('DataPacket', DataSchema);

// --- SEEDING LOGIC ---
// This fills your Atlas DB with 5,000 items automatically if it's empty
async function seedDatabase() {
  const count = await DataPacket.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding 5,000 records to Atlas...');

    console.log('its working ..')
    const data = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }));
    await DataPacket.insertMany(data);
    console.log('error in : seeding data');
  }
}

// --- CUSTOM MIDDLEWARE ---

// 1. Custom Rate Limiter
const ipTracker = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const WINDOW_MS = 60000; 
  const MAX_LIMIT = 50;    

  if (!ipTracker.has(ip)) {
    ipTracker.set(ip, { count: 1, startTime: now });
    return next();
  }

  const data = ipTracker.get(ip);
  if (now - data.startTime > WINDOW_MS) {
    data.count = 1;
    data.startTime = now;
    return next();
  }

  if (data.count >= MAX_LIMIT) {
    return res.status(429).json({ error: "Too many requests. Priority limit reached." });
  }

  data.count++;
  next();
};

// 2. Custom Validator
const validateData = (req, res, next) => {
  const { id, value } = req.body;
  if (id === undefined || value === undefined) {
    return res.status(400).json({ error: "Invalid Data Packet: Missing ID or Value" });
  }
  next();
};

app.use(rateLimiter);

// --- ROUTES ---

// GET: Fetch real data from MongoDB Atlas
app.get('/api/data', async (req, res) => {
  try {
    // Fetching 5000 records from the actual DB
    const data = await DataPacket.find().sort({ id: 1 }).limit(5000);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Database retrieval failed" });
  }
});

// POST: Process verified data
app.post('/api/process', validateData, async (req, res) => {
  try {
    const newData = new DataPacket(req.body);
    await newData.save();
    res.status(201).json({ message: "Data logged successfully to Atlas" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));