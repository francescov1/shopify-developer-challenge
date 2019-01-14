"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  state: {
    type: String,
    enum: ["pending", "complete"],
    default: "pending"
  },
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model("Cart", CartSchema);
