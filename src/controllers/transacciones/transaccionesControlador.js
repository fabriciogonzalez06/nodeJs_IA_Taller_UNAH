const { query } = require("express");
const Dbhelper = require("../../database/dbHelper");
const { obtenerTransaccionesSchema, crearTransaccionesSchema, actualizarTransaccionesSchema, eliminarTransaccionesSchema } = require("../../schemas/transacciones/transaccionesSchema");
const RespuestaHttp = require("../../utilidades/respuesta");

const obtenerTransacciones = async (req, res) => {
    const { query } = req;
    const { id, idCliente, idTipoTransaccion } = query;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await obtenerTransaccionesSchema.validateAsync(query);
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }

    try {
        const respuesta = await dbHelper.sp('call sp_tbl_transacciones(?,?,?)', [id, idCliente, idTipoTransaccion]);
        resHttp.respuesta = respuesta;
        return res.status(200).send(resHttp);

    } catch (error) {
        resHttp.existeError = true;
        resHttp.mensaje = error;
        return res.status(400).send(resHttp);
    }
}

const crearTransaccion = async (req, res) => {
    const { body, idUsuario } = req;
    const { idCliente, idTipoTransaccion, cantidad, comentario } = body;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await crearTransaccionesSchema.validateAsync({ ...body, idUsuario });
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }

    try {
        const respuesta = await dbHelper.sp('call sp_tbl_transacciones_crear_actualizar(?,?,?,?,?,?)', [null, idTipoTransaccion, idCliente, idUsuario, cantidad, comentario]);
        resHttp.respuesta = respuesta;
        return res.status(200).send(resHttp);

    } catch (error) {
        resHttp.existeError = true;
        resHttp.mensaje = error;
        return res.status(400).send(resHttp);
    }
}


const actualizarTransaccion = async (req, res) => {
    const { body, idUsuario, params } = req;
    const { id, idCliente } = params;
    const { idTipoTransaccion, cantidad, comentario } = body;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await actualizarTransaccionesSchema.validateAsync({ ...body, idUsuario, ...params });
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }

    try {
        const respuesta = await dbHelper.sp('call sp_tbl_transacciones_crear_actualizar(?,?,?,?,?,?)', [id, idTipoTransaccion, idCliente, idUsuario, cantidad, comentario]);
        resHttp.respuesta = respuesta;
        return res.status(200).send(resHttp);

    } catch (error) {
        resHttp.existeError = true;
        resHttp.mensaje = error;
        return res.status(400).send(resHttp);
    }
}


const eliminarTransaccion = async (req, res) => {
    const { params, idUsuario = 1 } = req;
    const { id, idCliente } = params;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await eliminarTransaccionesSchema.validateAsync({ ...params, idUsuario });
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }

    try {
        const respuesta = await dbHelper.sp('call sp_tbl_transaccion_eliminar(?,?,?)', [id, idCliente, idUsuario]);
        resHttp.respuesta = respuesta;
        return res.status(200).send(resHttp);

    } catch (error) {
        resHttp.existeError = true;
        resHttp.mensaje = error;
        return res.status(400).send(resHttp);
    }
}

module.exports = { obtenerTransacciones, crearTransaccion, actualizarTransaccion, eliminarTransaccion };