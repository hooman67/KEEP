const webpackConfig = require('./webpack.dev.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'client/tests/**/*.test.tsx',
      'client/tests/**/*.test.ts',
    ],
    exclude: [],
    preprocessors: {
      'client/tests/**/*.test.tsx': ['webpack'],
      'client/tests/**/*.test.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      externals: {
        'react/addons': true,
        'react-addons-test-utils': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    browsers: ['jsdom'],
    singleRun: true,
    concurrency: Infinity,
    browserConsoleLogOptions: {
      level: 'error',
      terminal: false
    }
  })
};
