const bcrypt = require('bcrypt');
const CustomError = require('../utilidades/error');

const encryptarContrasena = async (contrasena) => {
    try {
        return await bcrypt.hash(contrasena, 10);
    } catch ({ message }) {
        throw new CustomError(message);
    }
}

const compararContrasena = async (contrasena, contrasenaEncriptada) => {
    try {
        return await bcrypt.compare(contrasena, contrasenaEncriptada);
    } catch (error) {
        return false;
    }
}


module.exports = { encryptarContrasena, compararContrasena };
