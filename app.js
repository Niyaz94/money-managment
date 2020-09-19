const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const multer        = require("multer");
const logger        = require('morgan');

const db_sync       = require("./util/sync");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
    
app.use(multer({ dest: 'uploads/' }).single('name'));

/** <<<tell you how nodejs handle static files >>> */
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

//calling router file 
var routerFile = require('./router');
routerFile.set_route(app);

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
//syncronizing with database
db_sync();
module.exports = app;