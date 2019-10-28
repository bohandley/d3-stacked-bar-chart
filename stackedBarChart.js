// TASK 1: Read the data from both files
d3.csv("agedistribution.csv", function(error, ageDist){
	d3.csv("worldpopulation.csv", function(error, worldPop){
		var svg = d3.select("svg");

		var worldByCount = JSON.parse(JSON.stringify(worldPop));
		var worldByPortion = JSON.parse(JSON.stringify(worldPop));
		
		// TASK 1: calculate actual population counts 
		worldByCount.forEach(function(w){
			ageDist.forEach(function(a){
				if(w.year == a.year)
					w[a.age] = w["population (in millions)"] * a.value
			});
		});

		// TASK 2: get data for displaying portion
		worldByPortion.forEach(function(w){
			ageDist.forEach(function(a){
				if(w.year == a.year)
					w[a.age] = 100*a.value;
			});
		});

		// TASK 2: display by portion as default
		displayPopulation(svg, worldByPortion, ageDist, 0);

		// TASK 4: Creating radio buttons
		var shapeData = ["by portion", "by count"], 
    		j = 0;// Choose the by portion as default

		// TASK 4: Create the shape selectors or radio buttons
		var form = d3.select("form")

		// TASK 4: build radio buttons
		var labels = form.selectAll("label")
		    .data(shapeData)
		    .enter()
		    .append("label")
		    .text(function(d) {return d;})
		    .insert("input")
		    .attr("type", "radio")
		    .attr("class","shape")
		    .attr("name", "mode")
		    .attr("value",function(d, i) {return d;})
		    .property("checked", function(d, i) {return i===j;})
		
		// TASK 4: switch between two stacked barcharts
		var inputs = form.selectAll("input")
		    .on("click", function(d, i){
		    	var choice = d3.select(this).attr("value");

		    	if(choice == "by count"){
		    		// TASK 3: show age distribution by count
		    		svg.html('');
		    		displayPopulation(svg, worldByCount, ageDist, 1);
		    	} else if (choice == "by portion"){

		    		svg.html('');
		    		displayPopulation(svg, worldByPortion, ageDist, 0);
		    	}
		    })

	});
});

function displayPopulation(svg, data, ageDist, v=0){

	// access the svg element, set margin, width, height, and append a group	
	var	margin = {top: 20, right: 20, bottom: 30, left: 100},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// TASK 2: start to build the tooltips	
	var tooltip = svg.append("g")
	    .attr("class", "tooltip")
	    .style("display", "none");
	    
	// TASK 2: build rect display for the tool tip  
	tooltip.append("rect")
		.attr("width", 60)
		.attr("height", 20)
		.attr("fill", "white")
		.style("opacity", 1);

	// TASK 2: configure the text for the tooltip
	tooltip.append("text")
		.attr("x", 30)
		.attr("dy", "1.2em")
		.style("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("font-weight", "bold");

	// set x scale
	var x = d3.scaleBand()
	    .rangeRound([0, width-100])
	    .paddingInner(0.05)
	    .align(0.1);

	// set the y scale
	var y = d3.scaleLinear()
	    .rangeRound([height, 0]);

	// The colors of apricots, blueberries, and cherries
	var colors = [
		'#159ED0',	'#43C201',	'#45FA96',
		'#97B1BF',	'#3CAAD7',	'#10DDC1',
		'#F14B35',	'#C8BB34',	'#2DBEE6',	
		'#D138C0',	'#4BF704',	'#EAE352',	
		'#82B4EE',	'#A670A3',	'#ADBE58',	
		'#E55F21',	'#D1BC41'
	];
			

	// set the colors scale
	var z = d3.scaleOrdinal()
	    .range(colors);

	// get the keys from the ages
	var keys = [...new Set(ageDist.map(function(d){ return d.age; }))];
	
	// build the stack generator
	var stackGenerator = d3.stack()
	  .keys(keys.reverse());

	// find the largest value for count
	var yMax = d3.max(data, function(d) {  
		var total = 0;
		
		keys.forEach(function(a){
			total += d[a];
		});

		return total;
	});

	// create the domains
	x.domain(data.map(function(d) { return d.year; }));
	y.domain([0, yMax]);
	z.domain(keys);

	if(v){ // TASK 3: build the display for actual count
		// format the y axis to go to 10 billion
		y.nice();
		
		// build each column of the graph by stacks and add the tooltips
		var graph = g.append("g")
		    .selectAll("g")
		    .data(d3.stack().keys(keys)(data))
		    .enter().append("g")
		      	.attr("fill", function(d) { return z(d.key); })
		    .selectAll("rect")
		    .data(function(d) { return d; })
		    .enter().append("rect")
		      	.attr("x", function(d) { return x(d.data.year); })
		      	.attr("y", function(d) { return y(d[1]); })
		      	.attr("width", x.bandwidth())
		    .on("mouseover", function() { tooltip.style("display", null); })
		    .on("mouseout", function() { tooltip.style("display", "none"); })
		    .on("mousemove", function(d) {
		      	var xPosition = d3.mouse(this)[0] - 5;
		      	var yPosition = d3.mouse(this)[1] - 5;
		      	tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		      	tooltip.select("text").text((d[1]-d[0]).toFixed(2)+"m");
		    })
	} else { // TASK 2: build the display for portion
		// build each column of the graph by stacks and add the tooltips
		var graph = g.append("g")
		    .selectAll("g")
		    .data(d3.stack().keys(keys)(data))
		    .enter().append("g")
		      	.attr("fill", function(d) { return z(d.key); })
		    .selectAll("rect")
		    .data(function(d) { return d; })
		    .enter().append("rect")
		      	.attr("x", function(d) { return x(d.data.year); })
		      	.attr("y", function(d) { return y(d[1]); })
		      	.attr("width", x.bandwidth())
		    .on("mouseover", function() { tooltip.style("display", null); })
		    .on("mouseout", function() { tooltip.style("display", "none"); })
		    .on("mousemove", function(d) {
		      	var xPosition = d3.mouse(this)[0] - 5;
		      	var yPosition = d3.mouse(this)[1] - 5;
		      	tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
		      	tooltip.select("text").text((d[1]-d[0]).toFixed(2)+"%");
	      	})
	}

	smoothTransition(graph, y);

	// TASKS 2 and 3: add axes for both displays
	addAxes(g, x, y, height, v);

	// TASK 5: build legend for mapping age groups to colors
	buildLegend(g, z, keys, width);

}

function buildLegend(g, z, keys, width) {
	// TASK 5: build legend for mapping age groups to colors
	var legend = g.append("g")
	    .attr("font-family", "sans-serif")
	    .attr("font-size", 10)
	    .attr("text-anchor", "end")
		.selectAll("g")
		.data(keys.slice().reverse())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 19)
		.attr("width", 19)
		.attr("height", 19)
		.attr("fill", z)
		      
	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9.5)
		.attr("dy", "0.32em")
		.text(function(d) { return d; })
}

function smoothTransition(graph, y) {
		// add a transition for the height
    var s = d3.transition()
		.delay(200)
		.duration(1000);

	// transition the height	
	graph
		.transition(s)
		.attr("height", function(d) { return y(d[0]) - y(d[1]); })
}

				
function addAxes(g, x, y, height, v=0) {
	// TASKS 2 and 3: add axes for both displays
	// add the x axis
	g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	if(v){ // TASKS 3: add axes for count display
		// append the y axis
		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).ticks(null, "s").tickFormat(function(d){ 
				if (d == 0){
					return d;
				} else if(d > 9000){
					return 10 + ',000,000,000'
				}else {
					d = d +'';
					return d[0] + ',000,000,000';
				}
				
			}))
			.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 1.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			
	} else { // TASKS 2: add axes for portion display
		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y).ticks(null, "s").tickFormat(function(d){ return d + '%'}))
			.append("text")
			.attr("x", 2)
			.attr("y", y(y.ticks().pop()) + 0.5)
			.attr("dy", "0.32em")
			.attr("fill", "#000")
			.attr("font-weight", "bold")
			.attr("text-anchor", "start")
			
	}
}

