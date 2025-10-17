import MicroActividad from "../models/microActividad";


async function listaMicroActividad() {
    return await MicroActividad.findAll();
}

async function crearMicroActividad(data) {
    return await MicroActividad.create(data);
}

async function filtrarCategoria(category) {
    return await MicroActividad.findAll ({where: {category}});
}

export default {listaMicroActividad, crearMicroActividad, filtrarCategoria};