const Joi = require('joi');

const crearUsuarioSchema = Joi.object({
    correo: Joi.string().email().required(),
    contrasena: Joi.string().required()
});

module.exports = { crearUsuarioSchema };