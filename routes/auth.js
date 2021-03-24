/* 

    api/login

*/


const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('./../controllers/auth');

const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos');
const { validarJWT } = require('./../middlewares/validar-jwt');

const router = Router();


router.get('/renew', 
        validarJWT,    
        renewToken
    );


router.post('/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
);


router.post('/google', 
    [
        check('token', 'El token de google es obligaorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
);




module.exports = router;