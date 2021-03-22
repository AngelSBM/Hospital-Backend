/* 

    api/uploads

*/


const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const expressFileUpload = require('express-fileupload');

const { Router } = require('express');


const router = Router();

router.use( expressFileUpload() );

router.put('/:tipo/:id', validarJWT, fileUpload );

router.get('/:tipo/:img', retornaImagen );




module.exports = router; 