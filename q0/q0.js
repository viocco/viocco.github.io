/*
var dailyRidership = {}
d3.csv("/data/CTA_DailyRides.csv", function(data) {
    let newObj = {"rides": data.rides, "daytype": data.daytype}
    dailyRidership[data.date] = newObj
})
*/
/*
var weeklyRidership = {}
d3.csv("/data/CTA_WeeklyRides.csv", function(data) {
    let newObj = {"rides": data.rides}
    weeklyRidership[data.date] = newObj
})
*/

//way point stuff
var waypoint = new Waypoint({
    element: document.getElementById('basic-waypoint'),
    handler: function() {
        var startFilter = new Date(2019,1,6)
        var endFilter = new Date(2021,12,1)
        updateHelper(startFilter, endFilter)

    }
  })

  var waypoint2 = new Waypoint({
    element: document.getElementById('waypoint-2'),
    handler: function() {
        var startFilter = new Date(2011,1,2)
        var endFilter = new Date(2021,12,1)
        updateHelper(startFilter, endFilter)
    }
  })



// Features of the annotation
const annotations = [
    {
      note: {
        label: "State of Illinois issues stay-at-home order",
        title: "March 21st:"
      },
      connector: {
        end: "arrow",        // none, or arrow or dot
        type: "curve",       // Line or curve
        points: 3,           // Number of break in the curve
        lineType : "horizontal"
      },
      x: 400,
      y: 100,
      dy: 70,
      dx: 100
    }
  ]









var annotationVisible = false;
var annotationDeleted = false;



function filterRidership(startFilter, endFilter){
    var filteredRidership = {}
    Object.keys(weeklyRidership).forEach(el => {
        if (convertToDate(el) <= endFilter && convertToDate(el) >= startFilter){
            filteredRidership[el] = weeklyRidership[el]
        }
    })
    return filteredRidership;
}

//drawScatter();

var startDate = new Date (2019,1,1)
var endDate = new Date(2021,12,1)
var dataset;
setupGraph();
//updateHelper(startDate, endDate)
//updateHelper(new Date(2011,1,1), endDate)

function getMax(dict, prop){
    var max = 0;
    var maxDate = 0
    Object.keys(dict).forEach(el => {
        if (parseInt(dict[el][prop]) > max){
            max = parseInt(dict[el][prop])
            maxDate = el
        }
    })
    return [max, maxDate];
}
function getMin(dict, prop){
    var min = Number.MAX_SAFE_INTEGER;
    var minDate = 0;
    Object.keys(dict).forEach(el => {
        if (parseInt(dict[el][prop]) < min){
            min = parseInt(dict[el][prop])
            minDate = el
        }
    })
    return [min, minDate];
}
var line;
function drawScatter(){
    var startDate = new Date (2020,1,1)
    var endDate = new Date(2021,12,1)
    var ridership = filterRidership(startDate, endDate)

    console.log("maxReturn: ", getMax(ridership, "rides"))
    let [maxRides, maxDate] = getMax(ridership, "rides")
    console.log("maxRides is: ", maxRides)
    console.log("maxDate is: ", maxDate)
    let [minRides, minDate] = getMin(ridership, "rides")
    console.log("minRides is: ", minRides)
    console.log("minDate is: ", minDate)



    var xScale = d3.scaleTime().domain([startDate, endDate]).range([0, widthLine - marginLine.right])
    var scatterXAxis = d3.axisBottom().scale(xScale)
    svgDaily.append("g").call(scatterXAxis).attr("transform", "translate(0," + (heightLine-marginLine.top - marginLine.bottom) + ")")
    var yScale = d3.scaleLinear().domain([0,maxRides]).range([heightLine - marginLine.top - marginLine.bottom,0])
    var scatterYAxis = d3.axisLeft().scale(yScale)
    svgDaily.append("g").call(scatterYAxis)

    dataset = Object.keys(ridership).map(el => [el, parseInt(ridership[el]["rides"])])
    console.log("dataset is: ", dataset)
    /*
    svgDaily.selectAll("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line)

   svgDaily.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("cx", d => xScale(convertToDate(d[0])))
        .attr("cy", d => yScale(d[1]))
        .attr("r", 1.5)
    */
    svgDaily.append("path")
        .data([dataset])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(d => xScale(convertToDate(d[0])))
        .y(d => yScale(d[1])))

}

var xScale, scatterXAxis, yScale, scatterYAxis;
var line;
function setupGraph(){
    xScale = d3.scaleTime().range([0, widthLine - marginLine.right])
    scatterXAxis = d3.axisBottom().scale(xScale)
    svgDaily.append("g").attr("transform", "translate(0," + (heightLine-marginLine.top - marginLine.bottom) + ")").attr("class", "myXAxis")
    yScale = d3.scaleLinear().range([heightLine - marginLine.top - marginLine.bottom,0])
    scatterYAxis = d3.axisLeft().scale(yScale)
    svgDaily.append("g").attr("class", "myYAxis")
    svgDaily.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'middle')
        .attr('y', 3)
        .attr('dy', '.5em')
				.attr('transform', `translate(-80, ${heightLine/2 - marginLine.top}) rotate(-90)`)
        .text('Average Weekly Ridership')
        .attr('font-family', 'Helvetica');
    svgDaily.append("text")
        .attr("class", "xlabel")
        .style("text-anchor", "middle")
        .attr('transform', `translate(${widthLine/2 - 0.5*margin.right}, ${heightLine - marginLine.top})`)
        .text("Time")

}

var startFilter = new Date(2019,1,2)
var endFilter = new Date(2021,12,1)
updateHelper(startFilter, endFilter)

function updateHelper(startDate, endDate){
    console.log(startDate)
    var ridership = weeklyRidership//filterRidership(startDate, endDate)
    dataset = Object.keys(ridership).map(el => [el, parseInt(ridership[el]["rides"])])
    var diffLen = Object.keys(weeklyRidership).length - Object.keys(ridership).length
    for (var i = 0; i < diffLen; i++){
        dataset.push(dataset[dataset.length-1])
    }

    var d = new Date (2015,1,1);

    if (startDate > d) {
        if (!annotationVisible) {
            const makeAnnotations = d3.annotation().annotations(annotations)

            annotate1 = d3.select("#ridership")
                .append("g")
                .call(makeAnnotations)

            annotationVisible = true;
            console.log("Show annotation")
        }

    }
    else {

        if (annotationVisible) {
            annotate1.selectAll("g").remove();
            annotationVisible = false
            console.log("Deleting annotation")

        }
    }




    //annotate1.selectAll("g").remove();


    update(startDate, endDate, dataset)
}
function update(startDate, endDate){
    var ridership = filterRidership(startDate, endDate)
    //console.log("maxReturn: ", getMax(ridership, "rides"))
    let [maxRides, maxDate] = getMax(ridership, "rides")
    //console.log("maxRides is: ", maxRides)
    //console.log("maxDate is: ", maxDate)
    let [minRides, minDate] = getMin(ridership, "rides")
    //console.log("minRides is: ", minRides)
    //console.log("minDate is: ", minDate)

    xScale.domain([startDate, endDate])
    yScale.domain([0,maxRides])

    svgDaily.selectAll(".myXAxis").transition().call(scatterXAxis)
    svgDaily.selectAll(".myYAxis").transition().call(scatterYAxis)

    //dataset = Object.keys(ridership).map(el => [el, parseInt(ridership[el]["rides"])])
    //console.log("dataset is: ", dataset)

    var u = svgDaily.selectAll(".lineTest").data([dataset])
    //console.log("u is: ", u)
    /*
    u.enter().append("path").attr("class", "lineTest").merge(u).transition().duration(3000).attr("d", d3.line()
    .x(d => xScale(convertToDate(d[0])))
    .y(d => yScale(d[1])))
    .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)

    u.exit().remove()
    */
    var bound = 0;
    var yIntercept = dataset[0][1];
    u.join(
        enter => enter.append("path").attr("class", "lineTest").attr("d", d3.line()
            .x(d => {
                bound = xScale(convertToDate(d[0]))
                //console.log("scale: ", bound)
                if (bound < 0) return 0
                if (bound == 0) yIntercept = yScale(d[1])
                return bound
                })
            .y(d => {
                if (convertToDate(d[0]) < startDate) return yScale(yIntercept)
                return yScale(d[1])
                }))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5),
        update => update.transition().duration(3000).attr("d", d3.line()
            .x(d => {
                bound = xScale(convertToDate(d[0]))
                //console.log("scale: ", bound)
                if (bound < 0) return 0
                if (bound == 0) yIntercept = yScale(d[1])
                return bound
                })
            .y(d => {
                if (convertToDate(d[0]) < startDate) return yScale(yIntercept)
                return yScale(d[1])
                }))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
    )
    //console.log("yIntercept: ", yIntercept)
    /*
    svgDaily.append("path")
        .data([dataset])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(d => xScale(convertToDate(d[0])))
        .y(d => yScale(d[1])))
        */
}
