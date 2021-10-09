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
    const respuesta = new RespuestaHttp();

    try {
        await crearUsuarioSchema.validateAsync(body);
    } catch ({ message }) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }


    try {

        const usuario = await dbHelper.query('select * from tbl_usuario where correo = ?', [correo]);

        if (usuario.length === 0) {
            respuesta.existeError = true;
            respuesta.mensaje = 'Usuario o contraseña incorrecta (usuarios)';
            return res.status(400).send(respuesta);
        }

        const contrasenaCorrecta = await compararContrasena(contrasena, usuario[0].contrasena);

        if (!contrasenaCorrecta) {
            respuesta.existeError = true;
            respuesta.mensaje = 'Usuario o contraseña incorrecta (contrasena)';
            return res.status(400).send(respuesta);
        }

        const payload = {
            id: usuario[0].id,
            correo: usuario[0].correo
        };

        const token = generarToken(payload);

        respuesta.respuesta = token;
        return res.status(200).send(respuesta);

    } catch ({ mensaje }) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }
}

const obtenerUsuarios = async (req, res) => {
    const dbHelper = new Dbhelper();
    const respuesta = new RespuestaHttp();
    try {

        const datos = await dbHelper.query('select * from tbl_usuario');
        respuesta.respuesta = datos;
        return res.status(200).send(respuesta);

    } catch (message) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }
}

const obtenerUsuario = async (req, res) => {
    const { params } = req;
    const { id } = params;

    const respuesta = new RespuestaHttp();
    const dbHelper = new Dbhelper();

    try {

        const datos = await dbHelper.query('select id, correo from tbl_usuario where id = ?', [id]);

        if (datos.length === 0) {
            respuesta.existeError = true;
            respuesta.mensaje = "No se encontro el usuario";
            return res.status(400).send(respuesta);
        }
        respuesta.respuesta = datos;
        return res.status(200).send(respuesta);

    } catch (message) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }
}

const crearUsuario = async (req, res) => {

    const { body } = req;

    const dbHelper = new Dbhelper();
    const respuesta = new RespuestaHttp();

    try {
        await crearUsuarioSchema.validateAsync(body);
    } catch ({ message }) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }

    const { correo, contrasena } = body;

    try {

        const exists = await dbHelper.query('select 1 from  tbl_usuario where correo = ?', [correo]);

        if (exists.length > 0) {
            respuesta.existeError = true;
            respuesta.mensaje = 'Usuario ya existe';
            return res.status(400).send(respuesta);
        }

        const contrasenaEncryptada = await encryptarContrasena(contrasena);

        const datos = await dbHelper.query('insert into tbl_usuario(correo, contrasena) values(?,?)', [correo, contrasenaEncryptada]);

        const idInsertado = datos['insertId'];

        const [usuario] = await dbHelper.query('select id, correo from tbl_usuario where id = ?', [idInsertado]);

        respuesta.respuesta = usuario;
        respuesta.mensaje = 'Usuario creado correctamente';
        return res.status(200).send(respuesta);

    } catch ({ message, ...rest }) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }
}


const eliminarUsuario = async (req, res) => {

    const { params: { id } } = req;

    const dbHelper = new Dbhelper();
    const respuesta = new RespuestaHttp();
    try {

        const exists = await dbHelper.query('select 1 from tbl_usuario where id = ?', [id]);

        if (exists.length === 0) {
            respuesta.existeError = true;
            respuesta.mensaje = 'No se encontró usuario a eliminar';
            return res.status(400).send(respuesta);
        }

        const datos = await dbHelper.query('delete from tbl_usuario where id = ?', [id]);
        respuesta.respuesta = datos;
        respuesta.mensaje = "usuario eliminado correctamente";
        return res.status(200).send(respuesta);

    } catch (message) {
        respuesta.existeError = true;
        respuesta.mensaje = message;
        return res.status(400).send(respuesta);
    }
}

module.exports = { obtenerUsuarios, obtenerUsuario, crearUsuario, eliminarUsuario, ingreso };