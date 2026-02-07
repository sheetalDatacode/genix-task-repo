import DataPacket from '../models/DataPacket.js';

const seedDatabase = async () => {
  const count = await DataPacket.countDocuments();
  if (count === 0) {
    console.log('storing 5,000 records...');

    const data = Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }));

    await DataPacket.insertMany(data);
    console.log(' Data stored');
  }
};

export default seedDatabase;
