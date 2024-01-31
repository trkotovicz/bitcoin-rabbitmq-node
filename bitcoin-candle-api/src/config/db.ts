import "dotenv/config";
import { connect } from "mongoose";

const MONGO_URI = String(process.env.MONGODB_CONNECTION_URL)

export const connectMongoDB = async () => {
  await connect(MONGO_URI);
};
