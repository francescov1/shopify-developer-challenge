"use strict";
const request = require("supertest");
const mongoose = require("mongoose");
const server = require("../index.js");

global.agent = request.agent(server);

afterAll(() => {
  return Promise.all([
    mongoose.connection.close(),
    mongoose.disconnect(),
    server.close()
  ]);
});
