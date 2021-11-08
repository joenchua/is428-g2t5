import { COMPARISON_BINARY_OPERATORS } from '@babel/types';
import * as d3 from 'd3';
import { pack, hierarchy } from 'd3-hierarchy'

const draw = (props, componentNode, selectedCountry) => {
    let data = props.data;

    data = data.filter(function (d) {
        if (selectedCountry.length === 0)
            return d.Medal !== "NA"

        return d.Medal !== "NA" && d.NOC === selectedCountry
    });

    const rollupData = d3.rollup(
        data,
        d => d.length, // reducerFn
        d => d.Sport,
        d => d.Event, // keyToGroupBy
    )

    const childrenAccessorFn = ([key, value]) => value.size && Array.from(value)

    const hierarchyData = d3.hierarchy([null, rollupData], childrenAccessorFn)
        .sum(([key, value]) => value)
        .sort((a, b) => b.value - a.value)

    const width = 932
    const height = 932

    const pack = d3.pack()
        .size([width, height])
        .padding(5)


    var tooltip = d3.select(componentNode)
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
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }

    var mousemove = function (event,d) {
        const { children = null } = d
        if (children) {
            if (children.length > 0 && children[0].children) {
                tooltip.style("opacity", 0)
            }

            let total = 0
            children.forEach(child => {
                const [_, value] = child.data
                total += value
            })

            tooltip
            .html(`Sport: ${d.data[0]} </br> Total number of Medal: ${total}`)
            .style("left",event.pageX + "px")
            .style("top",event.pageY + "px")
        } else {
            tooltip
            .html(`Sport: ${d.data[0]} </br> Total number of Medal: ${d.data[1]}`)
            .style("left",event.pageX + "px")
            .style("top",event.pageY + "px")
        }
    }

    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
    }

    pack(hierarchyData);
    const root = pack(hierarchyData);
    let focus = root;
    let view;

    let svg = d3.select(componentNode)
        .append('svg')
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -25px")
        .style("margin-left", "12px")
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));

    const node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("fill", d => d.children ? color(d.depth) : "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("mouseover", function () { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function () { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()))


    const label = svg.append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data[0])
        .style("font-size", d => d.depth === 1 ? "20px" : "10px")



    zoomTo([root.x, root.y, root.r * 2]);
    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    }

    function zoom(event, d) {
        const focus0 = focus;

        focus = d;
        const transition = svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });

        label
            .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; })
    }
}

export default draw;