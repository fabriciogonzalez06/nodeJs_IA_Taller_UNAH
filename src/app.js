const { CONFIG } = require('./../config');
const express = require('express');
const rutas = require('./routes/index');

const app = express();
const port = CONFIG.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({ message: 'I am alive!' });
});
app.use('/api', rutas);


app.listen(port, () => {
    console.log(`corriento en el puerto ${port} en modo ${CONFIG.ENV}`)
});