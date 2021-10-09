const Joi = require('joi');


module.exports.obtenerTransaccionesSchema = Joi.object({
    id: Joi.number().positive(),
    idCliente: Joi.number().positive(),
    idTipoTransaccion: Joi.number().positive(),
});


module.exports.crearTransaccionesSchema = Joi.object({
    idCliente: Joi.number().required().positive(),
    idTipoTransaccion: Joi.number().required().positive(),
    idUsuario: Joi.number().required().positive(),
    cantidad: Joi.number().positive().required(),
    comentario: Joi.string(),
});

module.exports.actualizarTransaccionesSchema = Joi.object({
    id: Joi.number().required().positive(),
    idCliente: Joi.number().required().positive(),
    idTipoTransaccion: Joi.number().required().positive(),
    idUsuario: Joi.number().required().positive(),
    cantidad: Joi.number().positive().required(),
    comentario: Joi.string(),
});

module.exports.eliminarTransaccionesSchema = Joi.object({
    id: Joi.number().required().positive(),
    idCliente: Joi.number().required().positive(),
    idUsuario: Joi.number().required().positive()
});

