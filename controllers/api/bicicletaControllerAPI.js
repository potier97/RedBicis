var Bicicleta = require('../../models/bicicleta');


exports.bicicleta_list = function(req, res){
    Bicicleta.find({},function(err, bicicletas){
        res.status(200).json({
            bicicletas: bicicletas
        });
    });   
}

exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta({ code: req.body.code, color: req.body.color, modelo: req.body.modelo });
    bici.ubicacion = [req.body.lat, req.body.lng];

    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_update = function(req, res){
    
    Bicicleta.findByCode(req.params.id, function(error, bici){
        
        bici.code = req.body.code;
        bici.color = req.body.color;
        bici.modelo  = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];
        
        Bicicleta.update(bici, (err, raw) => {

            res.status(200).json({
                bicicleta: bici
            });

        });
    }); 
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeByCode(req.body.code, (err, raw) => {
        
        res.status(204).send();

    });
    
}