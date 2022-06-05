$('#submit_ballot').on('click', function(){
	if (datavizState.submitButtonActive == true && datavizState.preferenceCount == 6){
		loadResults(datavizState, function(){
			secondStep(datavizState);
		})
	}
})

$('#reset_first').on('click', function(){
	firstStep(datavizState);
})

$('#next').on('click', function(){
	$('#reset_second').css('opacity', 1)
	if (datavizState.countNumber < values.length){
		for (var j=0; j<datavizState.timeouts.length; j++) {
			clearTimeout(datavizState.timeouts[j]);
		}
		for (var i = 0; i < values[datavizState.countNumber].length; i++){
			firstCount(values[datavizState.countNumber][i], i)
		}
		datavizState.countNumber ++
		if (datavizState.countNumber == 1){
			var explainerText = datavizState.languageData[datavizState.chosenLanguage].countExplainer[datavizState.countNumber].replace('<--Party here-->', datavizState.candidatesToDisplay[datavizState.candidatesToDisplay.length-1])
		} else {
			var explainerText = datavizState.languageData[datavizState.chosenLanguage].countExplainer[datavizState.countNumber];
		}
		$('#countHeading').html(datavizState.languageData[datavizState.chosenLanguage].countHeading[datavizState.countNumber]);
		$('#countExplainerText').html(explainerText);
	}
	if (datavizState.countNumber == values.length){
		$('#next').css('opacity',0.3);
	}	
})

$('#reset_second').on('click', function(){
	$('#secondArea').animate({
		opacity: 0,
	}, 400, function(){
		$(this).html('');
		firstStep(datavizState);
	})
})