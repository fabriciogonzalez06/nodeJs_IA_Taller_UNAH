const { Router } = require('express');
const { obtenerTipoTransacciones } = require('../../controllers/tipoTransacciones/tipoTransaccionesControlador');
const { validarToken } = require('./../../middlewares/token');

const api = Router();

api.get('/', validarToken, obtenerTipoTransacciones);

module.exports = api;