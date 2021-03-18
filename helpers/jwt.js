const jwt = require('jsonwebtoken');




const generarJWT = ( uid ) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid,
        }
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h',
            
        }, ( error, token ) => {
    
            if( error ){
                console.log(error);
                resolve('No se pudo generar el JWT')
            } else{
                resolve( token );
            }    
    
        });



    });
s
}




module.exports = {
    generarJWT,
}