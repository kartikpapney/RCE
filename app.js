import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import router from './router/routes.js'
import debug from './debug.js';
import {freeConnection} from './utils.js'
import cookieParser from 'cookie-parser';
import {CronJob} from 'cron';
import cors from 'cors'

const app = express();
var server = http.createServer(app);


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({
  origin:  [
    process.env.REACT_SERVER_HOST,
  ],
  "Access-Control-Allow-Origin": process.env.REACT_SERVER_HOST,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.set('port', process.env.NODE_SERVER_PORT || 5000);
app.use('/', router);
app.use((req, res) => {
  res.status(404).send('Route not found');
});

var job = new CronJob(
    `*/${process.env.CRON_RUN_EVERY} * * * *`,
    freeConnection,
    null,
    true,
    "Asia/Kolkata"
);
job.start();


var notifyServer = server.listen(app.get('port'),
  process.env.NODE_SERVER_IP || '127.0.0.1',
  function() {
    debug('server listening on address ' + notifyServer.address().address + ':' + notifyServer.address().port)
    debug('server listening on port ' + notifyServer.address().port)
  })

process.on('unhandledRejection', (reason, promise) => {
  debug('Unhandled Rejection at:', reason.stack || reason)
})