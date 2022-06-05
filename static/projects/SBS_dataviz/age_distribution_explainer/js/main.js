$.get('js/data.json', function(data){
	var yearOptions = {
		value: 45,
		min: 0,
		max: 79,
		yearExtender: 1971,
		step: 1
	}

	$('#yearDisplay').html(data[yearOptions.value]['year']);
	var chart = c3.generate({ 
	padding:{
		left: 60,
		bottom: 0
	},
	data: {
		x: 'x',
		columns: [
			['x', '90+', '80-89', '70-79', '60-69', '50-59', '40-49', '30-39', '20-29', '10-19', '0-9'],
			['Population in age group', 
			numeral(data[yearOptions.value]['90+']).format('0.00'), 
			numeral(data[yearOptions.value]['80-89']).format('0.00'), 
			numeral(data[yearOptions.value]['70-79']).format('0.00'), 
			numeral(data[yearOptions.value]['60-69']).format('0.00'), 
			numeral(data[yearOptions.value]['50-59']).format('0.00'), 
			numeral(data[yearOptions.value]['40-49']).format('0.00'), 
			numeral(data[yearOptions.value]['30-39']).format('0.00'), 
			numeral(data[yearOptions.value]['20-29']).format('0.00'), 
			numeral(data[yearOptions.value]['10-19']).format('0.00'), 
			numeral(data[yearOptions.value]['0-9']).format('0.00')
			]
		],
		type: 'bar',
		order: null
	},
	color: {
		pattern: ['#525e6d', '#00cbc7', '#f78d1f', '#b4c715', '#01adff', '#5e9633', '#9f0cb4']
	},
	legend: {
		show: false,
	},
	grid: {
		y: {
			show: true
		}
	},
	axis: {
	  rotated: true,
	  x: {
		tick:{
			multiline:true
		},
		type: 'categorized'
	  },
	  y: {
		  max: 18,
		  tick: {
			values: [0, 5, 10, 15],
			format: function (d) { return d + "%"}
		  }
	  },
	},
	bar: {
	  width: {
		ratio: 0.7,
	  },
	}
	});
	
	function changeChartData(accessor) {
		$('#yearDisplay').html(+accessor + +yearOptions.yearExtender);	
		chart.load({
			columns: [
				['x', '90+', '80-89', '70-79', '60-69', '50-59', '40-49', '30-39', '20-29', '10-19', '0-9'],
				['Population in age group', 
				numeral(data[accessor]['90+']).format('0.00'), 
				numeral(data[accessor]['80-89']).format('0.00'), 
				numeral(data[accessor]['70-79']).format('0.00'), 
				numeral(data[accessor]['60-69']).format('0.00'), 
				numeral(data[accessor]['50-59']).format('0.00'), 
				numeral(data[accessor]['40-49']).format('0.00'), 
				numeral(data[accessor]['30-39']).format('0.00'), 
				numeral(data[accessor]['20-29']).format('0.00'), 
				numeral(data[accessor]['10-19']).format('0.00'), 
				numeral(data[accessor]['0-9']).format('0.00')
				]
			]
		});
	}

	//Change the options on slider values change
	$(function() {
		$('#ageSlider').slider({
			value: yearOptions.value,
			min: yearOptions.min,
			max: yearOptions.max,
			step: yearOptions.step,
			slide: function(event, ui){	
				//We do not want this to load normally, as this is only useful for making the promo gif
				//clearInterval(animInt);
				changeChartData(ui.value);
			}
		});
	});
	
	/*
	//This stuff is for creating the social video
	var accessor = 0;
	var animInt = setInterval(function(){
		accessor ++;
		$('#ageSlider').slider('value', accessor);
		changeChartData(accessor)
		if($('#ageSlider').slider('value') >= yearOptions.max){
			clearInterval(animInt);
		}		
	}, 150);
	*/
})