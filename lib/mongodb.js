import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI در فایل .env.local تنظیم نشده است");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "robotsaz",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully!");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}
