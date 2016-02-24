//leaflet map with my data
/* My map will show ten cities (in the area commonly known as the Rust Belt) that
have seen serious populaiton decline since 1950, as well as ten cities that have
seen major population growth in that time period, to contrast. Population data was obtained
from the census bureau; time stamps are from the first year of every decade
since 1950. */

function createMap(){
//function that instantiates the Leaflet map

	var map = L.map('map', {
		center: [38, -99],
		zoom: 4
	});
	//creates the map, centered on the United States

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
		//adds the Open Street Map tile set

		getData(map);
		//calls the function getData
};

function calcPropRadius(attValue) {
  //calculates the radius of each proportional symbol
    var scaleFactor = 0.0015;
    //scale factor to adjust symbol size evenly
    var area = attValue * scaleFactor;
    //area based on attribute value and scale factor
    var radius = Math.sqrt(area/Math.PI);
    //radius of circle calculated based on area

    return radius;
    //returns the radius of the circle
};

function pointToLayer(feature, latlng){
//converts markers to circle markers

	var attribute = "Pop1950";
  //determines which attribute to visualize with proportional symbol

	var options = {
    fillColor: "#33adff",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  //creates the options for the markers

  var attValue = Number(feature.properties[attribute]);
  //for each feature, determines its value for the selected attribute

  options.radius = calcPropRadius(attValue);
  //gives each feature's circle marker a radius based on its attribute value

  var layer = L.circleMarker(latlng, options);
  //creates circle marker layer

  var popupContent = "<p><b>City:</b> " + feature.properties.City + ", " + feature.properties.State + "</p>";
  //builds the popup content string, staring with the city

  var year = attribute.split("Pop")[1];
  popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] +  " </p>";
  //adds the year to the popup, formatted to include just the year number

  layer.bindPopup(popupContent, {
		offset: new L.point(0,-options.radius)
	});
  //binds the popup to the circle marker

	layer.on({
		mouseover: function(){
			this.openPopup();
		},
		mouseout: function(){
			this.closePopup();
		}
	});

  return layer;
  //returns the circle marker to the L.geoJson pointToLayer option
};


function createPropSymbols(data, map){
  //Add circle markers for point features to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
    //create a Leaflet GeoJSON layer and add it to the map
};

function getData(map){
//load the data
    $.ajax("data/USCitiesPop.geojson", {
        dataType: "json",
        success: function(response){
				//loads the data from USCitiesPop.geojson
					createPropSymbols(response, map);
	        }
	    });
}


$(document).ready(createMap);
//loads the map when the document is ready
