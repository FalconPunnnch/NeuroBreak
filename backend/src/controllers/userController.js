import userService from "../services/userService";

exports.register = async (req,res) => {
    try {
        const user = await userService.registrarUsuario(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(400).json({error: err.message});
    }
};

exports.login = async (req,res) => {
    try {
        const user = await userService.iniciarSesion(req.body.email, req.body.contraseña);
        res.json(user); 
    }catch(err){
        res.status(401).json({error: err.message});
    }
};