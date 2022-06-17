const Product = require('../models/Product');
const MapProduct = require('../mappers/product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  const ProductList = [];

  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'Invalid subcategory id')
  }

  const products = await Product.find({subcategory: subcategory});

  if (products.length == 0) {
    ctx.body = {products: []};
  } else {
    products.forEach(product => {
      ProductList.push(MapProduct(product));
    });
    ctx.body = {products: ProductList};
  }
};

module.exports.productList = async function productList(ctx, next) {
  const ProductList = [];
  const products = await Product.find();

  if (products.length == 0) {
    ctx.body = {products: []};
  } else {
    products.forEach(product => {
      ProductList.push(MapProduct(product));
    });
    ctx.body = {products: ProductList};
  }
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid product id')
  }
  const product = await Product.findOne({ _id: ctx.params.id});

  if (!product) {
    ctx.status = 404;
    ctx.body = 'product not found';
  } else {
    ctx.body = {product: MapProduct(product)};
  }
};

