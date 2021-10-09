const { Router } = require('express');
const { obtenerTipoTransacciones } = require('../../controllers/tipoTransacciones/tipoTransaccionesControlador');

const api = Router();

api.get('/', obtenerTipoTransacciones);

module.exports = api;