import {DataTypes} from requiere('sequelize');
import sequelize from requiere('../config/dataBase.js');

const Category = sequelize.define('Category',{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {   
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default Category;