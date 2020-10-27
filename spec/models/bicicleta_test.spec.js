var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var server = require('../../bin/www');

describe('Test Bicicletas', function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/red_bicicletas';
        mongoose.connect(mongoDB, {useNewUrlParser:true, useUnifiedTopology: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error') );
        db.once('open', function(){
            console.log('We are connected to test database.');
            done();
        });
    });

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });
    });

    describe('Bicicletas.createInstance', ()=>{
        it('Crear una instancia de bicicleta', ()=>{
            var bici = Bicicleta.createInstance(1,'violeta','urbana',[-34.6112424,-58.5412424]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe('violeta');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toBe(-34.6112424);
            expect(bici.ubicacion[1]).toBe(-58.5412424);
        });
    });
   
    describe('Bicicletas.allBicis', ()=>{
        it('Comienza vacía', (done)=>{
            Bicicleta.find({},(err, bicis) => {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });
    
    describe('Bicicletas.add', ()=>{
        it('Agregar solo una bicicleta', (done)=>{
            var aBici = new Bicicleta({ code:1, color:'violeta', modelo:'urbana' });
            Bicicleta.add(aBici, function(err, newBici){
                if(err) console.log(err);
                Bicicleta.find({},(err, bicis) => {
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                })
            })
        });
    });
    
    describe('Bicicletas.findByCode', ()=>{
        it('Debe devolver la bici con code 1', (done)=>{
            Bicicleta.find({},(err, bicis) => {
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({ code:1, color:'violeta', modelo:'montaña' });
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) console.log(err);
                    
                    var aBici2 = new Bicicleta({ code:2, color:'rojo', modelo:'urbana' });
                    Bicicleta.add(aBici2, function(err, newBici){
                        if(err) console.log(err);
                        Bicicleta.findByCode(1, function(errr, targetBici){
                            expect(targetBici.code).toEqual(aBici.code);
                            expect(targetBici.color).toEqual(aBici.color);
                            expect(targetBici.modelo).toEqual(aBici.modelo);
                            done();
                        });
                    });
                });
            });
        });
    });


    describe('Bicicletas.update', ()=>{
        it('Actualizar solo la bicicleta 4', (done)=>{
           
            //Se crea el registro a actualizar
            var aBici = new Bicicleta({ code:4, color:'violeta', modelo:'montaña', ubicacion: [-34.6112424, -58.5412424] });
            Bicicleta.add(aBici, function(error){

                Bicicleta.findByCode(4, function(err, bBici){
                  
                    bBici.color = 'amarillo';
                    bBici.modelo = 'urbana';
                   
                    Bicicleta.update(bBici, (err, raw) => {
                        
                        expect(raw.ok).toEqual(1); 
                        done();
            
                    });
                });
            }); 
            
        });
    });

    

   describe('Bicicletas.delete', ()=>{
    it('status 200', (done)=>{

        //Se crea el registro a actualizar
        var aBici = new Bicicleta({ code:10, color:'violeta', modelo:'montaña', ubicacion: [-34.6112424, -58.5412424] });
        Bicicleta.add(aBici);

        Bicicleta.removeByCode(10, (err, raw) => {
        
            expect(raw.ok).toEqual(1); 
            done();
    
        });
    });
});

});

/*
describe('Test Modelo Bicicletas', function() {

    //Limpiar el array de bicicletas antes de cada test con la función incial
    beforeEach(() => { Bicicleta.allBicis = []; );

    describe('Bicicletas.allBicis', ()=>{
        it('comienza vacia', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);  //Tienen que existir dos registros
        });
    });

    describe('Bicicletas.add', ()=>{
        it('agregamos una', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);  //Tienen que existir dos registros
            
            var a = new Bicicleta(3,'blanca','montaña',[-34.6112424,-58.5412424]);
            Bicicleta.add(a);

            expect(Bicicleta.allBicis.length).toBe(1);  //Después de agregar un registro tienen que existir 3 registros
            expect(Bicicleta.allBicis[0]).toEqual(a); //El último registro insertado tiene que ser igual a nuestra nueva bicicleta
        });
    });


    describe('Bicicletas.findById', ()=>{
        it('debe devolver la bici con id 1', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);  //Tienen que existir dos registros
            
            var aBici = new Bicicleta(4,'violeta','urbana',[-34.6112424,-58.5412424]);
            var aBici2 = new Bicicleta(5,'azul','urbana',[-34.6112424,-58.5412424]);
            Bicicleta.add(aBici);
            Bicicleta.add(aBici2);

            var targetBici = Bicicleta.findById(4);
            expect(targetBici.id).toBe(aBici.id);  //Validar que sea con id=4
            expect(targetBici.color).toBe(aBici.color);  //Validar que sea el color del registro insertado
            expect(targetBici.modelo).toBe(aBici.modelo);  //Validar que sea el color del registro insertado
        });
    });
});
*/