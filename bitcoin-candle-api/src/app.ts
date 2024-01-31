import * as cors from "cors";
import * as express from "express";
import * as logger from "morgan";
import candleRouter from "./routes/candles";

const app = express();
app.use(cors());
app.use(logger("dev"));

app.use('/candles', candleRouter);

export default app;
