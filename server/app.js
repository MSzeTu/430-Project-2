const path = require('path');
const express = require('express');
// socket stuff
const http = require('http');

const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/FakeReddit';

mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-13673.c240.us-east-1-3.ec2.cloud.redislabs.com',
  port: 13673,
};

let redisPASS = '4JlKUphH2s8PcNePwcSKXvs1LLHZ95Um';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}

const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);

// pull in our routes
const bodyParser = require('body-parser');
const router = require('./router.js');

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Fake Reddit',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.disable('x-powered-by');
app.use(cookieParser());

// Must come after app.use session and app.use(cookieParser), but before router

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});
router(app);

// Socket IO stuff
/* Current issues:
  Cannot actually have more than one user logged in. Not sure if this is a CSRF
    issue or something else.

  Trying to run things with two different users logged in requires CSRF

  Refreshing a page while logged in as one user sets another page to that user
*/

// Receive and emit
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('new thread', () => {
    io.emit('new thread');
  });
  socket.on('new comment', () => {
    console.log('socket.on in app.js works');
    io.emit('new comment');
  });
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

/* app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
}); */
