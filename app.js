// Load dotenv.
var dotenv = require('dotenv');
dotenv.load();

var _ = require('lodash');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var csrf = require('lusca').csrf();
var config = require('./config');

var app = express();

app.set('port', config.port);
app.set('env', config.env);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true,
}));

// CSRF
app.use(function(req, res, next) {
  if (_.contains(csrfExclude, req.path)) return next();
  else csrf(req, res, next);
});

//app.use(express.static(path.join(__dirname, 'public')));


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(app.get('port'), function() {
  console.log("Running at localhost:" + app.get('port'))
});