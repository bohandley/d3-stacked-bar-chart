var padding = 10;
var barHeight = 20;
var fontSize = 20;
var formatPercent = d3.format(".0%");

var svg = d3.select("svg");

var ages = d3.csv("ageDistribution.csv")

d3.csv("agedistribution.csv", displayAgeDist());

// d3.csv("world-population.csv", displayWorldPop());

function displayAgeDist(){
	// create a scale for the x axis at the top of the graph to %14
	var xScale = d3.scaleLinear()
		.domain([0, .14])
		.range([0,500]);

	// create the x axis with the above scale
	var xAxis = d3.axisBottom(xScale)
		.ticks(8)
		.tickFormat(formatPercent);

	// append the x axis
	d3.select('svg')
		.append('g')
		.attr("transform", "translate(100, 520)")
		.call(xAxis);

	// create a scale for the x axis at the top of the graph to %14
	var yScale = d3.scaleLinear()
		.domain([.14, 0])
		.range([0,500]);

	// create the Y axis with the above scale
	var yAxis = d3.axisLeft(yScale)
		.ticks(8)
		.tickFormat(formatPercent);

	// append the x axis
	d3.select('svg')
		.append('g')
		.attr("transform", "translate(100, 20)")
		.call(yAxis);
}

function displayWorldPop(){
		// create a scale for the x axis at the top of the graph to %14
	var xScale = d3.scaleLinear()
		.domain([0, .14])
		.range([0,560]);

	// create the x axis with the above scale
	var xAxis = d3.axisTop(xScale)
		.ticks(8)
		.tickFormat(formatPercent);

	// append the x axis
	d3.select('svg')
		.append('g')
		.attr("transform", "translate(100, 20)")
		.call(xAxis);
}