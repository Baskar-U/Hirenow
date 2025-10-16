import mongoose from "mongoose";

export async function connectMongo(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI must be set");
  }
  if (mongoose.connection.readyState === 1) return mongoose;
  return mongoose.connect(uri);
}


