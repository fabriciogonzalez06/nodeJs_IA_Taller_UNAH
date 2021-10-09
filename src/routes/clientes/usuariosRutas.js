const { Router } = require('express');
const { 
    crearCliente, 
    obtenerCliente, 
    eliminarCliente,
    obtenerClientes, 
    actualizarCliente, 
} = require('../../controllers/clientes/clientesControlador');
const { validarToken } = require('../../middlewares/token');


const api = Router();

api.get('/', validarToken, obtenerClientes);
api.get('/:id', validarToken, obtenerCliente);
api.post('/', validarToken, crearCliente);
api.put('/:id', validarToken, actualizarCliente);
api.delete('/:id', validarToken, eliminarCliente);


module.exports = api;
