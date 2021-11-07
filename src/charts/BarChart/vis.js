import * as d3 from 'd3';

const draw = (props) => {
    const allData = props.data;

    const allMedals = d3.rollup(
        allData,
        d => d.length, // reducerFn
        d => d.NOC,
        d => d.Medal // keyToGroupBy
    )

    var teamMedals = [];

    for (var country of allMedals) {

        var team = {}
        team.label = country[0]
        let medals = country[1]

        var medalsCount = [];
        for (var medal of medals) {

            if (medal[0] !== 'NA') {
                medalsCount.push(medal[1])
            }
        }
        team.values = medalsCount;
        teamMedals.push(team)
    }
    teamMedals.sort(function (a, b) {
        return b.values[0] - a.values[0]
    });

    console.log(teamMedals)

    let myseries = teamMedals.slice(0, 5);

    let myLabel = [];
    let ranking = ['Gold', 'Silver', 'Bronze'];

    for (country of myseries) {
        myLabel.push(country.label);
    }

    var data = Object.assign({
        series: myseries,
        labels: myLabel,
        ranking: ['Gold', 'Silver', 'Bronze']
    })

    var chartWidth = 400,
        barHeight = 20,
        groupHeight = barHeight * data.series.length,
        gapBetweenGroups = 20,
        spaceForLabels = 70;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];

    for (var i = 0; i < data.series.length; i++) {
        for (var j = 0; j < data.series[i].values.length; j++) {
            zippedData.push(data.series[i].values[j]);
        }
    }

    // Color scale
    var color = d3.scaleOrdinal()
        .domain(data.ranking)
        .range(['#FFD700', '#C0C0C0', '#CD7F32'])
    // var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;
    var chartHeight = 430;

    var x = d3.scaleLinear()
        .domain([0, d3.max(zippedData) + 30])
        .range([0, chartWidth+100]);

    var y = d3.scaleLinear()
        .range([410,0]);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat('')
        .tickSize(0)

    // Specify the chart area and dimensions
    var chart = d3.select(".vis-barchart")
        .append("svg")
        .attr("width", 900)
        .attr("height", chartHeight);
    
    var divTooltip = chart
        .append("div")
        .attr("class", "toolTip");
    // Create bars
    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series[0].values.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function (d, i) {
            return color(i % myseries[0].values.length);
        })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1)
        .attr("rx", 5)


    // Add text label in bar
    bar.append("text")
        .attr("x", function (d) {
            return x(d) + 10;
        })
        .attr("y", barHeight / 2)
        .attr("fill", "black")
        .attr("dy", ".35em")
        .text(function (d) {
            return d;
        });

    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function (d) {
            return -50;
        })
        .attr("y", groupHeight / 3)
        .attr("dy", ".35em")
        .text(function (d, i) {
            if (i % myseries[0].values.length === 0)
                return data.labels[Math.floor(i / myseries[0].values.length)];
            else
                return ""
        });

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(70,400)")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
        .call(yAxis);

    // Draw legend
    var legendRectSize = 18,
        legendSpacing = 4;

    var legend = chart.selectAll('.legend')
        .data(data.ranking)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups / 2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr("transform", `translate(${chartWidth-230}, -5)`)
        .style('fill', function (d, i) {
            return color(i);
        })
        .style('stroke', function (d, i) {
            return color(i);
        });

    chart.selectAll("mylabels")
        .data(ranking)
        .enter()
        .append('text')
        .attr('x', chartWidth + spaceForLabels + 220)
        .attr('y', function (d, i) {
            return 15 + i * 25
        })
        .text(function (d) {
            return d

        });
}
export default draw;