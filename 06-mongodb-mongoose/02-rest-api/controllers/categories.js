const Category = require('../models/Category');
const MapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const CategoryList = [];
  const categories = await Category.find();

  categories.forEach(category => {
    CategoryList.push(MapCategory(category));
  });
  
  ctx.body = {categories: CategoryList};
};
