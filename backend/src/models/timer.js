import {DataTypes} from requiere('sequelize');
import sequelize from requiere('../config/dataBase.js');
import user from requiere ('./user.js');
import MicroActividad from "./microActividad";

const Timer = sequelize.define('Timer',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    inicioSesion: {
        type: DataTypes.TIME,
        allowNull:  false},
   
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false},
    
    completado: {
        type: DataTypes.BOOLEAN,
        allowNull: false},
    
    fecha: {
        type: DataTypes.DATE,
        allowNull: false}
});

export default Timer;