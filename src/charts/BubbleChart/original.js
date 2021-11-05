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

    const width = 700
    const height = 700

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
        .interpolate(d3.interpolateHcl)

    var mouseover = function (d) {
        tooltip
            .style('opacity', 1)

        let g = d3.select(this);
        let n = g.select('.the-node');

        if (n.classed('solid')) {
            n.transition()
                .style('stroke', "rgba(177,30,51,0.1)")
        } else {
            n.transition()
                .style('fill', "rgba(177,30,51,0.1)");
        }

        g.select('.label')
            .transition().duration(700)
            .style('fill', 'white')

    }

    var mousemove = function (d, i) {
        console.log(d)
        tooltip
            .html(`Sport: ${i.data[0]} </br> Total number of Medal: ${i.data[1]}`)
            .style("left", (d3.pointer(this)[0] + 400) + "px")
            .style("top", (d3.pointer(this)[1] + 400) + "px")
    }

    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        let g = d3.select(this);
        let n = g.select('.the-node');

        if (n.classed('solid')) {
            n.transition().duration(400)
                .style('fill', "rgba(177,30,51,0.2)")
                .attr('r', 14);
        } else {
            n.transition().duration(400)
                .style('fill', "rgba(177,30,51,0.2)")
        }
        g.select('.label')
            .transition().duration(700)
            .style('fill', "black")
            .style("stroke", "none")
    }



    d3.select('.vis-bubblechart > *').remove();

    pack(hierarchyData);

    let svg = d3.select('.vis-bubblechart')
        .append('svg')
        .attr('width', 700)
        .attr('height', 700)
        .selectAll()
        .data(hierarchyData.descendants())
        .enter()
        .append('g').attr('class', 'node')
        .attr('transform', d => 'translate(' + [d.x, d.y] + ')')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    
    svg
        .append('circle')
        .classed('the-node', true)
        .style("cursor", "pointer")
        .attr('r', d => d.r)
        .style('fill', "rgba(177,30,51,0.2)")
        .style('stroke', '#2f2f2f')

    svg
        .append('text')
        .attr('class', 'label')
        .attr('dy', 4)
        .attr('dx', 0)
        .text(d => d.children === undefined ? d.data.Sport : '');
}

export default draw;