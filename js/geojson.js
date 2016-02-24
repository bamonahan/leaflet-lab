/* using GeoJSON with leaflet tutorial, applied to
megacities.geojson */

function createMap(){
//function that instantiates the Leaflet map

	var map = L.map('map', {
		center: [20, 0],
		zoom: 2
	});
	//creates the map

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
		//adds the Open Street Map tile set

		getData(map);
		//calls the function getData
};

function createPropSymbols(data, map){
	var geojsonMarkerOptions = {
		radius: 8,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	};

	//create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
}

function getData(map){
//load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
				//loads the data from MegaCities.geojson
					createPropSymbols(response, map);
	        }
	    });
}


$(document).ready(createMap);
//loads the map when the document is ready
