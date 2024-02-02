import 'dotenv/config';
import axios from 'axios';
import Period from './enums/Period';
import Candle from './models/Candle';
import { log } from 'console';
import { createMessageChannel } from './messages/messageChannel';

const API = process.env.PRICES_API;
const QUEUE = process.env.QUEUE_NAME;

const readMarketPrice = async (): Promise<number> => {
  const result = await axios.get(String(API));
  const { data } = result;
  const price = data.bitcoin.usd;
  return price;
}

const generateCandles = async () => {

  const messageChannel = await createMessageChannel();

  if (messageChannel) {
    while(true) {
      const loopTimes = Period.TEN_MINUTES / Period.ONE_MINUTE;
      const candle = new Candle('BTC');
  
      log('-----------------------------');
      log('Generating new candles');
  
      for (let i= 0; i < loopTimes; i++) {
        const price = await readMarketPrice();
        candle.addValue(price);
        log(`Market price #${i + 1} of ${loopTimes}`);
        await new Promise(r => setTimeout(r, Period.ONE_MINUTE));
      }
  
      candle.closeCandle();
      log('Candle close');

      const candleObj = candle.toSimpleObject();
      log(candleObj);

      const candleJson = JSON.stringify(candleObj);
      messageChannel.sendToQueue(QUEUE, Buffer.from(candleJson));
      log('Candle enqueue');
    }
  }

}

generateCandles();