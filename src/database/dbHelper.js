const mysql = require('mysql');

const { CONFIG } = require('../../config');

class Dbhelper {

    constructor() {
    }


    #retornarConexion() {
        return mysql.createConnection({
            host: CONFIG.HOST,
            user: CONFIG.USER,
            password: CONFIG.PASSWORD,
            database: CONFIG.DATABASE,
            port: CONFIG.DB_PORT
        });
    }

    sp(nombreSp, parametros = []) {
        return new Promise((resolve, reject) => {
            try {
                const conexion = this.#retornarConexion();

                conexion.connect(error => {
                    if (error) {
                        reject(`No se pudo conectar a la base de datos ${error}`);
                    }
                });
                conexion.query(nombreSp, parametros, (error, results, fields) => {

                    if (error) {

                        const { sqlMessage, sqlState } = error;

                        if(sqlState === '60000' || sqlState === 6000){
                            reject(`${sqlMessage}`);
                        }else{
                            reject(`No se pudo realizar la consulta, consulte a su administrador de sistemas. ${sqlMessage  }`);
                        }
                        
                    }else{

                        resolve(results[0]);
                    }
                });
                conexion.end();


            } catch ({ message }) {
                reject(`Ocurrio un error interno ${message}`);
            }
        });

    }

    query(consulta, parametros = []) {
        return new Promise((resolve, reject) => {
            try {
                const conexion = this.#retornarConexion();

                conexion.connect(error => {
                    if (error) {
                        reject(`No se pudo conectar a la base de datos ${error}`);
                    }
                });
                conexion.query(consulta, parametros, (error, results, fields) => {

                    if (error) {
                        reject(`No se pudo realizar la consulta ${error}`);
                    }
                    resolve(results);
                });
                conexion.end();


            } catch ({ message }) {
                reject(`Ocurrio un error interno ${message}`);
            }
        });

    }


}

module.exports = Dbhelper;