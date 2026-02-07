import DataPacket from '../models/DataPacket.js';

export const getData = async (req, res) => {
  try {
    const data = await DataPacket.find()
      .sort({ id: 1 })
      .limit(5000);

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Database retrieval failed' });
  }
};

export const processData = async (req, res) => {
  try {
    const newData = new DataPacket(req.body);
    await newData.save();

    res.status(201).json({
      message: 'Data logged successfully to database'
    });
  } catch {
    res.status(500).json({ error: 'Failed to save data' });
  }
};
