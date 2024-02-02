export default class Candle {
  currency = '';
  finalDateTime: Date = new Date();
  open = 0;
  close = 0;
  high = 0;
  low = 0;
  color = '';

  constructor(candleObj: any) {
    Object.assign(this, candleObj);
    this.finalDateTime = new Date(this.finalDateTime);
  }
}
