import { COMPARISON_BINARY_OPERATORS } from '@babel/types';
import * as d3 from 'd3';
import { pack, hierarchy } from 'd3-hierarchy'

const draw = (props) => {
    const data = props.data;
    const rollupData = d3.rollup(
        data,
        d => d.length, // reducerFn
        d => d.Sport,
        d => d.Event // keyToGroupBy
    )

    const childrenAccessorFn = ([key, value]) => value.size && Array.from(value)

    const hierarchyData = d3.hierarchy([null, rollupData], childrenAccessorFn)
        .sum(([key, value]) => value)
        .sort((a, b) => b.value - a.value)

    const width = 800
    const height = 800

    const pack = d3.pack()
        .size([width, height])
        .padding(5)


    var tooltip = d3.select(".vis-bubblechart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")

    const color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateReds)

    var mouseover = function (d) {
        tooltip
            .style('opacity', 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)

    }

    var mousemove = function (d, i) {
        if (d => d.depth === 1 ? d.data[0] : '')
            console.log(d)
        tooltip
            .html(`Sport: ${i.data[0]} </br> Total number of Medal: ${i.data[1]}`)
            .style("left", (d3.pointer(this)[0] + 400) + "px")
            .style("top", (d3.pointer(this)[1] + 400) + "px")
    }

    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }



    d3.select('.vis-bubblechart > *').remove();

    pack(hierarchyData);

    let svg = d3.select('.vis-bubblechart')
        .append('svg')
        .attr('width', 900)
        .attr('height', 900)


    const node = svg.selectAll("g")
        .data(d3.group(hierarchyData.descendants(), d => d.height))
        .join("g")
        .selectAll("g")
        .data(d => d[1])
        .join("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
       

    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.height))
        .style("cursor", "pointer");

    const leaf = node.filter(d => !d.children);

    leaf.select("circle")
        .attr("id", d => (d.leafUid = ("leaf")).id);

    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = ("clip")).id)
        .append("use")
        .attr("xlink:href", d => d.leafUid.href);


    // leaf.append("text")
    //     .attr('class', 'label')
    //     .attr('dy', 4)
    //     .attr('dx', 0)
    //     .text(d => d.depth === 1 ? d.data[0] : '');

    const groupLabel = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(hierarchyData.descendants())
        .join("text")
        .text(d => d.depth === 1 ? d.data[0] : '');

    groupLabel
        .attr("transform", d => `translate(${(d.x)}, ${(d.y - (d.r))})`)
        .attr("dy", "0.5em")
        .attr("class", "repo-name")
        .attr("fill", "#fff")
        .clone(true)
        .lower()
        .attr("aria-hidden", "true")
        // .style("text-shadow", "1px 1px 2px #40081C, -1px 1px 2px #40081C") // This doesn't export well
        .attr("fill", "none")
        .attr("stroke", "#6A1131")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round");


    svg.append("text")
        .attr("id", "byline")
        .attr("x", width)
        .attr("y", height)
        .attr("dy", "-1em")
        .attr("text-anchor", "end")


}

export default draw;



