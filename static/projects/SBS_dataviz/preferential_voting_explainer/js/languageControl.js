function getQueryVariable(){
	//Retrieves the language varaiable from the query string eg - /?english
	var query = window.location.search.substring(1)
	return query
}

function arabicRightAlign(datavizState){
	//Right justifies text for some languages, like Arabic - remove this if no translations
	if (datavizState.chosenLanguage == 'arabic'){
		$('#mainHeader').css('text-align','right')
		$('#firstAreaHeading').css('text-align','right')
		$('#disclaimer').css('text-align','right')
		$('#moreDetails').css('text-align','right')
		$('#countHeading').css('text-align','right')
		$('#countExplainerText').css('text-align','right')
	}
}