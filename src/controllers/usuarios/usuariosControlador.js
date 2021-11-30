const Joi = require('joi');

const Dbhelper = require("../../database/dbHelper");
const { generarToken } = require('../../utilidades/jwt');
const RespuestaHttp = require("../../utilidades/respuesta");
const { encryptarContrasena, compararContrasena } = require('../../utilidades/bcrypt');
const { crearUsuarioSchema } = require('../../schemas/usuarios/usuariosSchema');

const ingreso = async (req, res) => {

    const { body } = req;
    const { correo, contrasena } = body;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await crearUsuarioSchema.validateAsync(body);
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }


    try {

        const usuario = await dbHelper.query('select * from tbl_usuario where correo = ?', [correo]);

        if (usuario.length === 0) {
            resHttp.existeError = true;
            resHttp.mensaje = 'Usuario o contraseña incorrecta (correo)';
            return res.status(400).send(respuesta);
        }

        const contrasenaCorrecta = await compararContrasena(contrasena, usuario[0].contrasena);

        if (!contrasenaCorrecta) {
            resHttp.existeError = true;
            resHttp.mensaje = 'Usuario o contraseña incorrecta (contrasena)';
            return res.status(400).send(resHttp);
        }

        const payload = {
            id: usuario[0].id,
            correo: usuario[0].correo
        };

        const token = generarToken(payload);

        resHttp.respuesta = token;
        return res.status(200).send(resHttp);

    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}

const obtenerUsuarios = async (req, res) => {
    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();
    try {

        const datos = await dbHelper.query('select id, correo, fechaRegistro from tbl_usuario');
        resHttp.respuesta = datos;
        return res.status(200).send(resHttp);

    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}

const obtenerUsuario = async (req, res) => {
    const { params } = req;
    const { id } = params;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {

        const datos = await dbHelper.query('select id, correo, fechaRegistro from tbl_usuario where id = ?', [id]);

        if (datos.length === 0) {
            resHttp.existeError = true;
            resHttp.mensaje = "No se encontro el usuario";
            return res.status(400).send(resHttp);
        }
        resHttp.respuesta = datos;
        return res.status(200).send(resHttp);

    } catch ({ message }) {

        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}

const crearUsuario = async (req, res) => {

    const { body } = req;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();

    try {
        await crearUsuarioSchema.validateAsync(body);
    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }

    const { correo, contrasena } = body;

    try {

        const contrasenaEncryptada = await encryptarContrasena(contrasena);

        const usuario = await dbHelper.sp('call sp_tbl_usuario_crear(?,?)', [correo, contrasenaEncryptada]);

        resHttp.respuesta = usuario;
        resHttp.mensaje = 'Usuario creado correctamente';
        return res.status(200).send(resHttp);

    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}


const eliminarUsuario = async (req, res) => {

    const { params: { id } } = req;

    const dbHelper = new Dbhelper();
    const resHttp = new RespuestaHttp();
    try {

        const respuesta = await dbHelper.sp('call sp_tbl_usuario_eliminar(?)', [id]);

        resHttp.respuesta = respuesta;
        resHttp.mensaje = "usuario eliminado correctamente";
        return res.status(200).send(resHttp);

    } catch ({ message }) {
        resHttp.existeError = true;
        resHttp.mensaje = message;
        return res.status(400).send(resHttp);
    }
}

module.exports = { obtenerUsuarios, obtenerUsuario, crearUsuario, eliminarUsuario, ingreso };