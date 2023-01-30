const mongoose = require("mongoose");
const express = require("express");
const Joi = require("joi");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minlength: true,
    trim: true,
  },
  Description: {
    type: String,
    require: true,
    minlength: true,
    trim: true,
  },
  Price: {
    type: String,
    require: true,
  },
  _supplierId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  addedToBasket: {
    type: Boolean,
    default: false,
  },
});

function ValidateProduct(product) {
  const productJoiSchema = Joi.object({
    title: Joi.string().min(3).required(),
    Description: Joi.string().min(3).required(),
    Price: Joi.string().min(3).required(),
  });
  return productJoiSchema.validate(product);
}

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product, ValidateProduct };
