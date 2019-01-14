"use strict";
const Product = require("../models/product");
const { NotFoundError, NotAllowedError } = require("../errors/custom");

module.exports = {

  getAllProducts: function(req, res, next) {
    const productQuery = {};
    if (req.query.available === "true") {
      productQuery.inventory = { $gt: 0 }
    }

    return Product.find(productQuery)
      .then(products => res.status(200).send(products))
      .catch(err => next(err));
  },

  getProduct: function(req, res, next) {
    return Product.findById(req.params.id)
      .then(product => {
        if (!product)
          throw new NotFoundError(`Product with ID ${req.params.id} not found`);

        return res.status(200).send(product);
      })
      .catch(err => next(err));
  },

  purchaseProduct: function(req, res, next) {

    return Product.findById(req.params.id)
      .then(product => {
        if (product.inventory <= 0)
          throw new NotAllowedError(`Product ${product.title} is out of stock!`);

        product.inventory--;
        return product.save();
      })
    .then(product => res.status(201).send(product))
    .catch(err => next(err));
  },

// TODO: get rid of when submitting
  addProduct: function(req, res, next) {
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      inventory: req.body.inventory
    });

    return product.save()
      .then(product => res.status(201).send(product))
      .catch(err => next(err));
  }

};
