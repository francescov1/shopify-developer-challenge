"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, required: true }
});


module.exports = mongoose.model("Product", ProductSchema);
