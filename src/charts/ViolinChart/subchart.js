import * as d3 from "d3";

const drawSubChart = (props) => {

    // console.log("Hello!!!!!");

    const margin = {top: 30, right: 30, bottom: 80, left: 40},
        width = 730 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    // define the chart
    var svg = d3.select(".vis-subPhysicalChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0, 0.5])
        .range([height, 0])

    var x = d3.scaleLinear()
        .domain([120, 250])
        .range([0, width])

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(50,30)")
        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")))

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", 20)
        .text("Percentage of Athletes")
        .attr("text-anchor", "start")
    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(50,420)")
        .call(d3.axisBottom(x))
    //
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 730)
        .attr("y", 460)
        .text("Height (in cm)");


    // const listeningRect = svg
    // .append("rect")
    // .attr("class", "listening-rect")
    // .attr("width", width)
    // .attr("height", height)
    // .on("mousemove", onMouseMove)
    // .on("mouseleave", onMouseLeave);
    //
    // function onMouseMove () {
    // d3.pointer(event,this.state.svg.node());
    //
    // }


}

export default drawSubChart;