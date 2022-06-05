function insertThisValue(resultNum, resultParty, datavizState){
	if (datavizState.candidatesToDisplay[0].length == 0){
		console.log('first', resultNum, resultParty);
		datavizState.candidatesToDisplay[0].push(+resultNum);
		datavizState.candidatesToDisplay[1].push(resultParty);
		return
	} else {
		for (var j = 0; j < datavizState.candidatesToDisplay[0].length; j++){
			if (+resultNum < datavizState.candidatesToDisplay[0][j]){
				console.log('smaller', j, resultNum, resultParty);
				datavizState.candidatesToDisplay[0].splice(j, 0, +resultNum);
				datavizState.candidatesToDisplay[1].splice(j, 0, resultParty);
				return
			}
		}
		console.log('larger', resultNum, resultParty);
		datavizState.candidatesToDisplay[0].push(+resultNum);
		datavizState.candidatesToDisplay[1].push(resultParty);
		return
	}
}

function loadResults(datavizState, callback){
	//this does an insertion sort
	$('#firstArea').animate({
		opacity: 0,
	}, 200, function(){
		datavizState.candidatesToDisplay = [[],[]]
		$('.choiceOption').each(function(){
			var resultNum = $(this).children('.numberBox').html();
			var resultParty = $(this).children('.candidateDetails').children('.partyID').html();
			insertThisValue(resultNum, resultParty, datavizState);
		})
		$(this).html('')

		//Switch 2 and 3 (4 and 5 before reverse)
		var temp = datavizState.candidatesToDisplay[1][2];
		datavizState.candidatesToDisplay[1][2] = datavizState.candidatesToDisplay[1][1];
		datavizState.candidatesToDisplay[1][1] = temp;
		datavizState.candidatesToDisplay[1].push('Candidate');
		datavizState.candidatesToDisplay[1].reverse()
		
		callback()
	})
}

function giveBoxaNumber(elem, datavizState){
	var number = $(elem).find('.numberBox').text();
	if (number.length == 0){
		datavizState.preferenceCount ++;
		if(datavizState.preferenceCount == 6){
			$('#submit_ballot').css('opacity', 1);
			datavizState.submitButtonActive = true;
		}
		$(elem).find('.numberBox').text(datavizState.preferenceCount);
	}
}

function addBoxesToBallot(datavizState, candidateList){
	for (var i = 0; i < candidateList.length; i++){
		var $choice = $('<div>');
		$choice.attr('class', 'choiceOption');
		$choice.attr('clicked', 'no');
		var $numberBox = $('<div>');
		$numberBox.attr('class', 'numberBox');
		$choice.append($numberBox);
		var $words = $('<p>');
		$words.attr('class', 'candidateDetails');
		$words.html('<span class="partyID">' + candidateList[i].party + '</span></br>' + candidateList[i].name);
		$choice.append($words)
		$choice.on('click', function(){
			giveBoxaNumber(this, datavizState);
			$(this).attr('clicked', 'yes');
			$('#reset_first').css('opacity', 1);
		})
		$('#innerForm').append($choice);
	}
}