const { obtenerDatosToken } = require("../utilidades/jwt");
const RespuestaHttp = require("../utilidades/respuesta");

const validarToken = (req, res, next) => {
    const respuesta = new RespuestaHttp();

    try {
        const { headers } = req;

        const token = headers['Authorization'] || headers['authorization'];

        if (!token) {
            respuesta.existeError = true;
            respuesta.mensaje = "token es requerido";
            return res.status(401).send(respuesta);
        }

        const datosUsuario = obtenerDatosToken(token);

        if (!datosUsuario) {
            respuesta.existeError = true;
            respuesta.mensaje = "Sus credenciales expirarón";
            return res.status(401).send(respuesta);
        }

        req.idUsuario = datosUsuario.id;
        next();

    } catch ({ message }) {
        respuesta.existeError = true;
        respuesta.mensaje = "Ocurrio un error interno";
        return res.status(500).send(respuesta);;
    }
}

module.exports = { validarToken };