import * as express from 'express';
import * as webpack from 'webpack';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { monitorMediaJobs } from './azure/monitorMediaJobs';

import {
  InitTestDatabase,
} from '../tests/tools/InitTestDatabase';
import './utils/Database';
import {
  v1,
} from './routes';

const rootPath = path.resolve(__dirname, '../..');

const port = 8080;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Telemetry
const appInsights = require('applicationinsights');
const appInsightsKey = 'dab27579-80ad-4bb1-8591-8f7390b92c7a';
appInsights.setup(appInsightsKey).setAutoDependencyCorrelation(false).start();
const client = appInsights.client;

// Key will be moved and samples will be deleted
// This is just to test the integration and feed some sample data
client.trackEvent('Server has been started', { time: Date.now().toString() });
client.trackException(new Error('Sample Exception'));
client.trackMetric('Sample Metric', 1234);
client.trackTrace('Sample Trace');

// API
app.use('/api/v1', v1);

// Web app - rebuild on live changes to webpack bundle in dev mode
if (process.env.NODE_ENV === 'production') {

  console.log('Running in production mode');

  // TODO: NEED TO BE REMOVED!!!!
  InitTestDatabase(() => console.log('Populate Database'));

  app.use('/dist/app.js', (req, res) => {
    res.sendFile(path.join(rootPath, 'dist', 'client', 'app.js'));
  });
  app.use('/', (req, res) => {
    res.sendFile(path.join(rootPath, 'index.html'));
  });

} else if (process.env.NODE_ENV !== 'test') {
  console.log('Running in development mode');

  InitTestDatabase(() => console.log('Populate Database'));
  monitorMediaJobs();

  // TODO: SHOULD USE ES6 IMPORT
  // tslint:disable:no-require-imports
  const webpackConfig = require(path.resolve(rootPath, 'webpack.dev.config'));
  const compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    host: '0.0.0.0',
    historyApiFallback: true,
    watch: true,
    watchOptions: {
      aggregateTimeout: 1000,
      poll: 1000,
    },
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  // tslint:enable:no-require-imports
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(rootPath, 'index.html'));
  });
}

app.listen(port);

module.exports = app;
