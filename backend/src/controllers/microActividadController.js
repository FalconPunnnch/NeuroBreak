import microActividadService from "../services/microActividadService";

exports.getAll = async (req,res) => {
    const actividad = await microActividadService.listaMicroActividad();
    res.json(actividad);
};

exports.create = async (req,res) => {
    const nueva = await microActividadService.crearMicroActividad(req.body);
    res.status(201).json(nueva);
};

