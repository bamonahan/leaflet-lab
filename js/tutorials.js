//my tutorials file

//leftlet website quick start tutorial

var map = L.map('map').setView([51.505, -0.09], 13);
/* sets view to chosen geographical coordinates (London),
no options have been created yet */

var Thunderforest_TransportDark = L.tileLayer('http://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png', {
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
  .openOn(map);
/* creates popup that is not attached to an object,
but the point listed above */

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}
map.on('click', onMapClick);
/* creates popup that tells the map user the latitude
and longitude of where they clicked */

//using GeoJSON with leaflet tutorial
