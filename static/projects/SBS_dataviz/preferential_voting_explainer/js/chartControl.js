function getHalfwayLine(totalVotes){
	var halfLine = totalVotes/2;
	return [halfLine];
}

function addChartToPage(datavizState){
	datavizState.chart = c3.generate({ 
		padding:{
			left: 110,
			bottom: 5
		},
		data: {
			x:'Candidate',
			columns:[
				datavizState.candidatesToDisplay[1],
				['first', 9000, 7500, 6500, 5000, 5000, 3500] //36500
			],
			type: 'bar',
			order: null,
			groups: [['first','second','third','fourth','fifth','sixth']],
		},
		color: {
			pattern: ['#f78d1f', '#525e6d', '#00cbc7', '#b4c715', '#01adff', '#5e9633', '#9f0cb4']  //Darkest three colours from http://colorschemedesigner.com/csd-3.5/#3q413w0w0w0w0
		},
		interaction: {
			enabled: false
		},	
		transition: {
			duration: 1100
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
					multiline:false
				},
				type: 'categorized'
			},
			y: {
				max: 19100,
				tick: {
					values: getHalfwayLine(36500),
					format: function (d) { return '50%'}
				}
			}
		},
		tooltip: {
			show: false
		},
		bar: {
			width: {
				ratio: 0.5
			}
		}
	});
}

//Timeouts is called upon later. Because all timeouts are in this array, I can link through them and stop them one-by-one
function firstCount(datavizState, i){
	var thisRow = datavizState.values[datavizState.countNumber][i]
	var thisAnimation = setTimeout(function(){
		datavizState.chart.load({
			columns:[
				datavizState.candidatesToDisplay[1],
				thisRow[0],
				thisRow[1],
				thisRow[2],
				thisRow[3],
				thisRow[4]
			],
			type: 'bar'
		});
	}, 1400 * (i+1)) //Each animation has a during of 0.7 seconds, which is set in the main chart object.
	datavizState.timeouts.push(thisAnimation)
}