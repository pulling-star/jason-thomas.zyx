$(document).on('ready', function(){
	$.getJSON("shapes.geojson", function(geoJSONdata) {
		
		map.on('click', function(e) {
			console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
		});
		
		var count = 0;
		var thisShape;
		var vis;
		var datesData = ["December 25, 2015 12:33:00","December 25, 2015 14:13:00","December 25, 2015 15:34:00","December 25, 2015 18:46:00", "December 25, 2015 19:50:00" ,"December 25, 2015 20:53:00" ,"December 25, 2015 22:00:00"]

		loadData(count)

		$(window).on('resize', function(){
			drawTimeScale(thisShape, datesData)
			plotCircles(count)
			placeButtons()
		})
		drawTimeScale(thisShape, datesData)

		function checkButtons(count){
			plotCircles(count)
			$('#previous').css('background-position', '0px 50px')
			$('#next').css('background-position', '0px 50px')	
			if (count == 0){
				$('#previous').css('background-position', '0px 0px')
			}
			if (count >= geoJSONdata.length-1){
				$('#next').css('background-position', '0px 0px')
			}
		}

		function showDate(count){
			$('#timePanel').html('Time: <span class="highlightText">' + moment(datesData[count]).format('h:mm a') + '</span>')
		}
		
		function showText(count){
			$('#explainerText').html(geoJSONdata[count].explainerText)
			
			var totalAreaBurned = 0
			for (var key in geoJSONdata[count].features){
				totalAreaBurned += +geoJSONdata[count].features[key].properties.SHAPE_STAr
			}
			//$('#areaBurned').html('Area burned: <span class="highlightText">' + numeral(totalAreaBurned/1000).format('0,0') + ' square kilometres</span>')
			console.log(numeral(totalAreaBurned/1000).format('0,0'))
			
		}
		
		function placeButtons(){
			var mapHeight = $('#map').height()
			$('#previous').css('top', mapHeight/2.1 + 'px')
			$('#next').css('top', mapHeight/2.1 + 'px')
		}
		
		$('#previous').on('click', function(){
			if (count != 0){
				count--
			}
			checkButtons(count)
			thisShape.clearLayers()
			loadData(count)
		})

		$('#next').on('click', function(){
			if (count < geoJSONdata.length-1){
				count++
			}
			checkButtons(count)
			thisShape.clearLayers()
			loadData(count)
		})
		
		//Initialise
		plotCircles(count)
		checkButtons(count)
		showText(count)
		placeButtons()
	});	
});
