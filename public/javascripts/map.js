var mymap = L.map('main_map').setView([-34.604675,-58.3826587], 8);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(mymap);


$.ajax({
    dataType: "json",
    headers: {
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjg2YjBmM2UxZTg3NDEzY2ViYTg4NiIsImlhdCI6MTU4OTE0NTI3MSwiZXhwIjoxNTg5MTg4NDcxfQ.VTxNChgO1QubUSdA4eAo3UUVtwbtjK_rW_JOZRszc0I'
    },
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){   
            L.marker(bici.ubicacion, {title:bici.id}).addTo(mymap);
        });
    }
})