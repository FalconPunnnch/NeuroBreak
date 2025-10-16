import {DataTypes} from requiere('sequelize');
import sequelize from requiere('../config/dataBase.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ocupacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol:{
        type: DataTypes.ENUM('Estudiante', 'Administrador'),
        defaultvalue: 'Estudiante'
    }
});

export default User;