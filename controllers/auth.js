const { response } = require('express');
const Usuario = require('../models/usuario.model')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');


const login = async (req, res = response) => {

    const { password, email } = req.body;

    try {
        
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }


        //Generar un Token
        const token = await generarJWT( usuarioDB.id );

        res.status(200).json({
            ok: true,
            msg: token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

}


const googleSignIn = async( req, res = response ) => {
    
    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: "",
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();
        
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });

    } catch (error) {
        
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }




}


const renewToken = async ( req, res ) => {

    const uid = req.uid;

    const token = await generarJWT( uid );


    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd( usuario.role )
    }) 

}


module.exports = {
    login,
    googleSignIn,
    renewToken
}