
const dotenv = require('dotenv');

dotenv.config();

const validarVariableDeEntorno = (nombre) => {
    const valor = process.env[nombre];

    if (!valor) {
        throw new Error(`La variable de entorno ${nombre} es requerida`);
    }

    return valor;

}



const CONFIG = {
    ENV: validarVariableDeEntorno('ENV'),
    PORT: validarVariableDeEntorno('PORT'),
    HOST: validarVariableDeEntorno('HOST'),
    USER: validarVariableDeEntorno('USER'),
    PASSWORD: process.env['ENV'] === 'development' ? '': validarVariableDeEntorno('PASSWORD'),
    DATABASE:   validarVariableDeEntorno('DATABASE'),
    DB_PORT: validarVariableDeEntorno('DB_PORT'),
    LLAVE_PRIVADA_TOKEN: validarVariableDeEntorno('LLAVE_PRIVADA_TOKEN')
}

module.exports = { CONFIG }



