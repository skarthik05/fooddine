var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoDb = require("./mongodb");

var app = express();

let allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
};
app.use(allowCrossDomain);
const PORT = process.env.PORT_NO ?? 8080;
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/orders", require("./routes/order"));
app.use("/users", require("./routes/users"));
app.use("/tables", require("./routes/table"));
app.use("/menus", require("./routes/menu"));

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

mongoDb.connect(async () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });
});
