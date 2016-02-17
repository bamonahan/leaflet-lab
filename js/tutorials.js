//my tutorials file

//leftlet website quick start tutorial

//var map = L.map('map').setView([51.505, -0.09], 13);
/* sets view to chosen geographical coordinates (London),
no options have been created yet */

/*var Thunderforest_TransportDark = L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	maxZoom: 19
}).addTo(map);
// actually adds the map to the page

var marker = L.marker([51.5, -0.09]).addTo(map);
// adds a marker near the Borough tube station

var circle = L.circle([51.508, -0.11], 500, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5
}).addTo(map);
// adds a red circle near Waterloo, Temple

var polygon = L.polygon([
  [51.509, -0.08],
  [51.503, -0.06],
  [51.51, -0.047]
]).addTo(map);
// adds a triangle connecting the three above points

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// creates popup for the marker, popup automatically opens
circle.bindPopup("I am a circle");
// creates popup for the circle
polygon.bindPopup("I am a polygon");
// creates popup for the polygon

var popup = L.popup()
  .setLatLng([51.5, -0.09])
  .setContent("I am a standalone popup.")
  .openOn(map); */
/* creates popup that is not attached to an object,
but the point listed above */

/* function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}
map.on('click', onMapClick); */
/* creates popup that tells the map user the latitude
and longitude of where they clicked */

//Using GeoJSON with Leaflet tutorial

/*var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
//creates a GeoJSON feature

L.geoJson(geojsonFeature).addTo(map);
//adds the GeoJSON feature to the map

var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];
//creates two GeoJSON objects, two lines that pass through
//the listed coordinates

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
//styles the two GeoJSON objects

L.geoJson(myLines, {
    style: myStyle
}).addTo(map);
//adds the styles to the map

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
//styles individual features based on their properties

L.geoJson(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);
//adds the styles to the map


function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}
//creates a popup for every feature that has a property
//named popupContent

L.geoJson(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);
//adds the popups to the map

var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}]; */
//creates variable someFeatures

/*L.geoJson(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);*/
//adds someFeatures to the map
