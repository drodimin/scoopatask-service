// Imports the Google Cloud client library for Winston
const {LoggingWinston} = require('@google-cloud/logging-winston');
const winston = require('winston');

const key = JSON.parse(process.env.GCS_KEYFILE);

// Creates a client
const loggingWinston = new LoggingWinston({
  projectId: 'scoopatask-dev',
  credentials: key
});

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console(),
      // Add Stackdriver Logging
      loggingWinston,
    ],
  });
  
  module.exports = logger;