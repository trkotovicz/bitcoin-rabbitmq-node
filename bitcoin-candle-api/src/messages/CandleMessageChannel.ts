import { Channel, connect } from "amqplib";
import { log } from "console";
import "dotenv/config";
import * as http from "http";
import { Server } from "socket.io";
import CandleController from "../controllers/CandleController";
import { Candle } from "../models/CandleModel";

const QUEUE = process.env.QUEUE_NAME;

export default class CandleMessageChannel {
  private _channel: Channel;
  private _candleCtrl: CandleController;
  private _io: Server;

  constructor(server: http.Server) {
    this._candleCtrl = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"],
      },
    });

    this._io.on("connection", () => log("Web socket connection created"));

  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);

      this._channel = await connection.createChannel();
      this._channel.assertQueue(QUEUE);
      
    } catch (error) {
      log("Connection to RabbitMQ failed");
      log(error);
    }
  }

  async consumeMessages() {
    await this._createMessageChannel();

    this._channel.consume(QUEUE, async (msg) => {
      const candleObj = JSON.parse(msg.content.toString());

      log("Message received");
      log(candleObj);

      this._channel.ack(msg);

      const candle: Candle = candleObj;
      await this._candleCtrl.save(candle);
      log("Candle saved to database");

      this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
      log("New candle emited by web socket");
    });

    log("Candle consumer started");
  }
}
