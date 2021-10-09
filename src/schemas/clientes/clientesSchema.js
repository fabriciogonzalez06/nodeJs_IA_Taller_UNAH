const Joi = require('joi');

const crearClienteSchema = Joi.object({
    nombreCompleto: Joi.string().required()
});

module.exports = { crearClienteSchema };