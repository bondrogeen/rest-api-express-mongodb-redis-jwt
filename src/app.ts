import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';

import config from './config';
import router from './routes/';
import client from './db/redis';

const app: Express = express();
app.use(express.json());

async function start() {
  try {
    await mongoose.connect(config.mongodb.url, config.mongodb.options);
    await client.connect();
    app.use(config.server.prefix, router);
    app.listen(config.server.port, () => {
      console.log(`Start server, port: ${config.server.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

process.on('SIGINT', () => {
  // client.quit();
});
