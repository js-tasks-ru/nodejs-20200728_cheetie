const Product = require("../models/Product");

function mapProduct({ id, title, images, category, subcategory, price, description }) {
  return { id, title, images, category, subcategory, price, description }
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;
  const products = await Product.find({$text: {$search: query}});
  
  ctx.response.status = 200;
  ctx.body = { products: products.map(mapProduct) || [] }
  return;
};