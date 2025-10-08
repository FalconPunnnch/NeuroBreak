import User from './user.js';
import Product from './product.js';

import ProductCategory from './productCategory.js';



ProductCategory.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id' });


export {
    User,
    Product,
    ProductCategory
};