import User from './user.js';
import Category from './category.js';
import MicroActividad from './microActividad.js';
import Timer from './timer.js';




User.hasMany(Timer, { foreignKey: 'category_id' });//cambiar foreingKey
Timer.belongsTo(User, { foreignKey: 'category_id' });//cambiar foreingKey

MicroActividad.hasMany(Timer, { foreignKey: 'category_id' });//cambiar foreingKey
Timer.belongsTo(MicroActividad, { foreignKey: 'category_id' }); //cambiar foreingKey


export {
    User,
    Category,
    MicroActividad,
    Timer
};