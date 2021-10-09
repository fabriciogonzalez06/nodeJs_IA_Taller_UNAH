const { Router } = require('express');
const {
    obtenerTransacciones,
    crearTransaccion,
    actualizarTransaccion,
    eliminarTransaccion
} = require('../../controllers/transacciones/transaccionesControlador');
const { validarToken } = require('../../middlewares/token');

const api = Router();

api.get('/', validarToken, obtenerTransacciones);
api.post('/', validarToken, crearTransaccion);
api.put('/:id/:idCliente', validarToken, actualizarTransaccion);
api.delete('/:id/:idCliente',validarToken, eliminarTransaccion);

module.exports = api;