"use strict";
const productController = require("../controllers/products");
const express = require("express");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.post("/:id", productController.purchaseProduct);

module.exports = router;
