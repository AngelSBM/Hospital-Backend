/* 

    api/todo

*/


const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('./../middlewares/validar-campos');
const { getTodo, getDocumentosColeccion } = require('../controllers/busqueda');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo );

router.get('/colecciones/:tabla/:busqueda', validarJWT, getDocumentosColeccion );

module.exports = router; 