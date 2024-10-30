// app define express application setup and imports the routes ,middleware and applies them globaly.

const express = require("express");
const app = express(); //Initalizing the express application
const morgan = require("morgan"); //a middleware for logging http requests and responses
const bodyParser = require("body-parser");
const path = require("path");

const authRoutes = require("./api/routes/auth-routes");
const itemRoutes = require("./api/routes/item-routes");
const cartRoutes = require("./api/routes/cart-routes");
const orderRoutes = require("./api/routes/order-routes");
const promotionRoutes = require("./api/routes/promotion-routes");
const feedbackRoutes = require("./api/routes/feedback-routes");

//middleware for logging requests and parsing the body
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

//CORS setup
app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE,GET,PATCH");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the e-commerce backend API!");
});

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/promotion", promotionRoutes);
app.use("/api/feedback", feedbackRoutes);

const menuPath = path.resolve(
  __dirname,
  "./images/menu"
);
app.use("/images/menu", express.static(menuPath));

const userImagePath = path.resolve(
  __dirname,
  "./images/user-image"
);
app.use("/images/user-image", express.static(userImagePath));

const promotionPath = path.resolve(
  __dirname,
  "./images/promotion"
);
app.use("/images/promotion", express.static(promotionPath));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use("/promotion", promotionRoutes);

module.exports = app;
