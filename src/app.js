import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import qs from 'qs';

import config from './config';
import router from './routes/index.js';
import client from './db/redis';
import globalErrors from './helpers/globalErrors';

console.log(config);

const app = express();
app.set('query parser', (str) => qs.parse(str, { encode: false, arrayFormat: 'comma' }))

app.use(express.json());

async function start() {
  try {
    await mongoose.connect(config.mongodb.url, config.mongodb.options);
    await client.connect();
    app.use(morgan("combined"))
    app.use(config.server.prefix, router);

    app.use(globalErrors());

    app.listen(config.server.port, () => {
      console.log(`Start server, port: ${config.server.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

process.on('SIGINT', () => {
  client.quit();
});
