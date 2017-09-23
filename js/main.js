/* My map will show ten cities (in the area commonly known as the Rust Belt) that
have seen serious populaiton decline since 1950, as well as ten cities that have
seen major population growth in that time period, to contrast. Population data was obtained
from the census bureau; time stamps are from the first year of every decade
since 1950. */

function createMap(){
//function that instantiates the Leaflet map

	var map = L.map('map', {
		center: [36, -98],
		zoom: 4
	});
	//creates the map, centered on the United States

	L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="useiconic.com,">useiconic.com, from the Noun Project</a>&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		minZoom: 4, maxZoom: 8
    }).addTo(map);
		//adds the tile set, restricts zoom

		getData(map);
		//calls the function getData
};

function calcPropRadius(attValue) {
  //calculates the radius of each proportional symbol
    var scaleFactor = 0.0025;
    //scale factor to adjust symbol size evenly
    var area = attValue * scaleFactor;
    //area based on attribute value and scale factor
    var radius = Math.sqrt(area/Math.PI);
    //radius of circle calculated based on area

    return radius;
    //returns the radius of the circle
};

function createPopup(properties, attribute, layer, radius){
	var popupContent = "<p><b>City:</b> " + properties.City + ", " + properties.State + "</p>";
	//adds city and state names to popup string
	var year = attribute.split("Pop")[1];
  popupContent += "<p><b>Population in " + year + ":</b> " + properties[attribute] +  " </p>";
	//adds formatted year info to popup string

	layer.bindPopup(popupContent, {
		offset: new L.Point(0,-radius)
		//replace the layer popup
	});
}

function Popup(properties, attribute, layer, radius){
	//object constructor function example using popups
	this.properties = properties;
	this.attribute = attribute;
	this.layer = layer;
	this.year = attribute.split("Pop")[1];
	this.population = this.properties[attribute];
	this.content = "<p><b>City:</b> " + this.properties.City + ", " + this.properties.State + "</p><p><b>Population in " + this.year + ":</b> " + this.population +  " </p>";
	//assign properties to prototype

	this.bindToLayer = function(){
		this.layer.bindPopup(this.content, {
			offset: new L.Point(0,-radius)
			//assign method to the prototype
		});
	};
};

function pointToLayer(feature, latlng, attributes){
//converts the markers to circle markers

	var attribute = attributes[0];
  //determines which attribute to visualize with proportional symbol

var growingCities = feature.properties.growing === "true";

console.log(growingCities);
	var options = {
    fillColor: "#00b3b3",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
  };
  //creates the options for the markers

  var attValue = Number(feature.properties[attribute]);
  //for each feature, determines its value for the selected attribute

  options.radius = calcPropRadius(attValue);
  //gives each feature's circle marker a radius based on its attribute value

  var layer = L.circleMarker(latlng, options);
	console.log(layer);
  //creates circle marker layer

	var popup = new Popup(feature.properties, attribute, layer, options.radius);
	var popup2 = Object.create(popup);
	//creates a new popup

	popup2.bindToLayer();
  //binds the popup to the circle marker

	layer.on({
		mouseover: function(){
			this.openPopup();
		},
		mouseout: function(){
			this.closePopup();
		},
	});
	//opens popup on hover

  return layer;
  //returns the circle marker to the L.geoJson pointToLayer option
};


function createPropSymbols(data, map, attributes){
	//adds circle markers for the point features to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
		//create a Leaflet GeoJSON layer and add it to the map
};

function getCircleValues(map, attribute){
//Calculate the max, mean, and min values for a given attribute
	var min = Infinity,
		max = -Infinity;
		//start with min at the highest possible and max at the lowest possible number

	map.eachLayer(function(layer){
		//get the attribute value
		if (layer.feature){
			var attributeValue = Number(layer.feature.properties[attribute]);

			if (attributeValue < min){
				min = attributeValue;
			};
			//test for min

			if (attributeValue > max){
				max = attributeValue;
			//test for max
			};
		};
	});

	var mean = Math.round((max + min) / 2);
	//set mean, round to a whole number

	return {
		max: max,
		mean: mean,
		min: min
		//return values as an object
	};
};

function updateLegend(map, attribute){
	var year = attribute.split("Pop")[1];
	var content = "<h3>Population in " + year + "</h3>";
	//adds the updated year to the legend

	$('#temporal-legend').html(content);
	//replaces the legend content

	var circleValues = getCircleValues(map, attribute);
	//gets the max, min, and mean values as an object

	for (var key in circleValues){
		var radius = calcPropRadius(circleValues[key]);

		$('#'+key).attr({
			cy: 90 - radius,
			r: radius
		});

		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
		//gets the radius
	};
};

function updatePropSymbols(map, attribute){
	map.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			//resize proportional symbols according to new attribute values
			var props = layer.feature.properties;
			//access feature properties
			var	radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);
			createPopup(props, attribute, layer, radius);
			//update each feature's radius based on new attribute values
		};
	});

	updateLegend(map, attribute);
	//update sequence legend
};

function createSequenceControls(map, attributes){
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},
		//create new sequence controls

		onAdd: function (map) {

			var container = L.DomUtil.create('div', 'sequence-control-container');
			//create the control container with a particular class name

			$(container).append('<input class="range-slider" type="range">');
			//create slider

			$(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
			$(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
			//add skip buttons

			return container;
		}
	});

	map.addControl(new SequenceControl());

	$('.range-slider').attr({
		max: 6,
		min: 0,
		value: 0,
		step: 1
	});
	//set slider attributes

	$('#reverse').html('<img src="img/backward.png">');
	$('#forward').html('<img src="img/forward.png">');
	//replace button content with images
	//icon created by useiconic.com, from Noun Project

	$('.skip').click(function(){
	//click listener for buttons
		var index = $('.range-slider').val();
		//get the old index value

		if ($(this).attr('id') == 'forward'){
			index++;
			//increment or decriment depending on button clicked
			index = index > 6 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			//if past the last attribute, wrap around to first attribute
			index = index < 0 ? 6 : index;
			//if past the first attribute, wrap around to last attribute
		};

		$('.range-slider').val(index);
		//update slider

		updatePropSymbols(map, attributes[index]);
		//pass new attribute to update symbols
	});

$('.range-slider').on('input', function(){
	//input listener for slider
	var index = $(this).val();
	//get the new index value
		updatePropSymbols(map, attributes[index]);
		//pass new attribute to update symbols
	});
};

function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },
				//function to create the legend

        onAdd: function (map) {

            var container = L.DomUtil.create('div', 'legend-control-container');
						//create the control container with a particular class name

            $(container).append('<div id="temporal-legend">')
						//add temporal legend div to container

            var svg = '<svg id="attribute-legend" width="170px" height="90px">';
						//start attribute legend svg string

						var circles = {
		            max: 35,
		            mean: 60,
		            min: 85
		        };
						//array of circle names to base loop on

		        for (var circle in circles){
						//loop to add each circle and text to svg string
		            svg += '<circle class="legend-circle" id="' + circle + '" fill="#00b3b3" fill-opacity="0.7" stroke="#000000" cx="45"/>';
								//circle string

		            svg += '<text id="' + circle + '-text" x="90" y="' + circles[circle] + '"></text>';
								//text string
		        };


        svg += "</svg>";
				//close the svg string

            $(container).append(svg);
						//add attribute legend svg to container

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};

function processData(data){
//builds an attributes array from the data
	var attributes = [];
	//empty array to hold attributes

	var properties = data.features[0].properties;
	//properties of the first feature of the dataset

	for (var attribute in properties){
	//pushes each attribute name into attributes array
		if (attribute.indexOf("Pop") > -1){
			attributes.push(attribute);
			//only take attributes with population values
		};
	};

	return attributes;
};

function getData(map){
//import geojson data
    $.ajax("data/USCitiesPop.geojson", {
        dataType: "json",
        success: function(response){
				//loads the data from USCitiesPop.geojson
					var attributes = processData(response);

					createPropSymbols(response, map, attributes);
					createSequenceControls(map, attributes);
					createLegend(map, attributes);
					//create an attributes array
	        }
	    });
}


$(document).ready(createMap);
//loads the map when the document is ready
