"use strict";
const cartController = require("../controllers/carts");
const express = require("express");
const router = express.Router();

router.post("/", cartController.createCart);
router.get("/:id", cartController.getCart);
router.post("/:id", cartController.addProductsToCart);
router.post("/:id/complete", cartController.completeCart);
router.delete("/:id", cartController.deleteCart);
router.delete("/:cartId/products/:productId", cartController.removeProduct);

module.exports = router;
