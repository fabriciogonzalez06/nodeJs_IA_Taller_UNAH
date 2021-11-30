const Dbhelper = require("../../database/dbHelper");
const RespuestaHttp = require("../../utilidades/respuesta");

const obtenerTipoTransacciones = async (req, res) => {
    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        const respuesta = await dbHelper.query('select * from tbl_tipoTransaccion');
        resHttp.respuesta = respuesta;
        return res.status(200).send(resHttp);

    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}

module.exports = { obtenerTipoTransacciones };