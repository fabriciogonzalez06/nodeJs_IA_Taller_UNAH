const bcrypt = require('bcrypt');

const encryptarContrasena = async (contrasena) => {
    try {
        return await bcrypt.hash(contrasena, 10);
    } catch ({ message }) {
        throw new Error(message);
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
