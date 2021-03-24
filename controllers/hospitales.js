const { response, request } = require('express');
const Hospital = require('./../models/hospital.model');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                            .populate('usuario', 'nombre email');

    res.json({
        ok: true,
        hospitales
    });

}


const crearHospital = async (req, res = response) => {

    const uid = req.uid;

    const hospital = new Hospital( {
        usuario: uid,
        ...req.body
    } );

    try {

        const hospitalDB = await hospital.save();
        
        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }


}


const actualizarHospital = async (req = request, res = response) => {

    const id    = req.params.id;
    const uid   = req.uid; 

    try {

        const hospital = await Hospital.findById( id );
        if( !hospital ){
            return res.status(500).json({
                ok: false,
                msg: 'Hospital no encontrado por ID'
            });    

        }


        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

 
        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );
 
            
        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



const borrarHospital = async (req, res = response) => { 

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById( id );
        if( !hospital ){
            return res.status(500).json({
                ok: false,
                msg: 'Hospital no encontrado por ID'
            });    

        }

 
        const hospitalActualizado = await Hospital.findByIdAndDelete(id);
 
            
        res.json({
            ok: true,
            msg: 'Hospital elimanado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}