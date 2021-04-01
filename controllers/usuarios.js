const { response } = require('express');
const Usuario = require('../models/usuario.model')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async (req, res) => {
   
    const desde = Number(req.query.desde) || 0;
    
    const[  usuarios, total ] = await Promise.all([
        
    Usuario
        .find({}, 'nombre email nombre role google img')
        .skip( desde )
        .limit( 5 ),

    Usuario.countDocuments()

    ]);

    res.json({
        ok: true,
        usuarios,
        total
    })

}


const crearUsuario = async (req, res = response) => {

    const { password, email } = req.body;


    try {
    
        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
        
        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        //Guardar usuario
        await usuario.save();

        //Generar el JWT
        const token = await generarJWT( usuario.id );

         res.json({
            ok: true,
            usuario: usuario,
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }
    

}


const actualizarUsuario = async (req, res = response) => {
    

    const uid = req.params.id;

    try {

        //TODO: Validar token y validar si es el usario correcto


        const usuarioDB = await Usuario.findById(uid);
        

        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese ID'
            });
        }


        const { password, google, email, ...campos } = req.body;

        if( usuarioDB.email !== email ){
            
            const existeEmail = await Usuario.findOne({ email});
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if( !usuarioDB.google ){
            campos.email = email;    
        }else if ( usuarioDB.email !== email ){
            return res.status(400).json({
                ok: false,
                msg: 'Si usted se registró con Google, no puede cambiar el correo electrónico'
            });
        }        

        //Actualizaciones necesarias
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

        
    } catch (error) {
        console.log(error);
        res.status(400).json({ 
            ok: false,
            msg: 'Error al actualizar usuario'
        });
    }

}


const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario que desea eliminar no existe'
            });
        }

        await Usuario.findByIdAndDelete( uid );
        
        return res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        })


    } catch (error) {
        
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Algo ha salido mal borrando el usuario'
        });

    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}