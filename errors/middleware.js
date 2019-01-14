"use strict";
const config = require("../config/main");

// error handling middlewear
function errorHandler(err, req, res, next) {
  if (config.node_env === "test")
    console.error(err.message);
  else
    console.error(err.stack);

  var status = err.status || err.statusCode || err.code;
  return res.status(status >= 100 && status < 600 ? status : 500).send({
    error: {
      type: err.name || err.type,
      message: err.message
    }
  });
}

module.exports = errorHandler;
