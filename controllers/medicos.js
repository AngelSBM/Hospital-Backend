const { response } = require('express');
const Medico = require('../models/medico.model');



const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
                        .populate( 'hospital', 'nombre' )
                        .populate( 'usuario', 'nombre' )

    res.json({
        ok: true,
        medicos
    }); 

}

const crearMedico = async (req, res = response) => {

    const uid = req.uid; 
    const { nombre, hid } = req.body

    const medico = new Medico({
        nombre: nombre,
        usuario: uid,
        hospital: hid
    });

    try {

        const medicoDB = await medico.save();
    
        res.json({
            ok: true,
            medicoDB
        });

    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Algo salió mal creando un médico'
        });

    }


}


const actualizarMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'Actualizar medicos'
    });

}


const borrarMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'Borrar medicos'
    });

}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}