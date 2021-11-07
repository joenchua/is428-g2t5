import * as d3 from 'd3';

const draw = (props) => {
    const rawData = props.data;
    // console.log(data)
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
            }
            else {
                k = 'female';
            }
            years[k] = g[1];
        }
        data.push(years)
    }
    console.log(data)
    data.sort((a,b) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0))

    var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // var years = ['1896', '1900', '1904', '1906', '1908', '1912', '1920', '1924', '1928', '1932', '1936', '1948', '1952', '1956', '1960', '1964', '1968', '1972', '1976', '1980', '1984', '1988', '1992', '1994', '1996', '1998', '2000', '2002', '2004', '2006', '2008', '2010', '2012', '2014', '2016']

        d3.select(".vis-areachart > *").remove();

    var svg = d3.select(".vis-areachart")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime()
        .domain(d3.extent(data, d=>d3.timeParse('%Y')(d.year)))
        .range([0,width-40])
    var xAxis = svg.append('g')
        .call(d3.axisBottom(x).ticks(5))
        .attr('transform','translate(20,'+300+')')

    const y = d3.scaleLinear()
            .domain([0, d3.max(data,d=>d.male)])
            .range([height-100, 0])
    svg.append('g')
        .call(d3.axisLeft(y))
        .attr('transform', 'translate(20,40)')
    
    svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 680 )
            .attr("y", 320 )
            .text("Year");
      
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -20)
        .attr("y", 20 )
        .text("# of Athletes")
        .attr("text-anchor", "start")

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
            .attr("width", width-40 )
            .attr("height", height-20 )
            .attr("x", 20)
            .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height-100] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)

    var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")

    const male = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d=>x(d3.timeParse('%Y')(d.year)))
            .y0(y(0))
            .y1(d=>y(d.male))

    // svg.append('path')
    //         .datum(data)
    //         .attr('d', male)
    //         .attr('fill','rgba(54, 174, 175, 0.65)')
    //         .attr('stroke-width',2)
    //         .attr('transform', 'translate(20,40)')
            
    const female = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d=>x(d3.timeParse('%Y')(d.year)))
            .y0(y(0))
            .y1(d=>y(d.female))
            
    svg.append('path')
            .datum(data)
            .attr('d', female)
            .attr('fill','rgba(255,182,193, 0.7)')
            .attr('stroke-width',2)
            .attr('transform', 'translate(20,40)')

    areaChart
        .selectAll("mylayers")
        .data(data)
        .enter()
        .append("path")
            .datum(data)
            .attr('d', male)
            .attr('fill','rgba(54, 174, 175, 0.65)')
            .attr('stroke-width',2)
            .attr('transform', 'translate(20,40)')

    // areaChart
    //     .selectAll("mylayers")
    //     .data(data)
    //     .enter()
    //     .append("path")
    //         .datum(data)
    //         .attr('d', female)
    //         .attr('fill','rgba(255,182,193, 0.7)')
    //         .attr('stroke-width',2)
    //         .attr('transform', 'translate(20,40)')

    areaChart
        .append("g")
          .attr("class", "brush")
          .call(brush)
          .attr('transform', 'translate(20,40)')

    var idleTimeout;
    function idled() { idleTimeout = null; }

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
          .attr("d", male)
        //   .attr("d", female)
    }
}

export default draw;