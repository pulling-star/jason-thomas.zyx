function drawTimeScale(datavizConfig){
	$("#timeScale").html('')
	var width = $("#timeScale").width() * 0.99,
		height = 40,
		padding = 20,
		radius = 10

	// create an svg container
	vis = d3.select("#timeScale")
		.append("svg")
		.attr('id', 'chartContainer')
		.attr("width", width)
		.attr("height", height);

	// define the x scale (horizontal)
	var mindate = new Date(datavizConfig.datesData[0]),
		maxdate = new Date(datavizConfig.datesData[datavizConfig.datesData.length-1]);
		
	var xScale = d3.time.scale()
		.domain([mindate, maxdate])    // values between for month of january
		.range([padding, width - padding]);  // map these the the chart width = total width minus padding at both sides

	// define the x axis
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.scale(xScale);
	
	vis.append('line')
		.attr("x1", function(){
		  return xScale(new Date(mindate));
		})
		.attr('y1', radius*2)
		.attr("x2", function(){
		  return xScale(new Date(maxdate));
		})
		.attr('y2', radius*2)
		.style("opacity", 0.9)
		.attr("stroke-width", 2)
		.attr("stroke", "#D8D8D8");
	
	vis.selectAll(".dot")
	  .data(datavizConfig.datesData)
	  .enter()
	  .append("circle")
	  .attr("class", "dot")
	  .attr("r", radius)
	  .attr("cx", function(d){
		return xScale(new Date(d));
	  })
	  .attr("cy", radius*2)
	  .style("opacity", 0.9)
	  .on('click', function(d,i){
		datavizConfig.count = i;
		showDate(datavizConfig);
		showText(datavizConfig);
		plotCircles(datavizConfig);
		checkButtons(datavizConfig);
		datavizConfig.thisShape.clearLayers();
		datavizConfig.thisShape = loadData(datavizConfig);
	  });
}

function plotCircles(datavizConfig){
	vis.selectAll(".dot")
		.style("fill", function(d,i){
			if (i == datavizConfig.count){
				return '#AB1E1E'; //'#2B2B2B'
			} else {
				return '#D8D8D8';
			}
		})
}