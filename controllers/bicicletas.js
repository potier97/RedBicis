var Bicicleta = require('../models/bicicleta');

exports.bicicleta_lista = function(req, res){ console.log( Bicicleta.allBicis);
    Bicicleta.allBicis((err, bicicletas) =>{ console.log(bicicletas);
        res.render('bicicletas/index', {bicis: bicicletas})
    });
    
}
exports.bicicleta_crete_get = function(req, res){
    res.render('bicicletas/create');
}

exports.bicicleta_crete_post = function(req, res){
    var bici = new Bicicleta({ code: req.body.code, color: req.body.color, modelo: req.body.modelo });
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function(req, res){
    
    Bicicleta.findById(req.params.id, function(err, bici){ console.log(bici);
        res.render('bicicletas/update', {bici});
    });
}

exports.bicicleta_update_post = function(req, res){
    var bici = Bicicleta.findById(req.params.id); 

    bici.code = req.body.code;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo; 
    bici.ubicacion = [req.body.lat, req.body.lng];

    Bicicleta.update(bici);
       
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res){
    
    Bicicleta.removeByCode(req.body.code, (err, raw) => {
        
        res.redirect('/bicicletas');

    });

}
