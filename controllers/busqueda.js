const { response, request } = require('express');
const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

const getTodo = async ( req = request, res = response ) => {

    const busqueda = req.params.busqueda;

    const regex = new RegExp( busqueda, 'i' );

    const usuarios = await Usuario.find({ nombre: regex });
    const medicos = await Medico.find({ nombre: regex });
    const hospitales = await Hospital.find({ nombre: regex });

    try {
                
        res.status(200).json({
            ok: true,
            busqueda,
            usuarios,
            medicos,
            hospitales
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hubo un error buscando el usuario'
        });
    }

}


const getDocumentosColeccion = async ( req = request, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img')

        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }
    
    res.json({
        ok: true,
        resultados: data
    })


}




module.exports = {
    getTodo,
    getDocumentosColeccion  
}