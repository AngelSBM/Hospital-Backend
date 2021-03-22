/* 
    api/medicos

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('./../controllers/medicos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('./../middlewares/validar-campos');


const router = Router();

router.get( '/', getMedicos );


router.post( '/',
        [
                validarJWT,
                check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
                check('hid', 'El hospitalID debe de ser válido').isMongoId(), 
                validarCampos
        ],
        crearMedico );
 

router.put('/:id',
        [],
        actualizarMedico );        

router.delete('/:id', borrarMedico )


module.exports = router; 