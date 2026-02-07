import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
    id: { type: Number, required: true, index: true }, // Indexing for query performance
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
}, { 
    capped: { size: 1024 * 1024 * 50, max: 5000 } // Keeps only the last 5000 records
});

export default mongoose.model('DataPacket', DataSchema);