const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI); // remove options
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected:", db.connections[0].host);
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

module.exports = connectDB;