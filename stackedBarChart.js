d3.csv("agedistribution.csv", function(error, ageDist){
	d3.csv("worldpopulation.csv", function(error, worldPop){
		console.log(worldPop)
		
		console.log(ageDist)
		ageDist.sort(function(a,b){ return a.age - b.age})
		worldPop.forEach(function(w){
			ageDist.forEach(function(a){
				if(w.year == a.year)
					w[a.age] = w["population (in millions)"] * a.value
			});
		});

		var data = worldPop;
		data.sort(function(a,b){return b.year - a.year;})
		// console.log(data);

		var svg = d3.select("svg"),
		    margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom,
		    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	      var tooltip = svg.append("g")
			    .attr("class", "tooltip")
			    .style("display", "none");
			      
			  tooltip.append("rect")
			    .attr("width", 60)
			    .attr("height", 20)
			    .attr("fill", "white")
			    .style("opacity", 1);

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
					

				// set the colors
				var z = d3.scaleOrdinal()
				    .range(colors);

				var keys = [...new Set(ageDist.map(function(d){ return d.age; }))];
				// console.log(keys);

				var stackGenerator = d3.stack()
				  .keys(keys);

				var yMax = d3.max(data, function(d) {  
					var total = 0;
					keys.forEach(function(a){
						total += d[a];
					});

					return total;
				});

				x.domain(data.map(function(d) { return d.year; }));
			  y.domain([0, yMax]).nice();
			  z.domain(keys);


			  g.append("g")
			    .selectAll("g")
			    .data(d3.stack().keys(keys)(data))
			    .enter().append("g")
			      .attr("fill", function(d) { return z(d.key); })
			    .selectAll("rect")
			    .data(function(d) { return d; })
			    .enter().append("rect")
			      .attr("x", function(d) { return x(d.data.year); })
			      .attr("y", function(d) { return y(d[1]); })
			      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
			      .attr("width", x.bandwidth())
			    .on("mouseover", function() { tooltip.style("display", null); })
			    .on("mouseout", function() { tooltip.style("display", "none"); })
			    .on("mousemove", function(d) {
			      // console.log(d);
			      var xPosition = d3.mouse(this)[0] - 5;
			      var yPosition = d3.mouse(this)[1] - 5;
			      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
			      tooltip.select("text").text((d[1]-d[0]).toFixed(2)+"m");
			    });

			  g.append("g")
			      .attr("class", "axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(d3.axisBottom(x));

			  g.append("g")
			      .attr("class", "axis")
			      .call(d3.axisLeft(y).ticks(null, "s"))
			    .append("text")
			      .attr("x", 2)
			      .attr("y", y(y.ticks().pop()) + 0.5)
			      .attr("dy", "0.32em")
			      .attr("fill", "#000")
			      .attr("font-weight", "bold")
			      .attr("text-anchor", "start");

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
			      // .attr("transform", "translate(30,0)")

			  legend.append("text")
			      .attr("x", width - 24)
			      .attr("y", 9.5)
			      .attr("dy", "0.32em")
			      .text(function(d) { return d; })
			      // .attr("transform", "translate(30,0)");



	});
});


				
