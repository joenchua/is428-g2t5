import * as d3 from 'd3';

const draw = (props) => {
    const rawData = props.data;
    const data = [];

    const rollupData = d3.rollup(
        rawData,
        d => d.length, // reducerFn
        d => d.Year,
        d => d.Sex // keyToGroupBy
    )

    for (var year of rollupData){
        let years = {year: '', male: 0, female: 0};
        years.year = year[0];
        const gender = year[1];
        for (var g of gender){
            if (g[0] === 'M'){
                var k = 'male';
            } else {
                k = 'female';
            }
            years[k] = g[1];
        }
        data.push(years)
    }
    data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0))

    var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 850 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom;

    const keys = ['female','male']

    console.log(keys)
    
    // color palette
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['rgba(255,182,193, 1)','rgba(54, 174, 175, 1)']);
  
    //stack the data?
    const stackedData = d3.stack()
      .keys(keys)
      (data)
  
    d3.select(".vis-areachart > *").remove();

    var svg = d3.select(".vis-areachart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .call(d3.axisBottom(x).ticks(5))
    .attr('transform','translate(20,'+330+')')

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 800)
      .attr("y", 350 )
      .text("year");

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", 20 )
      .text("# of Athletes")
      .attr("text-anchor", "start")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 16000])
    .range([ height-100, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .style("transform","translate(20px,40px)")

  ////////////////////////
  // BRUSHING AND CHART //
  ///////////////////////

  // Adding a clipPath
  svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height-20 )
      .attr("x", 0)
      .attr("y", 20)

  // Add brushing
  var brush = d3.brushX()
      .extent( [ [0,0], [width,height-60] ] )
      .on("end", updateChart)

  // Creating a scatter variable where both the circles and the brush take place
  var areaChart = svg.append('g')
    .attr("clip-path", "url(#clip)")
    .style("transform","translate(20px,40px)")

  // Area generator
  var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { console.log(color(d.key)); return color(d.key); })
      .attr("d", area)

  // Add the brushing
  areaChart
    .append("g")
      .attr("class", "brush")
      .style("transform","translateY(-40px)")
      .call(brush)

  var idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart(event) {

    var extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain(d3.extent(data, function(d) { return d.year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }

    const highlight = function(event,d){
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function(event,d){
      d3.selectAll(".myArea").style("opacity", 1)
    }

    ////////////
    // LEGEND //
    ///////////

    var size = 20
    svg.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 600)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 600 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

}

export default draw;