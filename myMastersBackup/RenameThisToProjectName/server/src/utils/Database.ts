import * as mongoose from 'mongoose';
import * as config from 'config';

(<any> mongoose).Promise = Promise;
const dbURL: any = config.get('DATABASE');

mongoose.connect(dbURL);

mongoose.connection.on('connected', () => {
  console.warn(`Mongoose connected to ${dbURL}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected');
});

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

import '../models';
