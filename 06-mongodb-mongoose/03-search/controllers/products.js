const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const queryString = ctx.query.query;
  
  if (!queryString) {
    ctx.body = {products: []};
  } else {
    const products = await Product.find({$text: { $search: queryString}})
    if (products.length === 0) {
      ctx.body = {products: []};
    } else {
      ctx.body = {products: products};
    }
  }
};