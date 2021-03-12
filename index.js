const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./db/config');

//Crear el servidor express
const app = express();


// Base de datos
dbConnection();


console.log( process.env );


//rutas
app.get( '/', (req, res) => {
    
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })

} );




app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
} )