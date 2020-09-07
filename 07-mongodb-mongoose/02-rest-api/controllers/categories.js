const Category = require('./../models/Category');

function mapSubcategory({ id, title }) {
  return { id, title }
}

function mapCategory({ id, title, subcategories }) {
  return { id, title, subcategories: subcategories.map(mapSubcategory) }
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  
  ctx.response.status = 200;
  ctx.body = { categories: categories.map(mapCategory) };
};
