"use strict";
const ObjectId = require("mongoose").Types.ObjectId;
const Cart = require("../models/cart");
const Product = require("../models/product");
const { NotAllowedError, NotFoundError } = require("../errors/custom");

module.exports = {

  createCart: function(req, res, next) {
    const cart = new Cart();
    return cart.save()
      .then(cart => res.status(201).send(cart))
      .catch(err => next(err));
  },

  getCart: function(req, res, next) {

    return Cart.findById(req.params.id).populate("products").exec()
      .then(cart => {
        if (!cart)
          throw new NotFoundError(`Cart with ID ${req.params.id} not found`);

        cart.total = Math.round(cart.total * 100) / 100;
        return res.status(200).send(cart)
      })
      .catch(err => next(err));
  },

// TODO: dont allow if cart has already been complete
  addProductsToCart: function(req, res, next) {
    const productIds = req.body.products;

    return Product.find({ _id: { $in: productIds } })
      .then(products => {

        let totalPrice = 0;
        for (let product of products) {
          if (product.inventory === 0)
            throw new NotAllowedError(`Product ${product.title} is out of stock!`);

          totalPrice += product.price;
        }

        return Cart.findByIdAndUpdate(
          req.params.id,
          {
            $push: { products: { $each: productIds } },
            $inc: { total: totalPrice }
          },
          { new: true }
        );
      })
      .then(cart => cart.populate("products").execPopulate())
      .then(cart => {
        cart.total = Math.round(cart.total * 100) / 100;
        return res.status(201).send(cart)
      })
      .catch(err => next(err));
  },

  // removes a product from the shopping cart
  removeProduct: function(req, res, next) {

    return Product.findById(req.params.productId)
      .then(product => {

        return Cart.findByIdAndUpdate(
          req.params.cartId,
          {
            $pull: { products: req.params.productId },
            $inc: { total: -product.price }
          },
          { new: true }
        );
      })
      .then(cart => cart.populate("products").execPopulate())
      .then(cart => {
        cart.total = Math.round(cart.total * 100) / 100;
        return res.status(201).send(cart)
      })
      .catch(err => next(err));
  },

  completeCart: function(req, res, next) {

    let cart;
    return Cart.findById(req.params.id).populate("products").exec()
      .then(result => {
        cart = result;

        if (cart.state !== "pending")
          throw new NotAllowedError("Cart has already been completed");

        for (let product of cart.products) {
          if (product.inventory <= 0)
            throw new NotAllowedError(`Product ${product.title} is out of stock!`);
        }

        return Product.update(
          { _id: { $in: cart.products } },
          { $inc : { inventory: -1 } },
          { multi: true }
        );
      })
      .then(() => {
        cart.state = "complete";
        return cart.save()
      })
      .then(cart => cart.populate("products").execPopulate())
      .then(cart => {
        cart.total = Math.round(cart.total * 100) / 100;
        return res.status(201).send(cart)
      })
      .catch(err => next(err))
  },

  deleteCart: function(req, res, next) {
    return Cart.findByIdAndDelete(req.params.id)
      .then(cart => res.status(201).send({ success: true }))
      .catch(err => next(err));
  }
}
