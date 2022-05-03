import { createClient } from 'redis';
import config from '../config';

class Redis extends createClient {
  constructor(options) {
    if (typeof Redis.instance === 'object') {
      return Redis.instance;
    }
    super(options);
    Redis.instance = this;
  }
}

const client = new Redis(config.redis);

client.on('connect', () => {
  console.log('Client connected to redis...');
});

export default client;
