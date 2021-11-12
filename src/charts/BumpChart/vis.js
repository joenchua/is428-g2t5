import * as d3 from 'd3';
const draw = (props) => {
    // console.log(props.data)
    var data = props.data.map(data=> 
            {
            return {"NOC": data.NOC, "Medal": data.Medal,"Year": data.Year}
            }
    )

    const countries = props.countries
    // console.log("Countries:", countries)
    data = data.filter(data=>countries.includes(data.NOC))

    const NOCs = Array.from(new Set(data.flatMap(d => [d.NOC])))
    const Years = Array.from(new Set(data.flatMap(d => [d.Year]))).sort()
    // console.log("NOC:", NOCs, "Year:", Years)

    // console.log("territories:", territories, "quarters:", quarters)
    const ni = new Map(NOCs.map((noc, i) => [noc, i]));
    const yi = new Map(Years.map((year, i) => [year, i]));  
    // console.log("NI:", ni, "yi:", yi)

    const matrix2 = Array.from(ni, () => new Array(Years.length).fill({rank: 0, Medal: 0, next: null}));  
    // console.log("matrix2:", matrix2)
    // var count = 0; 
    for (const {NOC, Year, Medal} of data) {
        var count =  matrix2[ni.get(NOC)][yi.get(Year)]["Medal"];
        if (Medal === "Bronze" || Medal === "Silver" || Medal === "Gold") {
            count += 1
        }
        // if ( Medal === "Gold") {
        //     count += 3
        // }
        // else if (Medal === "Silver") {
        //     count += 2
        // }
        // else if (Medal === "Bronze") {
        //     count += 1
        // }
        // console.log("NOC:", NOC, "Year:", Year, "medals:", Medal)
        // console.log("ni:", ni.get(NOC), "yi:", yi.get(Year))
        matrix2[ni.get(NOC)][yi.get(Year)] = {rank: 0, Medal: count, next: null};
        // console.log("matrix:", matrix2[ni.get(NOC)][yi.get(Year)])
    };    

    matrix2.forEach((d) => {
        for (let i = 0; i<d.length - 1; i++) 
            d[i].next = d[i + 1];
        // console.log("d:", d, d.length)
    });

    Years.forEach((d, i) => {
        const array = [];
        matrix2.forEach((d) => array.push(d[i]));
        array.sort((a, b) => b.Medal - a.Medal);
        let count = 0;
        let index = 0;
        array.forEach((d, j) => {
                return d.rank = j
        });
    })

    var chartData = matrix2

    const len = Years.length - 1;
    const ranking = chartData.map((d, i) => ({NOC: NOCs[i], first: d[0].rank, last: d[len].rank}));
    
    var seq = (start, length) => Array.apply(null, {length: length}).map((d, i) => i + start);
    var color = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(seq(0, ranking.length))

    var left = ranking.sort((a, b) => a.first - b.first).map((d) => d.NOC);

    var right = ranking.sort((a, b) => a.last - b.last).map((d) => d.NOC);

    var width = Years.length * 80
    var height = NOCs.length * 60
    var bumpRadius = 13
    var padding = 25
    var margin = ({left: 105, right: 105, top: 20, bottom: 50})

    const bx = d3.scalePoint()
        .domain(seq(0, Years.length))
        .range([0, width - margin.left - margin.right - padding * 2])

    const by = d3.scalePoint()
        .domain(seq(0, ranking.length))
        .range([margin.top, height - margin.bottom - padding])
    
    const ax = d3.scalePoint()
        .domain(Years)
        .range([margin.left + padding, width - margin.right - padding]);   

    const y = d3.scalePoint()  
        .range([margin.top, height - margin.bottom - padding]);

    const strokeWidth = d3.scaleOrdinal()
        .domain(["default", "transit", "compact"])
        .range([5, bumpRadius * 2 + 2, 2]);

    const title = g => g.append("title")
        .text((d, i) => `${d.NOC} - ${Years[i]}\nRank: ${d.Medal.rank + 1}`)

    const drawAxis = (g, x, y, axis, domain) => {
        g.attr("transform", `translate(${x},${y})`)
            .call(axis)
            .selectAll(".tick text")
            .attr("font-size", "12px");
        
        if (!domain) g.select(".domain").remove();
        }

    // const toCurrency = (num) => d3.format("$,.2f")(num)
    const compact = true;
    d3.select('.vis-BumpChart > *').remove();
    const svg = d3.select('.vis-BumpChart')
        .append('svg')
        .attr("cursor", "default")
        .attr("viewBox", [0, 0, width, height]);
    
    svg.append("g")
        .attr("transform", `translate(${margin.left + padding},0)`)
        .selectAll("path")
        .data(seq(0, Years.length))
        .join("path")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));
    
    const series = svg.selectAll(".series")
        .data(chartData)
        .join("g")
        .attr("class", "series")
        .attr("opacity", 1)
        .attr("fill", d => color(d[0].rank))
        .attr("stroke", d => color(d[0].rank))
        .attr("transform", `translate(${margin.left + padding},0)`)
        .on("mouseover", highlight)
        .on("mouseout", restore);
    
    series.selectAll("path")
        .data(d => d)
        .join("path")
        .attr("stroke-width", strokeWidth("compact"))
        .attr("d", (d, i) => { 
        if (d.next) 
            return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);
        });
    
    const bumps = series.selectAll("g")
        .data((d, i) => d.map(v => ({NOC: NOCs[i], Medal: v, first: d[0].rank})))
        .join("g")
        .attr("transform", (d, i) => `translate(${bx(i)},${by(d.Medal.rank)})`)
        //.call(g => g.append("title").text((d, i) => `${d.territory} - ${quarters[i]}\n${toCurrency(d.profit.profit)}`)); 
        .call(title);
    
    bumps.append("circle").attr("r", compact ? 5 : bumpRadius);
    bumps.append("text")
        .attr("dy", compact ? "-0.75em" : "0.35em")
        .attr("fill", compact ? null : "white")
        .attr("stroke", "none")
        .attr("text-anchor", "middle")    
        .style("font-weight", "bold")
        .style("font-size", "14px")
        .text(d => d.Medal.rank + 1);   
    
    svg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
    const leftY = svg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
    const rightY = svg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right)))); 
    
    return svg.node();
    
    function highlight(e, d) {       
        this.parentNode.appendChild(this);
        series.filter(s => s !== d)
        .transition().duration(500)
        .attr("fill", "#ddd").attr("stroke", "#ddd");
        markTick(leftY, 0);
        markTick(rightY,  Years.length - 1);
        
        function markTick(axis, pos) {
        axis.selectAll(".tick text").filter((s, i) => i === d[pos].rank)
            .transition().duration(500)
            .attr("font-weight", "bold")
            .attr("fill", color(d[0].rank));
        }
    }
    
    function restore() {
        series.transition().duration(500)
        .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));    
        restoreTicks(leftY);
        restoreTicks(rightY);
        
        function restoreTicks(axis) {
        axis.selectAll(".tick text")
            .transition().duration(500)
            .attr("font-weight", "normal").attr("fill", "black");
        }
    }

}

export default draw;