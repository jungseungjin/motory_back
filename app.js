var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Key = require("./config/Key.js");
const mongoose = require("mongoose");

const dbConn = mongoose.connection;
dbConn.once("open", () => {
  console.log("MongoDB OK!!");
});
dbConn.on("error", console.error);

const uri = Key.DB;

mongoose.connect(uri, { useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

const session = require("express-session");
const bodyParser = require("body-parser");
const Passport = require("passport").Passport;
const userpassport = new Passport();
const flash = require("connect-flash");
const passportConfig = require("./config/passport");
const mongostore = require("connect-mongo")(session);

var app = express();

const helmet = require("helmet");
//app.io = require("socket.io")();

//require("./controller/socket.js")(app.io);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

app.use(
  session({
    name: "user",
    key: Key.DB_session_key,
    secret: Key.DB_session_secret,
    saveUninitialized: true,
    resave: false,
    store: new mongostore({
      url: Key.DB,
      ttl: 60 * 30,
      autoRemove: "interval",
      autoRemoveInterval: 10,
      collection: "log_sessions",
      stringify: false,
    }),
  })
);

app.use(userpassport.initialize());
app.use(userpassport.session()); //로그인 세션 유지
app.use(flash());
passportConfig(userpassport);

require("./controller/loginController.js")(app, userpassport);
require("./controller/mainController.js")(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
