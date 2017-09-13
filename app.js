
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var helmet = require('helmet')

const config = require('./config/config.example');

app.set('view engine', 'ejs')

// Connect to MongoDB
// mongoose.connect(config.mongourl);           // Depricated Syntax
mongoose.connection.openUri(config.mongourl);   // New Syntax
var db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


var sessionexpiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hours
// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  expires: sessionexpiryDate,
  domain: "wallet.coinmd.io",
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
var cacheTime = 86400000*2;     // 2 days
app.use(express.static(__dirname + '/public',{ maxAge: cacheTime }));


app.use(helmet()) // Security
app.disable('x-powered-by')


// include routes

var login = require('./routes/login');
var dashboard = require('./routes/dashboard');

app.use('/',login);
app.use('/login',login);
app.use('/dashboard',dashboard);

var send = require('./routes/send');
var receive = require('./routes/receive');
var restapi = require('./routes/restapi');
var profile = require('./routes/profile');

app.use('/send',send);
app.use('/receive',receive);
app.use('/api',restapi);
app.use('/profile',profile);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  return res.render('partials/404.ejs');
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen(config.serveport, function() {
  console.log(`[+] Listening ${config.serveport}`);
})  // Start App Listener


module.exports = app;