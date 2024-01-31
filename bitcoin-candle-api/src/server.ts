import { log } from "console";
import "dotenv/config";
import app from "./app";
import { connectMongoDB } from "./config/db";
import { connection } from "mongoose";
import CandleMessageChannel from "./messages/CandleMessageChannel";

const PORT = process.env.PORT;

const createServer = async () => {
  await connectMongoDB();
  const server = app.listen(PORT, () => log(`App running on port ${PORT}`));

  const candleMsgChannel = new CandleMessageChannel(server);
  candleMsgChannel.consumeMessages();

  process.on('SIGINT', async () => {
    await connection.close();
    server.close();
    log('Server and connection to MongoDB closed');
  });
}

createServer();