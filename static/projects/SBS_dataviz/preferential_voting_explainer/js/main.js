$.get('js/languages.JSON', function(languageData){
	$.get('js/candidates.JSON', function(candidates){
		var datavizState = {
			languageData: languageData,
			chosenLanguage: getQueryVariable(),
			submitButtonActive: false,
			countNumber: 0,
			preferenceCount: 0,
			timeouts: [],
			candidatesToDisplay: [[],[]],
			values: values,
			chart: null
		}

		function firstStep(datavizState, candidates){
			datavizState.chart = null;
			datavizState.submitButtonActive = false;
			datavizState.preferenceCount = 0;
			datavizState.timeouts = [];

			firstStageHtml(datavizState)
			arabicRightAlign(datavizState)
			addBoxesToBallot(datavizState, candidates)

			$('#submit_ballot').on('click', function(){
				if (datavizState.submitButtonActive == true && datavizState.preferenceCount == 6){
					loadResults(datavizState, function(){
						secondStep(datavizState);
					})
				}
			})

			$('#reset_first').on('click', function(){
				firstStep(datavizState)
			})
		}

		function secondStep(datavizState){
			secondStageHtml(datavizState)
			arabicRightAlign(datavizState)
			addChartToPage(datavizState)
			
			$('#next').on('click', function(){
				$('#reset_second').css('opacity', 1)
				if (datavizState.countNumber < datavizState.values.length){
					for (var j=0; j<datavizState.timeouts.length; j++) {
						clearTimeout(datavizState.timeouts[j]);
					}
					for (var i = 0; i < datavizState.values[datavizState.countNumber].length; i++){
						firstCount(datavizState, i)
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
				if (datavizState.countNumber == datavizState.values.length){
					$('#next').css('opacity',0.3);
				}	
			})
			$('#reset_second').on('click', function(){
				$('#secondArea').animate({
					opacity: 0,
				}, 400, function(){
					$(this).html('');
					datavizState.countNumber = 0;
					firstStep(datavizState);
				})
			})
			
		}
		
		allStagesHtml(datavizState)
		firstStep(datavizState, candidates)
	})
})
