"use strict";
const express = require("express");
const rateLimit = require("express-rate-limit");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/carts");
const errorMiddleware = require("./errors/middleware");

module.exports = function(app) {

  // request rate limiter
  // limits a user to 500reqs/15min
  const apiLimiter = rateLimit({
    windowMs: 900000,
    max: 500,
    message: {
      type: "RateLimitError",
      message: "Too many requests, please try again later"
    }
  });

  // mount api routes on to api router
  const apiRouter = express.Router();
  apiRouter.use(apiLimiter);
  apiRouter.use("/products", productRoutes);
  apiRouter.use("/carts", cartRoutes);

  // mount api router on to app
  app.use("/api", apiRouter);

  // mount middleware to handle errors
  app.use(errorMiddleware)

  // mount catch all route
  app.all("*", (req, res) => res.status(200).send("Francesco's Store API"));
};
