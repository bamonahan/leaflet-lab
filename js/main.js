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

	L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		maxZoom: 7
    }).addTo(map);
		//adds the Open Street Map tile set, restricts zoom

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
//converts markers to circle markers

	var attribute = attributes[0];
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
		//click: function(){
			//$("#panel").html(popupContent);
		//}
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
		//start with min at highest possible and max at lowest possible number

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
			////test for max
			};
		};
	});

	var mean = (max + min) / 2;
	//set mean

	return {
		max: max,
		mean: mean,
		min: min
		//return values as an object
	};
};

/*function updateLegend(map, attribute){
	var year = attribute.split("_")[1];
	var content = "Population in " + year;

	$('#temporal-legend').html(content);

	var circleValues = getCircleValues(map, attribute);

	for (var key in circleValues){
		var radius = calcPropRadius(circleValues[key]);

		$('#'+key).attr({
			cy: 59 - radius,
			r: radius
		});

		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " million");
	};
};*/

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

$('.menu-ui a').on('click', function() {
		var filter = $(this).data('filter');
		$(this).addClass('active').siblings().removeClass('active');
});
//fifth interaction operator

function getData(map){
//import geojson data
    $.ajax("data/USCitiesPop.geojson", {
        dataType: "json",
        success: function(response){
				//loads the data from USCitiesPop.geojson
					var attributes = processData(response);

					createPropSymbols(response, map, attributes);
					createSequenceControls(map, attributes);
					//create an attributes array
	        }
	    });
}


$(document).ready(createMap);
//loads the map when the document is ready
