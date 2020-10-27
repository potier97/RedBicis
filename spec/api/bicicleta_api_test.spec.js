
var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var request = require('request');
var server = require('../../bin/www');


describe('Bicicleta API', ()=>{

    beforeEach(function(done){
        Bicicleta.allBicis = [];
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error') );
        db.once('open', function(){
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });
    });

    describe('GET BICICLETAS /', ()=>{
        it('status 200', (done)=>{
            expect(Bicicleta.allBicis.length).toBe(0);  //Tiene que estar vacío el array
            
            var aBici = new Bicicleta({ code:1, color:'violeta', modelo:'montaña', ubicacion: [-34.6112424, -58.5412424] });
            Bicicleta.add(aBici);
            
            request.get('http://localhost:3000/api/bicicletas', function(error, response, body){
                expect(response.statusCode).toBe(200);
            });

            done();
        });
    });
  
    describe('POST BICICLETAS /create', ()=>{
        it('status 200', (done)=>{
            var headers = {'content-type':'application/json'}
            
            var aBici = '{"code":10, "color":"violeta", "modelo":"urbana", "lat":-34.6112424, "lng":-58.5412424}';
           
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: aBici
            },function(error, response, body){  
                Bicicleta.findByCode(10, (err, bBici) => { 
                    expect(response.statusCode).toBe(200);
                    expect(bBici.color).toBe('violeta');
                    done();
                });
            });
        });
    });

    describe('PUT BICICLETAS /update', ()=>{
        it('status 200', (done)=>{

            expect(Bicicleta.allBicis.length).toBe(0);  //Tiene que estar vacío el array
            
            //Se crea el registro a actualizar
            var aBici = new Bicicleta({ code:10, color:'violeta', modelo:'montaña', ubicacion: [-34.6112424, -58.5412424] });
            Bicicleta.add(aBici);

            var headers = {'content-type':'application/json'}
            
            var aBici = '{"code":10, "color":"amarillo", "modelo":"urbana", "lat":-34.6112424, "lng":-58.5412424}';
           
            request.put({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/update/' + 10,
                body: aBici
            }, function(error, response, body){   
                Bicicleta.findByCode(10, (err, bBici) => { 
                    expect(response.statusCode).toBe(200);
                    expect(bBici.color).toBe('amarillo');
                    done();
                });
            });
        });
    });


    describe('DELETE BICICLETAS /delete', ()=>{
        it('status 200', (done)=>{

            expect(Bicicleta.allBicis.length).toBe(0);  //Tiene que estar vacío el array
            
            //Se crea el registro a actualizar
            var aBici = new Bicicleta({ code:10, color:'violeta', modelo:'montaña', ubicacion: [-34.6112424, -58.5412424] });
            Bicicleta.add(aBici);

            var headers = {'content-type':'application/json'}
            
            var code = '{"id":10}';
        
            request.delete({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/delete',
                body: code
            }, function(error, response, body){   
               
                    expect(response.statusCode).toBe(204);
                    done();
               
            });
        });
    });
    
});
