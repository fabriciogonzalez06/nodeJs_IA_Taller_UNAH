const Dbhelper = require("../../database/dbHelper");
const { crearClienteSchema } = require("../../schemas/clientes/clientesSchema");
const RespuestaHttp = require("../../utilidades/respuesta");



const obtenerClientes = async (req, res) => {

    const dbHelper = new Dbhelper();
    const httpRes = new RespuestaHttp();

    try {

        const resultado = await dbHelper.sp("call sp_tbl_clientes(?)", [null]);

        httpRes.respuesta = resultado;

        return res.status(200).send(httpRes);

    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(200).send(httpRes);
    }
}
const obtenerCliente = async (req, res) => {

    const { params: { id } } = req;

    const dbHelper = new Dbhelper();
    const httpRes = new RespuestaHttp();

    try {

        const resultado = await dbHelper.sp("call sp_tbl_clientes(?)", [id]);

        httpRes.respuesta = resultado;

        return res.status(200).send(httpRes);

    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }
}
const crearCliente = async (req, res) => {

    const { body, idUsuario } = req;
    const { nombreCompleto } = body;

    const dbHelper = new Dbhelper();
    const httpRes = new RespuestaHttp();

    try {
        await crearClienteSchema.validateAsync(body);
    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }

    try {

        const resultado = await dbHelper.sp("call sp_tbl_clientes_crear_actualizar(?,?,?)", [null, nombreCompleto, idUsuario]);

        httpRes.respuesta = resultado;

        return res.status(200).send(httpRes);

    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }
}
const actualizarCliente = async (req, res) => {

    const { body, params, idUsuario } = req;
    const { id } = params;
    const { nombreCompleto } = body;

    const dbHelper = new Dbhelper();
    const httpRes = new RespuestaHttp();

    try {
        await crearClienteSchema.validateAsync(body);
    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }

    try {

        const resultado = await dbHelper.sp("call sp_tbl_clientes_crear_actualizar(?,?,?)", [id, nombreCompleto, idUsuario]);

        httpRes.respuesta = resultado;

        return res.status(200).send(httpRes);

    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }
}
const eliminarCliente = async (req, res) => {

    const { params, idUsuario } = req;
    const { id } = params;

    const dbHelper = new Dbhelper();
    const httpRes = new RespuestaHttp();

    try {

        const resultado = await dbHelper.sp("call sp_tbl_clientes_eliminar(?,?)", [id, idUsuario]);

        httpRes.respuesta = resultado;

        return res.status(200).send(httpRes);

    } catch ({ message }) {
        httpRes.existeError = true;
        httpRes.mensaje = message;
        return res.status(400).send(httpRes);
    }

}


module.exports = {
    obtenerClientes,
    obtenerCliente,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};