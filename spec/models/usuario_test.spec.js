var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Reserva = require('../../models/reserva');
var Usuario = require('../../models/usuario');
var server = require('../../bin/www');

describe('Testing Usuarios', ()=>{
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error') );
        db.once('open', function(){
            console.log('We are connected to test database');
            done();
        });
    })

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err);
            Usuario.deleteMany({},function(err, success){
                if(err) console.log(err);
                Bicicleta.deleteMany({},function(err, success){
                    if(err) console.log(err);
                    done();
                });
            });
        });
    })

    describe('Cuando un usuario reserva una bicicleta', ()=>{
        it('Desde existir la reserva', (done)=>{
            const usuario = new Usuario({nombre: 'Federico'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: 'verde', modelo:'urbana'});
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate() + 1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas);
                    expect(reservas.length).toEqual(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                })
            });
        });
    });
});
