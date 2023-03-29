import { createClient, RedisClientOptions } from 'redis';
import config from '../config';

const options: RedisClientOptions = config.redis;

const client = createClient(options);

client.on('connect', () => {
  console.log('Client connected to redis...');
});

export default client;
