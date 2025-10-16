import {DataTypes} from requiere('sequelize');
import sequelize from requiere('../config/dataBase.js');
import Category from '../category.js';

const MicroActividad = sequelize.define('MicroActividad',{
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    id_categoria: {
        type: DataTypes.BIGINT,
        allowNull: false,
        reference:{
            model: Category,
            key: 'id'
        }
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    instruccion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

export default MicroActividad;