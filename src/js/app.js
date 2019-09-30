import * as d3 from "d3"
import * as topojson from "topojson"
import ScrollyTeller from "./scrollyteller"
import addLabel from "../components/addLabels"

function init(sealevels) {

	var statusMessage = d3.select("#statusMessage");
	var width = document.querySelector("#data-viz2").getBoundingClientRect().width
	var height = window.innerHeight;
	var mobile = false;

	if (width < 620) {
	    // height = width * 0.8;
	    mobile = true;
	}

	var margin = {top: 100, right: 40, bottom: 100, left:10}
	
	width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

	var active = d3.select(null);
	var scaleFactor = width / 860

	var svg = d3.select("#data-viz2").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.attr("id", "svg");		                                    

	var features = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");			

	var x = d3.scaleLinear()
		.rangeRound([0, width]);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	x.domain([0,100]);
	y.domain([0,400]);	

	var xAxis = d3.axisBottom(x)
	var yAxis = d3.axisLeft(y)
	
	var lowLine = d3.line()
		.curve(d3.curveCardinal)
			.defined(function(d) {
        		return d;
    		})
			.x(function(d) { 
				return x(d.index); 	
				})
			.y(function(d) { 
				return y(d.random1); 
			});

	var highLine = d3.line()
		.curve(d3.curveCardinal)
			.defined(function(d) {
	    		return d;
			})
			.x(function(d) { 
				return x(d.index); 	
				})
			.y(function(d) { 
				return y(d.random2); 
			});
		

	features.append("g")
		.attr("class","x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	features.append("g")
		.attr("class","y axis")
		.call(yAxis)

	features.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", function() {return - 7
		})
		.attr("x",(-1 * (height/2)))
		.attr("class","label")
		.attr("fill", "#767676")
		.text("Height →");

	features.append("text")
		.attr("x", width/2)
		.attr("y", height + 16)
		.attr("fill", "#767676")
		.attr("class","label")
		.attr("text-anchor", "end")
		.text("Time →");			

	features.append("path")
		.datum(sealevels)
		.attr("id", "lowLevel")
		.attr("fill", "none")
		.attr("stroke", "#197caa")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", lowLine);

	features.append("path")
		.datum(sealevels)
		.attr("id", "highLevel")
		.attr("fill", "none")
		.attr("stroke", "#4bc6df")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", highLine);	

	var lowLevel = d3.select("#lowLevel")
	var lowLength = lowLevel.node().getTotalLength();

   lowLevel
      .attr("stroke-dasharray", lowLength + " " + lowLength ) 
      .attr("stroke-dashoffset", lowLength);  

    var highLevel = d3.select("#highLevel")
	var highLength = highLevel.node().getTotalLength();    

	highLevel
      .attr("stroke-dasharray", lowLength + " " + lowLength ) 
      .attr("stroke-dashoffset", lowLength);

    features.append("line")
		.attr("x1", x(1))
		.attr("y1", y(157))     
		.attr("x2", x(100))  
		.attr("y2", y(157))
		.style("opacity",0)
		.attr("class", "mean1")
		.attr("stroke", "#951c55")
		.attr("stroke-width", 1); 

	 features.append("text")
		.attr("x", width)
		.attr("y", y(157))     
		.style("opacity",0)
		.attr("class", "mean1 label")
		.attr("dy",3)
		.attr("dx",2)
		.text("Current average"); 	

	//227

	features.append("line")
		.attr("x1", x(1))
		.attr("y1", y(157))     
		.attr("x2", x(100))  
		.attr("y2", y(157))
		.style("opacity",0)
		.attr("class","mean2")
		.attr("stroke", "#b82266")
		.attr("stroke-width", 1);
	 
	features.append("text")
			.attr("x", width)
			.attr("y", y(157))     
			.style("opacity",0)
			.attr("class", "mean2 label")
			.attr("dy",3)
			.attr("dx",2)
			.text("Future average"); 

	features.append("line")
		.attr("x1", x(1))
		.attr("y1", y(320))     
		.attr("x2", x(100))  
		.attr("y2", y(320))
		.style("opacity",0)
		.attr("class","high")
		.attr("stroke", "#800c0c")
		.attr("stroke-width", 1); 	

	 features.append("text")
		.attr("x", width)
		.attr("y", y(320))     
		.style("opacity",0)
		.attr("class", "high label")
		.attr("dy",3)
		.attr("dx",2)
		.text("1 in 100 year height"); 	

	addLabel({"el":features,
			"id":"extremeLabel",
			"targetX":x(87.8),
			"targetY":y(340),
			"sourceX":x(80),
			"sourceY":y(360),
			"text":"Extreme event",
			"sweepFlag":1,
			"textAnchor":"end"
			});

	d3.select("#extremeLabel").style("opacity",0)

     //156.88	226.88

	// addLabel({"el":svg,"projection":projection,"id":"denison","targetLat":-33.9,"targetLon":151.2,"sourceLat":-36.09,"sourceLon":154.21,"text":"Fort Denison","arrowOffsetX":0,"arrowOffsetY":0});

	 const scrolly = new ScrollyTeller({
            parent: document.querySelector("#scrolly-2"),
            triggerTop: 1/3, // percentage from the top of the screen that the trigger should fire
            triggerTopMobile: 0.75,
            transparentUntilActive: true
     });

	scrolly.addTrigger({num: 1, do: () => {
		 lowLevel.transition("blah")
	      	.ease(d3.easeLinear)
	        .duration(5000)
	        .attr("stroke-dashoffset", 0)

	    d3.selectAll(".mean1").transition("mean1").style("opacity", 0)    
    }});

    scrolly.addTrigger({num: 2, do: () => {
    	d3.selectAll(".mean1").transition("mean1").style("opacity", 1)
    	d3.selectAll(".high").transition("high").style("opacity", 0)
    	d3.select("#extremeLabel").transition("high").style("opacity",0)

    }});

    scrolly.addTrigger({num: 3, do: () => {

    	d3.selectAll(".high").transition("high").style("opacity", 1)
    	d3.select("#extremeLabel").transition("high").style("opacity",1)

    	d3.select("line.mean2").transition("mean22").attr("y1", y(157)).attr("y2", y(157))
    	d3.select("text.mean2").transition("mean22").attr("y", y(157))
    	d3.selectAll(".mean2").transition("mean2").style("opacity", 0)
    }});

    scrolly.addTrigger({num: 4, do: () => {
    	d3.selectAll(".mean2").transition("mean2").style("opacity", 1)
    	d3.select("#extremeLabel").transition("high").style("opacity",0)
    	d3.select("line.mean2").transition("mean22").duration(5000).attr("y1", y(227)).attr("y2", y(227))
    	d3.select("text.mean2").transition("mean22").duration(5000).attr("y", y(227))

    	highLevel.transition("blah")
	      .attr("stroke-dashoffset", lowLength);

    }});

    scrolly.addTrigger({num: 5, do: () => {

    	highLevel.transition("blah")
	      	.ease(d3.easeLinear)
	        .duration(5000)
	        .attr("stroke-dashoffset", 0)

    }});

    scrolly.watchScroll();

}

Promise.all([
	d3.csv('<%= path %>/assets/sealevels.csv')
])
.then((results) =>  {
	
	init(results[0])

	// var to=null
	// var lastWidth = document.querySelector("#mapContainer").getBoundingClientRect()
	// window.addEventListener('resize', function() {

	// 	var thisWidth = document.querySelector("#mapContainer").getBoundingClientRect()
	// 	if (lastWidth != thisWidth) {
			
	// 		window.clearTimeout(to);
	// 		to = window.setTimeout(function() {
	// 			    init(results[0],results[1],results[2],results[3])
	// 			}, 100)
	// 	}
			
	// })

});