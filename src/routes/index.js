const express = require('express');

const app = express();

const usuariosRutas = require('./usuarios/usuariosRutas');
const clientesRutas = require('./clientes/usuariosRutas');
const transaccionesRutas = require('./transacciones/transaccionesRutas');
const tipoTransaccionesRutas = require('./tipoTransacciones/tipoTransaccionesRutas');

app.use('/usuarios', usuariosRutas);
app.use('/clientes', clientesRutas);
app.use('/transacciones',transaccionesRutas);
app.use('/tipoTransacciones', tipoTransaccionesRutas);


module.exports = app;