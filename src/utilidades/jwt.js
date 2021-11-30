const jwt = require('jsonwebtoken');
const { CONFIG } = require('../../config');
const CustomError = require('../utilidades/error');

const generarToken = (datos) => {

    if(!datos || typeof datos !== 'object'){
        throw new CustomError('Se esperaba un objeto');
    }

    try {
        return jwt.sign(datos, CONFIG.LLAVE_PRIVADA_TOKEN, { expiresIn: '1h' });
    } catch ({ message }) {
        throw new CustomError(message);
    }
}

const obtenerDatosToken = (token) => {
    try {
        return jwt.verify(token, CONFIG.LLAVE_PRIVADA_TOKEN);
    }  catch ({ message }) {
        return null;
    }
}

module.exports = { obtenerDatosToken, generarToken };