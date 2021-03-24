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


const actualizarMedico = async (req, res = response) => {

    const id = req.params.id
    const uid = req.uid;

    try {
        const medico = await Medico.findById( id );
        if( !medico ){
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } ) 

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Hubo un error, hable con el admin'
        })


    }

}


const borrarMedico = async (req, res = response) => {

    const id = req.params.id

    try {
        const medico = await Medico.findById( id );
        if( !medico ){
            return res.status(400).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            })
        }


        const medicoActualizado = await Medico.findByIdAndDelete( id )

        res.json({
            ok: true,
            msg: 'Médico eliminado'
        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Hubo un error, hable con el admin'
        })


    }

}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}