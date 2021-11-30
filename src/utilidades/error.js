class CustomError extends Error {
    constructor(mensaje){
        super();

        this.message = mensaje;
    }
}