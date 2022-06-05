$(document).on('ready', function(){
	$.getJSON('shapes.geojson', function(geoJSONdata) {

		var datavizConfig = {
			'count': 0,
			'datesData': ["December 25, 2015 12:33:00","December 25, 2015 14:13:00","December 25, 2015 15:34:00","December 25, 2015 18:46:00", "December 25, 2015 19:50:00" ,"December 25, 2015 20:53:00" ,"December 25, 2015 22:00:00"],
			'thisShape': null,
			'geoJSONdata': geoJSONdata
		}
		datavizConfig.geoJSONdata = geoJSONdata;

		map.on('click', function(e) {
			console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
		});

		datavizConfig.thisShape = loadData(datavizConfig)

		$(window).on('resize', function(){
			drawTimeScale(datavizConfig);
			plotCircles(datavizConfig);
			placeButtons(datavizConfig);
		})
		drawTimeScale(datavizConfig);
		
		$('#previous').on('click', function(){
			if (datavizConfig.count != 0){
				datavizConfig.count--;
			}
			showDate(datavizConfig);
			showText(datavizConfig);
			plotCircles(datavizConfig);
			checkButtons(datavizConfig);
			datavizConfig.thisShape.clearLayers();
			datavizConfig.thisShape = loadData(datavizConfig);
		})

		$('#next').on('click', function(){
			if (datavizConfig.count < geoJSONdata.length-1){
				datavizConfig.count++;
			}
			showDate(datavizConfig);
			showText(datavizConfig);
			plotCircles(datavizConfig);
			checkButtons(datavizConfig);
			datavizConfig.thisShape.clearLayers();
			datavizConfig.thisShape = loadData(datavizConfig);
		})
		
		//Initialise
		showDate(datavizConfig);
		showText(datavizConfig);
		plotCircles(datavizConfig);
		checkButtons(datavizConfig);
		placeButtons(datavizConfig);
	});	
});