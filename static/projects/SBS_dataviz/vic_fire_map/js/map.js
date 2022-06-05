var map = L.map('map',{
	center: [-38.623, 143.90],
	zoomControl: true,
	zoom: 12,
	maxZoom: 14,
	minZoom: 9,
	scrollWheelZoom: false
});

L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
	maxZoom: 14,
	minZoom: 9
}).addTo(map)

L.control.scale({
	position: 'topright'
}).addTo(map)

function loadData(datavizConfig){
	var thisShape = L.geoJson(datavizConfig.geoJSONdata[datavizConfig.count], {
		style: function (feature) {
			return {
				fillOpacity: 0.75,
				color: '#AB1E1E',
				weight: 1
			};
		}
	})
	thisShape.on('click', function(e) {
		console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
	});
	thisShape.addTo(map)
	map.setView(datavizConfig.geoJSONdata[datavizConfig.count].mapCentre)
	return thisShape;
}