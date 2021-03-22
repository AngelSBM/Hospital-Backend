const path = require('path')
const fs = require('fs');

const { response, request } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');



const fileUpload = ( req = request, res = response ) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    if( !tiposValidos.includes(tipo) ){
        res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    //Validar que esxista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: 'false',
            msg: 'No se subió ningún archivo'
        });
    }


    //Procesar la imagen...
    const file = req.files.imagen
    

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];  

    // Validar Extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if( !extensionesValidas.includes(extensionArchivo) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        })
    }

    //Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;


    //Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    file.mv( path , (err) => {
        if (err) {
            console.log(err);
          return res.status(500).json({
              ok: false,
              msg: 'Hubo un error subiendo la imagen'
          });
        }
         
        
        actualizarImagen( tipo, id, nombreArchivo );


        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    
      });


}


const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.join( __dirname, `./../uploads/${ tipo }/${ img }` );

    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else{
        const pathImg = path.join( __dirname, `./../uploads/no-image.png` );
        res.sendFile( pathImg );
    }



}


module.exports = {
    fileUpload,
    retornaImagen
}