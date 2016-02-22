var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var album = require('./routes/album');
var auth = require('./routes/auth');
var admin = require('./routes/admin');

var app = express();
var COOKIE_MAX_AGE = 1000 * 3600 * 24 * 7; //1 week

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: COOKIE_MAX_AGE}
}));
app.use(passport.initialize());
app.use(passport.session());

// middleware to restrict access for unauthorised users
function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

app.use('/album', album);
app.use('/users', requireLogin, users);
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/', routes); //has to be the last

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //  message: err.message,
    //  error: err
    //});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  //res.status(err.status || 500);
  //res.render('error', {
  //  message: err.message,
  //  error: {}
  //});
});


module.exports = app;
