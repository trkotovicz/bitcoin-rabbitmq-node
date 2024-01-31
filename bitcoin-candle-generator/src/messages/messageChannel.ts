import 'dotenv/config';
import { Channel, connect } from 'amqplib';
import { log } from 'console';

const AMQP_SERVER = process.env.AMQP_SERVER;
const QUEUE = process.env.QUEUE_NAME;

export const createMessageChannel = async (): Promise<Channel> => {
  try {
    const connection = await connect(AMQP_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);

    log('Connected to RabbitMQ');
    return channel;

  } catch (error) {
    log('Error while trying to connect to RabbitMQ');
    log(error);
    return null;
  }
}