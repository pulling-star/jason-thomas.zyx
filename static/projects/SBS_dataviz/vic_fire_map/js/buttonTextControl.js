function checkButtons(datavizConfig){
	$('#previous').css('background-position', '0px 50px');
	$('#next').css('background-position', '0px 50px');
	if (datavizConfig.count == 0){
		$('#previous').css('background-position', '0px 0px');
	}
	if (datavizConfig.count >= datavizConfig.geoJSONdata.length-1){
		$('#next').css('background-position', '0px 0px');
	}
}

function showDate(datavizConfig){
	$('#timePanel').html('Time: <span class="highlightText">' + moment(datavizConfig.datesData[datavizConfig.count]).format('h:mm a') + '</span>');
}

function showText(datavizConfig){
	$('#explainerText').html(datavizConfig.geoJSONdata[datavizConfig.count].explainerText);
	
	var totalAreaBurned = 0;
	for (var key in datavizConfig.geoJSONdata[datavizConfig.count].features){
		totalAreaBurned += +datavizConfig.geoJSONdata[datavizConfig.count].features[key].properties.SHAPE_STAr;
	}
	//$('#areaBurned').html('Area burned: <span class="highlightText">' + numeral(totalAreaBurned/1000).format('0,0') + ' square kilometres</span>')
	console.log(numeral(totalAreaBurned/1000).format('0,0'));
}

function placeButtons(datavizConfig){
	var mapHeight = $('#map').height();
	$('#previous').css('top', mapHeight/2.1 + 'px');
	$('#next').css('top', mapHeight/2.1 + 'px');
}