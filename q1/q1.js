// define variables
let stations;

let x, y, y_1, y_2, xAxis1, yAxis1, xAxis2, yAxis2;

let dots;

let tooltip, tooltip2;

let legend, legend2;

let reg_line = 'undefined';

// create specific color scale
const color = d3.scaleOrdinal()
  .domain(["red", "blue", "green", "brown", "purple", "yellow", "pink", "orange", "purple_express"])
  .range(["#C50C30", "#45A1DE", "#2E9B3A", "#62361B", "#522398", "#F8E300", "#E27EA6", "#F1451E", "#522398"]);

const XTEXTLABEL = {'medincome': 'Median Income ($)', 'pct_college': "Percent with a Bachelor's Degree", 'pct_white': "Percent White Population"}
const YTEXTLABEL = {'increase': 'Percent Change In Average Ridership (2020 to 2021)', 'decrease': "Percent Change In Average Ridership (2019 to 2020)"}

// waypoints for scorlly-telling
var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-2'),
  handler: function(direction) {
    xVar = 'medincome';
    visibleDots('#ridership2')
    updateXAxis('medincome', '#ridership2');
    updateDots('medincome', '#ridership2');
    regress('medincome', '#ridership2');
    console.log("make dots VISIBLE in basic waypoint 2...");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-3'),
  handler: function() {
    xVar = 'pct_college';
    updateXAxis('pct_college', '#ridership2');
    updateDots('pct_college', '#ridership2');
    regress('pct_college', '#ridership2');
    console.log("chagne X variable to education");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-4'),
  handler: function() {
    xVar = 'pct_white';
    updateXAxis('pct_white', '#ridership2');
    updateDots('pct_white', '#ridership2');
    regress('pct_white', '#ridership2');
    console.log("chagne X variable white population");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-5'),
  handler: function() {
    appendLine();
    visibleDots('#ridership3');
    updateXAxis('medincome', '#ridership3');
    updateDots('medincome', '#ridership3');
    console.log("make dots VISIBLE in basic waypoint 3...");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-6'),
  handler: function() {
    updateXAxis('pct_college', '#ridership3');
    updateDots('pct_college', '#ridership3');
    regress('pct_college', '#ridership3');
    console.log("Change x variable to education");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-7'),
  handler: function() {
    updateXAxis('pct_white', '#ridership3');
    updateDots('pct_white', '#ridership3');
    console.log("Change x variable to white population");
  },
  offset: "100%"
})

var waypoint = new Waypoint({
  element: document.getElementById('basic-waypoint-8'),
  handler: function() {
    console.log("add in regression line")
  },
  offset: "100%"
})

// Add options to the dropdown "choose X variable in the end"
d3.select("#varSelection")
  .selectAll('myOptions')
    .data(xVarOptions)
  .enter()
    .append('option')
  .text(function (d) {return d; }) // text showed in the menu
  .attr("value", function (d) {return d; }) // corresponding value returned

// updates graph as the dropdown changes
d3.select("#varSelection").on("change", function (d) {
  xVar = d3.select(this).property("value");
  if (xVar === "Median Income") {
    xVar = 'medincome';
  } else if (xVar === "Percent White Population") {
    xVar = 'pct_white';
  } else if (xVar === "Percent with a Bachelor's Degree") {
    xVar = 'pct_college';
  }
  updateXAxis(xVar, '#ridership4');
  updateXAxis(xVar, '#ridership5');
  updateDots(xVar, '#ridership4');
  updateDots(xVar, '#ridership5');
});


// Tooltip and Mouseover
// these should only be done for the last two graphs.
function addTooltip() {
  tooltip = d3.select('#vis_q2')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  tooltip2 = d3.select('#vis_q2')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip2')
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
 }

var mouseover = function(d) {
  for (var i = 0; i < stations.length; i++) {
    if (stations[i]['STATION_NAME'] == d.STATION_NAME && stations[i].color == stations[i].curr_color){
      tooltip.style('opacity', 0.53);

    }
  }
  d3.select(this)
    .style("stroke", "black")
}

var mousemove = function(d) {
  tooltip.html("Station: " + d.STATION_NAME + "<br> 2019: " + d.yr_2019 + "<br> 2020: " + d.yr_2020)
    .style("left", event.clientX + "px")
		.style("top",  d3.mouse(this)[1] + "px");
}

var mouseleave = function(d) {
  tooltip.style("opacity", 0);
  d3.select(this)
    .style("stroke", "none")
}

var mouseover2 = function(d) {
  colors = []
  for (var i = 0; i < stations.length; i++) {
		if (stations[i]['STATION_NAME'] == d.STATION_NAME && stations[i].color == stations[i].curr_color){
      tooltip2.style('opacity', 0.53);
		}
  }
  d3.select(this)
    .style("stroke", "black")
}

var mousemove2 = function(d) {
	tooltip2.html("Station: " + d.STATION_NAME + "<br> 2020: " + d.yr_2020 + "<br> 2021: " + d.yr_2021)
		// .style("left", d3.mouse(this)[0] + margin.left + 100 +  + "px")
    .style("left", event.clientX + "px")
		.style("top", d3.mouse(this)[1] + 30 + "px");
}

var mouseleave2 = function(d) {
	tooltip2.style("opacity", 0);
  d3.select(this)
    .style("stroke", "none")
}

// for updating dots
var mousedown = function(d) {
  d3.select(this)
    .style("fill", coloring(this))
  updateDotsColor();
}

////////////////////////////////

function obtainXScale(option) {
  return d3.scaleLinear()
    .range([0, width])
    .domain(d3.extent(stations, function (d) {
      if (option === "pct_white") {
        return d.white_pop / d.total_pop;
      } else if (option === "medincome") {
        return d.medincome;
      } else if (option === "pct_college") {
        return d.education / d.total_pop;
      }
    }))
    .nice();
}

function drawXAxis(option, ref) {
  console.log("Inside of drawXAxis", xVar);

  // x scale
  x = obtainXScale(option);

  // append x axis
  d3.select('body').select(ref).select('g')
    .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'xAxis')
      .call(d3.axisBottom(x).ticks(11));

  // append label for x axis
  d3.select('body').select(ref).select('g')
    .append("text")
      .attr("class", "xlabel")
      .style("text-anchor", "middle")
      .attr('transform', `translate(${width/2}, ${height + margin.top + margin.bottom/2})`)
      .text(XTEXTLABEL[option]);
}

function updateXAxis(option, ref){
  // get a new x Scale
  x = obtainXScale(option);

  // transition the x axis
  d3.select('body').select(ref).select('.xAxis')
    .transition().duration(800)
    .call(d3.axisBottom(x).ticks(11));

  // change the x axis label
  d3.select('body').select(ref).select('.xlabel')
    .style("text-anchor", "middle")
    .transition().duration(800)
    .text(XTEXTLABEL[option])
    .attr('font-family', 'Helvetica');
}

function obtainYScale(option) {
  if (option === 'increase') {
    return d3.scaleLinear()
    .domain(d3.extent(stations, d => d.yr_2021 / d.yr_2020 - 1))
    .range([height, 0])
    .nice();
  } else if (option === 'decrease') {
    return d3.scaleLinear()
    .domain([d3.min(stations, d => d.yr_2020 / d.yr_2019 - 1), 0])
    .range([height, 0])
    .nice();
  }
}

function drawYAxis(option, ref) {
  // y scale
  y = obtainYScale(option)

  // append y axis
  d3.select('body').select(ref).select('g').append('g')
    .attr('class', 'yAxis')
    .call(d3.axisLeft(y));

  // append y axis label
  d3.select('body').select(ref).select('g').append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('y', 3)
    .attr('dy', '.5em')
		.attr('transform', `translate(${-margin.left/1.8}, ${height/2 + margin.top}) rotate(-90)`)
    .text(YTEXTLABEL[option])
    .attr('font-family', 'Helvetica');
}

function createAxes() {
  // for svg#ridership2 -- decrease, medincome
  drawXAxis('medincome', '#ridership2');
  drawYAxis('decrease', '#ridership2');
  // for svg#ridership3 -- increase, medincome
  drawXAxis('medincome', '#ridership3');
  drawYAxis('increase', '#ridership3');
  // likewise for 4 and 5
  drawXAxis('medincome', '#ridership4');
  drawYAxis('decrease', '#ridership4');
  drawXAxis('medincome', '#ridership5');
  drawYAxis('increase', '#ridership5');
}

function regress(option, ref) {
  // remove regression line if any
  console.log(xVar)
  d3.select("body").select(ref).select('g').select('.regression-line').remove();

  let temp = [];
  let max = -Infinity;
  x = obtainXScale(option);
  y = obtainYScale('decrease');

  for (let i=0; i<stations.length;i++) {
    let pct_white = stations[i]['white_pop']/stations[i]['total_pop'];
    let pct_drop = stations[i]['yr_2020']/stations[i]['yr_2019']-1;
    let pct_bachelor = stations[i]['education']/stations[i]['total_pop'];
    let medincome = stations[i]['medincome'];
    if (option === "pct_white") {
      if(!isNaN(pct_white) && !isNaN(pct_drop) && typeof(pct_white) != 'undefined' && typeof(pct_drop) != 'undefined'){

        temp.push([x(pct_white),y(pct_drop)])
        max = Math.max(max,x(pct_white))
      }
    } else if (option === "medincome") {
        if(!isNaN(medincome) && !isNaN(pct_drop) && typeof(medincome) != 'undefined' && typeof(pct_drop) != 'undefined'){
          temp.push([x(medincome),y(pct_drop)])
          max = Math.max(max,x(medincome))
        }
    } else if (xVar == "pct_college") {
      console.log('ki')
      if(!isNaN(pct_bachelor) && !isNaN(pct_drop) && typeof(pct_bachelor) != 'undefined' && typeof(pct_drop) != 'undefined') {
        temp.push([x(pct_bachelor),y(pct_drop)])
        max = Math.max(max,x(pct_bachelor))
      }
    }
  }

  model = regression.linear(temp)
  y_inp = model.equation[1]
  slope = model.equation[0]
  // console.log(temp)
  console.log(model)
  d3.select('body').select(ref).select('g').append('line')
    .style("stroke", "grey")
    .attr("class","regression-line")
    .style("opacity", .5)
    .style("stroke-width", 2)
    .attr("x1", 0)
    .attr("y1", y_inp)
    .attr("x2", max)
    .attr("y2", (slope)*max+y_inp);
}

function appendLine() {
  // appends a line and a shaded area to svg_2
  if (reg_line == 'undefined'){
    reg_line = 'defined';
    y = obtainYScale('increase');
    // for svg2 ??
    svg_2.append('line')
      .style("stroke", "grey")
      .style("opacity", .3)
      // .style("stroke-width", 1)
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", width)
      .attr("y2", y(0));

    svg_2.append('rect')
      .style("fill", "grey")
      .style("opacity", .3)
      // .style("stroke-width", 1)
      .attr("x", 0)
      .attr("y", y(0))
      .attr("width", width)
      .attr("height", y(-.8) - y(0));
  }
}

function createDots(option1, option2, ref) {
	// create dots for the scatter plot
  console.log("creating dots ...")

  // obtain the correct scales
  x = obtainXScale(option1);
  y = obtainYScale(option2);

  // append dots
  dots = d3.select('body').select(ref).select('g').append('g')
    .selectAll('.dot')
    .data(stations)
    .enter()
    .append('circle')
      .attr('cx', function (d) {
        if (option1 === "pct_white") {
          return x(d.white_pop / d.total_pop);
        } else if (option1 === "medincome") {
          return x(d.medincome);
        } else if (option1 === "pct_college") {
          return x(d.education / d.total_pop);
        }
      })
      .attr('cy', function (d) {
        if (option2 === 'increase') {
          return y(d.yr_2021 / d.yr_2020 - 1);
        } else if (option2 === 'decrease') {
          return y(d.yr_2020 / d.yr_2019 - 1);
        }
      })
      .attr('r', 5)
      .attr('class', 'dot')
      .style('fill', function (d) { return color(d.color)});
      // .style('opacity', 0.3)
}

function updateDotsColor() {
    svg_3.selectAll('.dot')
      .attr('opacity', function(d) {return opacity_selector(d)});
    svg_4.selectAll('.dot')
      .attr('opacity', function(d) {return opacity_selector(d)});
  }

function updateDots(option, ref) {
  // dots are updated when we **fix** the y axis
  // and change the variable that x axis is mapped to
  console.log("Updating dots", option, ref);

  d3.select("body").select(ref).select('g').selectAll('.dot')
    .transition()
    .delay(function (d, i) { return (i * 10) })
    .duration(1000)
    .attr('cx', function (d) {
      x = obtainXScale(option);
      if (option === 'pct_white') {
        return x(d.white_pop / d.total_pop);
      } else if (option === 'medincome') {
        return x(d.medincome);
      } else if (option === 'pct_college') {
        return x(d.education / d.total_pop);
      }
    });
  }

function invisibleDots(ref) {
  d3.select("body").select(ref).selectAll('.dot')
    .attr('opacity', 0);
}
function visibleDots(ref) {
  d3.select("body").select(ref).selectAll('.dot')
    // .transition().duration(1000)
    .attr('opacity', 1);
}

function opacity_selector(d) {
	if (d.color == d.curr_color) {
		return 1;
	} else {
		return 0;
	}
}

function coloring(a) {
  b = a;
	if(String(a.style.fill) == "white") {
		for (var i = 0; i < stations.length; i++) {
			if (stations[i]['color'] == a.__data__){
				stations[i]['curr_color'] = stations[i]['color'];
			}
		}
		return color(a.__data__)
	} else {
		for (var i = 0; i < stations.length; i++) {
			if (stations[i]['color'] == a.__data__) {
				stations[i]['curr_color'] = "white";
			}
		}
		return "white";
	}
}


function createLegend() {
  console.log("creating legend...");

	var keys = ["red", "blue", "green", "brown", "purple", "yellow", "pink", "orange"]

	legend = d3.select('#vis_q2')
    .append('svg')
		.attr("width", 100)
		.attr("height", 25*keys.length)
    .attr('class', 'legend')

	legend.selectAll("mydots").append('g')
	  .data(keys)
	  .enter()
	  .append("circle")
	    .attr("cx", 20)
	    .attr("cy", function(d,i){ return 12.5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 7)
			.attr("class", "key_dot")
			.style("stroke", function(d){ return color(d)})
	    .style("fill", function(d){ return color(d)})
			.on("mousedown", mousedown)

	legend.selectAll("mylabels")
	  .data(keys)
	  .enter()
	  .append("text")
	    .attr("x", 20 + 15)
	    .attr("y", function(d,i){ return 12.5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
	    .style("fill", function(d){ return color(d)})
	    .text(function(d){ return d})
	    .attr("text-anchor", "left")
			.attr("class", "key_text")
      .attr('font-family', 'Helvetica')
	    .style("alignment-baseline", "middle")

  legend2 = d3.select('#vis_q1')
    .append('svg')
    .attr("width", 100)
    .attr("height", 25*keys.length)
    .attr('class', 'legend')

  legend2.selectAll("mydots").append('g')
    .data(keys)
    .enter()
    .append("circle")
      .attr("cx", 20)
      .attr("cy", function(d,i){ return 12.5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .attr("class", "key_dot")
      .style("stroke", function(d){ return color(d)})
      .style("fill", function(d){ return color(d)})
      .on("mousedown",mousedown);

  legend2.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("x", 20 + 15)
      .attr("y", function(d,i){ return 12.5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return color(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .attr("class", "key_text")
      .attr('font-family', 'Helvetica')
      .style("alignment-baseline", "middle");
}

async function loadData() {
  stations = await d3.json("./q1/data_v1.json");
  for (var i = 0; i < stations.length; i++) {
    if (stations[i]['color'] == 'purple_express'){
      stations[i]['color'] = 'purple'
    }
    stations[i]['curr_color'] = stations[i]['color'];
  }
}

loadData().then(() => {
  console.log("This is before we create axes ")
  createAxes();

 // create dots for svg#ridership2
  createDots('medincome', 'decrease', '#ridership2');
  invisibleDots('#ridership2');
  createDots('medincome', 'increase', '#ridership3');
  invisibleDots('#ridership3');
  createDots('medincome', 'decrease', '#ridership4');
  createDots('medincome', 'increase', '#ridership5');

  addTooltip();

  createLegend();

  // add mouseover tooltip
  svg_3.selectAll('.dot')
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  svg_4.selectAll('.dot')
    .on("mouseover", mouseover2)
    .on("mousemove", mousemove2)
    .on("mouseleave", mouseleave2);
});
