"use strict";
Promise = require("bluebird");
const config = require("./config/main");
const express = require("express");
const helmet = require("helmet");
const router = require("./router.js");
const bodyParser = require("body-parser");

// setup db
require("./config/mongoose");

// setup express app
const app = express();

// basic middleware
app.use(helmet());
app.use(bodyParser.json());

// mount routes
router(app);

const server = app.listen(config.port, () => {
  console.log(`server listening on port ${config.port}...`)
});

module.exports = server;
