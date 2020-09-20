const mongoose = require('mongoose');
const Product = require('./../models/Product');

function mapProduct({ id, title, images, category, subcategory, price, description }) {
  return { id, title, images, category, subcategory, price, description }
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;

  if (!subcategory) {
    return next();
  }
  
  if (!mongoose.Types.ObjectId.isValid(subcategory)) {
    ctx.throw(400, 'invalid id');
  }

  const products = await Product.find({ subcategory });
  
  ctx.response.status = 200;
  ctx.body = { products: products.map(mapProduct) || [] }
  return;
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  
  ctx.response.status = 200;
  ctx.body = { products: products.map(mapProduct) || [] }
  return;
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'invalid id');
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404, 'does not exist');
  }
  
  ctx.response.status = 200;
  ctx.body = { product: mapProduct(product) }
  return;
};

