/* 
    Ruta: /api/usuarios

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');

const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');
const { validarCampos } = require('./../middlewares/validar-campos');

const router = Router();

router.get( '/', validarJWT, getUsuarios );


router.post( '/',
        [
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('password', 'La contraseña es oblogatoria').not().isEmpty(),
            check('email', 'El email es obligatorio').isEmail(),
            validarCampos,
        ],
        crearUsuario );
 

router.put('/:id',
        [
            validarJWT,
            validarADMIN_ROLE_o_MismoUsuario, 
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'El email es obligatorio').isEmail(),
            check('role', 'El role es obligatorio').not().isEmpty(),
            validarCampos
        ],
        actualizarUsuario);        

router.delete('/:id', [ validarJWT, validarADMIN_ROLE ], borrarUsuario)


module.exports = router; 