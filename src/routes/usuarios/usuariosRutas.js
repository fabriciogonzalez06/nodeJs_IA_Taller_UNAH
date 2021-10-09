const { Router } = require('express');
const { obtenerUsuarios, obtenerUsuario, crearUsuario, eliminarUsuario, ingreso } = require('../../controllers/usuarios/usuariosControlador');
const { validarToken } = require('../../middlewares/token');

const api = Router();

api.get('/', validarToken, obtenerUsuarios);
api.get('/:id', validarToken, obtenerUsuario);
api.post('/', validarToken, crearUsuario);
api.delete('/:id', validarToken, eliminarUsuario);

api.post('/ingreso', ingreso);

module.exports = api;