/* 
    api/medicos

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, getMedicoById,crearMedico, actualizarMedico, borrarMedico } = require('./../controllers/medicos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('./../middlewares/validar-campos');


const router = Router();

router.get( '/',
        [validarJWT],
        getMedicos );


router.post( '/',
        [
                validarJWT,
                check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
                check('hid', 'El hospitalID debe de ser válido').isMongoId(), 
                validarCampos
        ],
        crearMedico );
 

router.put('/:id',
        [
                validarJWT,
                check('nombre', 'El nuevo nombre del médico es necesario').not().isEmpty(),
                check('hid', 'El hospitalID debe de ser válido').isMongoId(), 
                validarCampos
        ],
        actualizarMedico );        

router.delete('/:id', validarJWT, borrarMedico );

router.get('/:id', validarJWT, getMedicoById );

module.exports = router; 