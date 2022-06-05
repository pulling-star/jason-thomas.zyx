function firstStageHtml(datavizState){
	var firstAreaHTML = "<h3 id='firstAreaHeading'></h3><table><tr><td id='reset_first'></td><td id='submit_ballot'></td></tr></table><div id='initialForm'><h2 id='ballotHeader'>BALLOT PAPER</br>HOUSE OF REPRESENTATIVES</h2><div id='innerForm'><p id='ballotInnerHeading'>Number the boxes from 1 to 6 in the order of your choice</p></div></div>"
	$('#firstArea').html(firstAreaHTML)
	$('#firstAreaHeading').html(datavizState.languageData[datavizState.chosenLanguage].firstAreaHeading)
	$('#submit_ballot').css('opacity', 0.3)
	$('#firstArea').animate({
		opacity: 1
	}, 200)
	$('#reset_first').html(datavizState.languageData[datavizState.chosenLanguage].buttons.reset + ' <i class="fa fa-refresh"></i>');
	$('#reset_first').css('opacity', 0.3);
	$('#submit_ballot').html(datavizState.languageData[datavizState.chosenLanguage].buttons.submit_ballot + ' <i class="fa fa-arrow-right"></i>');
}

function secondStageHtml(datavizState){
	var secondAreaHTML = "<h3 id='secondAreaHeading'></h3><p id='chartExplainerOne'></p><p id='chartExplainerTwo'></p><p id='chartExplainerThree'></p><h4 id='countHeading'></h4><p id='countExplainerText'></p><table><tr><td id='reset_second'></td><td id='next'></td></tr></table><div id='chart'></div>"
	$('#secondArea').html(secondAreaHTML)
	$('#secondArea').animate({
		opacity: 1
	}, 200)
	$('#countExplainerText').html(datavizState.languageData[datavizState.chosenLanguage].countExplainer[datavizState.countNumber]);
	$('#next').html(datavizState.languageData[datavizState.chosenLanguage].buttons.next + ' <i class="fa fa-arrow-right"></i>');
	$('#reset_second').html(datavizState.languageData[datavizState.chosenLanguage].buttons.reset + ' <i class="fa fa-refresh"></i>');
	$('#reset_second').html(datavizState.languageData[datavizState.chosenLanguage].buttons.reset + ' <i class="fa fa-refresh"></i>');
	$('#countHeading').html(datavizState.languageData[datavizState.chosenLanguage].countHeading[datavizState.countNumber]);
}

function allStagesHtml(datavizState){
	$('#mainHeader').html(datavizState.languageData[datavizState.chosenLanguage].mainHeading);
	if (datavizState.chosenLanguage != 'english'){
		$('#disclaimer').html(datavizState.languageData[datavizState.chosenLanguage].disclaimer);
	}
	$('#moreDetails').html(datavizState.languageData[datavizState.chosenLanguage].howToVoteDetails);
}