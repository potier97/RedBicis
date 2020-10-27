var mymap = L.map('main_map').setView([4.594911, -74.123508], 15.5);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(mymap);


var circle = L.circle([4.594911, -74.123508], {
    color: '#33658a',
    fillColor: '#33658a',
    fillOpacity: 0.25,
    radius: 400
 }).addTo(mymap);

$.ajax({
    dataType: "json",
    headers: {
        'x-access-token': process.env.NODE_MAP
    },
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){   
            L.marker(bici.ubicacion, {title:bici.id}).addTo(mymap);
        });
    }
})
 