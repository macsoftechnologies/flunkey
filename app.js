const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var bodyparser = require('body-parser')
var mongoose = require('mongoose');
var cors = require('cors');
var db = require('./resources/db.config');
var MongoClient = require('mongodb').MongoClient;

mongoose.connect(db, { useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify: true })
var indexRouter = require('./routes/index');
var partnerRouter = require('./routes/partner');
var userAuthentication = require('./routes/authentication');
var master = require('./routes/master');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/api/partners', partnerRouter);
app.use('/users', partnerRouter);
app.use('/api/users', userAuthentication);
// app.use('api/master', master);
app.use('/master', master);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
