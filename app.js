const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const logger        = require('morgan');



const db_sync       = require("./models/sync");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 

/** <<<tell you how nodejs handle static files >>> */
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));

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
  res.status(err.status || 500).send("<h1> The Page not found</h1>");

  //res.status(400).json({"response":"You are lose becuase this page not found!!!"});

  //res.render('error');
});
//syncronizing with database
db_sync();
module.exports = app;