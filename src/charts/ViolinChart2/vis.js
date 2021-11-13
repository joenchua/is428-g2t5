import * as d3 from 'd3';

const draw = (props) => {
    let data = props;

    // set graph dimensions
    const margin = {top: 30, right: 30, bottom: 80, left: 40},
        width = 750 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // if empty data, prompt user for data
    if (props.length === 0) {
        d3.selectAll(".vis-ViolinChart2 > *").remove();

        var svg = d3.select(".vis-ViolinChart2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 95)
            .attr("y", 230)
            .text("Please select (a) sport(s)!")
            .attr("font-size", "40")
            .attr("text-anchor", "start")
    } else {
        // if not empty, re-draw graph
        d3.selectAll(".vis-ViolinChart2 > *").remove(); // select css
        //
        // console.log("now here");
        // console.log(props);

        let allDataTemp = data;
        data = [];
        // console.log(allDataTemp)

        // data processing
        for (let i = 0; i < allDataTemp.length; i++) {
            data.push
            ({
                id: allDataTemp[i].ID,
                name: allDataTemp[i].Name,
                sex: allDataTemp[i].Sex,
                age: allDataTemp[i].Age,
                height: allDataTemp[i].Height,
                weight: allDataTemp[i].Weight,
                team: allDataTemp[i].Team,
                noc: allDataTemp[i].NOC,
                games: allDataTemp[i].Games,
                year: allDataTemp[i].Year,
                season: allDataTemp[i].Season,
                city: allDataTemp[i].City,
                sport: allDataTemp[i].Sport,
                event: allDataTemp[i].Event,
                medal: allDataTemp[i].Medal,
            })
        }

        // console.log(data);

        // disregard athletes without height parameter
        data = data.filter(function (d) {
            return d.height !== 'NA' && d.sport !== 'Tug-Of-War'
        });

        // numerical representation of medals (will be used for sorting  later on)
        // athletes will be arranged first by their sport and then by their medal count
        // athletes will appear at most once in every sport
        // this prevents double counting of athletes

        data.map(d => {
                if (d.medal === 'NA') {
                    return d.medal = 0
                } else if (d.medal === 'Bronze') {
                    return d.medal = 1
                } else if (d.medal === 'Silver') {
                    return d.medal = 2
                } else if (d.medal === 'Gold') {
                    return d.medal = 3
                }
            }
        );

        // console.log(data);
        // sort the data as mentioned above

        data.sort(function (element_a, element_b) {
            return element_b.medal - element_a.medal;
        });

        data.sort(function (element_a, element_b) {
            return element_a.sport - element_b.sport;
        });

        data.sort(function (element_a, element_b) {
            return element_a.id - element_b.id;
        });
        // console.log(data);


        // output:
        // athlete1 -- sport1 -- gold
        // athlete1 -- sport1 -- silver
        // athlete1 -- sport1 -- n/a
        // athlete1 -- sport2 -- silver
        // athlete2 -- sport1 -- silver

        // ...
        // will become
        // athlete1 -- sport1 -- gold
        // athlete1 -- sport2 -- silver
        // athlete2 -- sport1 -- silver

        // any athlete with "gold medal" is considered a gold medallist no matter he has one or 100000

        var dataPreProc = data;
        data = [];
        data.push(dataPreProc[1]);
        // accounting for the double counting of athletes

        // first run just removes duplicate medals
        for (let i = 1; i < dataPreProc.length; i++) {
            // remove extra medals for the same sport
            if (dataPreProc[i].id === dataPreProc[i - 1].id) {
                if (dataPreProc[i].sport !== dataPreProc[i - 1].sport) {
                    data.push(dataPreProc[i]);
                }
            } else {
                data.push(dataPreProc[i]);
            }
        }

        // console.log(data);


        // create a svg object
        svg = d3.select(".vis-ViolinChart2") // select css
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        // define Y axis
        var y = d3.scaleLinear()
            .domain([0, 200])
            .range([height, 0])

        // this is for drawing the line chart - defining the medal winner sets
        var dataGold;
        var dataSilver;
        var dataBronze;
        var dataNA;

        // filter out athletes who had these achievements
        // this is why it is important to utilise only one medal count for each athlete
        // otherwise there will be double counting involved here

        if (data[0]) {
            dataGold = data.filter(function (d) {
                return d.medal === 3
            });
            dataSilver = data.filter(function (d) {
                return d.medal === 2
            });
            dataBronze = data.filter(function (d) {
                return d.medal === 1
            });
            dataNA = data.filter(function (d) {
                return d.medal === 0
            });


            // declare the histogram (the bins)
            var histogram = d3.bin()
                .domain(y.domain())
                .thresholds(y.ticks(20))
                .value(d => d)

            var sumstat = d3
                .rollup(data, function (d) {
                    let input = d.map(function (g) {
                        return g.weight;
                    })
                    let median = d3.quantile(d.map(function (g) {
                        return g.weight;
                    }).sort(d3.ascending), .5)
                    let bins = histogram(input)   // And compute the binning on it. // create a histogram of all the heights
                    return [bins, median]; // return the median, this helps sort the violin plots in increasing order of median height
                }, d => d.sport);

            // repeat of above
            var sumstatGold = d3
                .rollup(dataGold, function (d) {
                    let input = d.map(function (g) {
                        return g.weight;
                    })
                    let median = d3.quantile(d.map(function (g) {
                        return g.weight;
                    }).sort(d3.ascending), .5)
                    let bins = histogram(input)
                    return [bins, median];
                }, d => d.sport);

            var sumstatSilver = d3
                .rollup(dataSilver, function (d) {
                    let input = d.map(function (g) {
                        return g.weight;
                    })
                    let median = d3.quantile(d.map(function (g) {
                        return g.weight;
                    }).sort(d3.ascending), .5)
                    let bins = histogram(input)
                    return [bins, median];
                }, d => d.sport);

            var sumstatBronze = d3
                .rollup(dataBronze, function (d) {
                    let input = d.map(function (g) {
                        return g.weight;
                    })    // Keep the variable called height
                    let median = d3.quantile(d.map(function (g) {
                        return g.weight;
                    }).sort(d3.ascending), .5)
                    let bins = histogram(input)
                    return [bins, median];
                }, d => d.sport);

            var sumstatNA = d3
                .rollup(dataNA, function (d) {
                    let input = d.map(function (g) {
                        return g.weight;
                    })
                    let median = d3.quantile(d.map(function (g) {
                        return g.weight;
                    }).sort(d3.ascending), .5)
                    let bins = histogram(input)   // And compute the binning on it.
                    return [bins, median];
                }, d => d.sport);

            // https://stackoverflow.com/questions/56795743/how-to-convert-map-to-array-of-object/56795800
            // convert map to array
            let sumstatArray = Array.from(sumstat, ([key, value]) => ({key, value}));
            sumstatArray = sumstatArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

            let sumstatGoldArray = Array.from(sumstatGold, ([key, value]) => ({key, value}));
            sumstatGoldArray = sumstatGoldArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

            let sumstatSilverArray = Array.from(sumstatSilver, ([key, value]) => ({key, value}));
            sumstatSilverArray = sumstatSilverArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

            let sumstatBronzeArray = Array.from(sumstatBronze, ([key, value]) => ({key, value}));
            sumstatBronzeArray = sumstatBronzeArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

            let sumstatNAArray = Array.from(sumstatNA, ([key, value]) => ({key, value}));
            sumstatNAArray = sumstatNAArray.sort((a, b) => (a.value[1] > b.value[1] ? 1 : -1));

            // find the width of the histogram for each data, same for the belo
            var maxNum = 0
            for (let i = 0; i < sumstatArray.length; i++) {
                let allBins = sumstatArray[i].value[0]
                let lengths = allBins.map(function (a) {
                    return a.length;
                })
                let longuest = d3.max(lengths)
                if (longuest > maxNum) {
                    maxNum = longuest
                }
            }

            // create x axis
            let totalSport2 = sumstatArray.map(x => x.key);

            // x axis scale
            var x = d3.scaleBand()
                .range([0, width])
                .domain(totalSport2)
                .paddingInner(1)
                .paddingOuter(.5);

            // append axes and axes labels
            svg.append("g")
                .attr("id", "yAxis")
                // .style("font-size", 30)
                .call(d3.axisLeft(y))
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", 700)
                .attr("y", 428)
                .text("Sport");
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", -38)
                .attr("y", -11)
                .text("Weight (in kg)")
                .attr("text-anchor", "start")


            svg.append("g")
                .attr("id", "xAxis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .style("text-anchor", "center")
                .attr("dx", "0em")
                .attr("dy", ".90em")
                .attr("transform", "translate(100,0)")
                .attr("transform", "rotate(0)");


            var xNum = d3.scaleLinear()
                .range([0, 100])
                .domain([-3000, 3000])

            // used for labels later
            function findSport(d) {
                for (let i = 0; i < sumstatArray.length; i++) {
                    if (d === sumstatArray[i].value[0]) {
                        return i; // return the index of the sport
                    }
                }
            }


            // Add the shape to this svg!
            svg
                .selectAll("myViolin")
                .data(sumstatArray)
                .join(
                    function (enter) {
                        return enter.append("g")
                            .attr("transform", function (d) {
                                let translateAmount = x(d.key) - 50;
                                return ("translate(" + translateAmount + " ,0)")
                            })
                            .attr("id", "violins")
                            .append("path")
                            .datum(function (d) {
                                return (d.value[0])
                            })
                            .style("stroke", "none")
                            .style("stroke-width", "1px")
                            .style("opacity", 1)
                            .style("fill", "#008ecc")
                            .transition().duration(1000)
                            //
                            .attr("d", d3.area()
                                .x0(function (d) {
                                    // cons
                                    // console.log(d.length);
                                    // console.log(xNum(-d.length));
                                    return (xNum(-d.length))
                                })
                                .x1(function (d) {
                                    return (xNum(d.length))
                                })
                                .y(function (d) {
                                    // console.log(d.x0);
                                    // console.log(y(d.x0));
                                    return (y(d.x0))
                                })
                                .curve(d3.curveCatmullRom)    // makes line smoother

                            )
                    },
                    function (update) {
                        return update.attr("d", d3.area()

                            .x0(function (d) {
                                // cons
                                // console.log(d.length);
                                // console.log(xNum(-d.length));
                                return (xNum(-d.length))
                            })
                            .x1(function (d) {
                                return (xNum(d.length))
                            })
                            .y(function (d) {
                                // console.log(d.x0);
                                // console.log(y(d.x0));
                                return (y(d.x0))
                            })
                            .curve(d3.curveCatmullRom)
                        )
                            .transition().duration(1000)
                    },

                    function (exit) {
                        return exit
                            .call(exit => exit
                                .remove())
                    }
                )
                .on('click', function (d) {
                    d3.select(this)
                        .style("fill", "#000080")

                    drawSubChart(props, d, sumstatArray, sumstatGoldArray, sumstatSilverArray, sumstatBronzeArray, sumstatNAArray);
                    // svg.selectAll('')
                })
                .on("mouseover", function (event, d) {
                    d3.select(this)
                        .style("fill", "#000080")
                })
                .on("mouseout", function (event, d) {
                    d3.select(this)
                        .style("fill", "#008ecc")
                })
                .append("title") // add text to the label
                .text(function (d) {
                        const sport = findSport(d)
                        let tempLength = 0
                        for (let i = 0; i < sumstatArray[sport].value[0].length; i++) {
                            tempLength += sumstatArray[sport].value[0][i].length
                        }

                        return "Sport: " + sumstatArray[sport].key + "\nMedian Height: " + sumstatArray[sport].value[1] + " cm" +
                            "\nUnique Athletes: " + tempLength;
                    }
                )
            ;
        }

    }
}

// this is for the line chart
function drawSubChart(props, d, sumstatArray, sumstatGoldArray, sumstatSilverArray, sumstatBronzeArray, sumstatNAArray) {

    // x axis is fixed
    const xAxisVal = [0, 10, 20, 30, 40, 50, 60, 70, 80,90,  100, 110, 120,130, 140,150, 160,170, 180, 190,200]

    const margin = {top: 30, right: 30, bottom: 80, left: 40},
        width = 730 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // because we take the entire dataset that's used to draw the violin plot
    // so we need to know which sport the user has clicked on
    function findSport() {
        for (let i = 0; i < sumstatArray.length; i++) {
            if (d.target.__data__ === sumstatArray[i].value[0]) {
                return i; // return the index of the sport
            }
        }
    }

    // convert number of athletes to percentage
    function makeGraphDetails(histoData, xAxisVal) {
        // first count the total number of athletes in each bin
        let numberOfAthletes = 0;
        for (let i = 0; i < histoData.length; i++) {
            numberOfAthletes += histoData[i].length
        }
        // then find the percentage
        let playerDict = []
        for (let i = 0; i < histoData.length; i++) {
            playerDict.push({
                key: xAxisVal[i],
                value: histoData[i].length / numberOfAthletes
            })
        }
        return playerDict
    }

    // this is used to find the maximum percentage of height among all medal winners
    // in order to draw the upper boundary of the Y axis
    function findMaxAmongAll(achievementCategory) {
        var currMax = achievementCategory[0].value
        for (let i = 0; i < achievementCategory.length; i++) {
            if (achievementCategory[i].value > currMax) {
                currMax = achievementCategory[i].value
            }
        }
        return currMax;
    }

    const chosenSport = findSport()

    // array of athletes' heights which fit the criteria
    const goldMedal = makeGraphDetails(sumstatGoldArray[chosenSport].value[0], xAxisVal);
    const silverMedal = makeGraphDetails(sumstatSilverArray[chosenSport].value[0], xAxisVal);
    const bronzeMedal = makeGraphDetails(sumstatBronzeArray[chosenSport].value[0], xAxisVal);
    const noMedal = makeGraphDetails(sumstatNAArray[chosenSport].value[0], xAxisVal);
    //
    // console.log(goldMedal);
    // console.log(silverMedal);
    // console.log(bronzeMedal);
    // console.log(noMedal);


    let maxValues = Math.max(findMaxAmongAll(goldMedal), findMaxAmongAll(silverMedal), findMaxAmongAll(bronzeMedal), findMaxAmongAll(noMedal));

    // select the chart from subchart.js
    var svg = d3.select(".vis-subPhysicalChart2")

    // define the Y ad X scales
    var y = d3.scaleLinear()
        .domain([0, Math.max(maxValues)])
        .range([height, 0])

    var x = d3.scaleLinear()
        .domain([0, 200])
        .range([0, width])

    // Gold medallists
    svg.selectAll("#goldLine").data(goldMedal)
        .join(
            function (enter) {
                return enter.datum(goldMedal)
                    .append("path")
                    .attr("id", "goldLine")
                    .attr('fill', 'rgba(255,255,255,0)') // no fill
                    .attr("stroke", "rgba(255,215,0,1)")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) { // for a change of data
                return update.datum(goldMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(255,255,255,0)')
                    .attr("stroke", "rgba(255,215,0,1)")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX)) // smoothen the curve, circles are used to maintain accuracy of datapoints

            },
        )


    // Silver Medallists
    svg.selectAll("#silverLine").data(silverMedal)
        .join(
            function (enter) {
                return enter.datum(silverMedal)
                    .append("path")
                    .attr("id", "silverLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(silverMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", "#777777")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        );

    // BRONZE MEDALLISTS
    svg.selectAll("#bronzeLine").data(bronzeMedal)
        .join(
            function (enter) {
                return enter.datum(bronzeMedal)
                    .append("path")
                    .attr("id", "bronzeLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "#CD7F32")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(bronzeMedal)
                    .transition().duration(1000)

                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", "#CD7F32")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )

    // all other athletes
    svg.selectAll("#naLine").data(noMedal)
        .join(
            function (enter) {
                return enter.datum(noMedal)
                    .append("path")
                    .attr("id", "naLine")
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("stroke", "rgb(220, 220, 220)")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)

                        })
                        .curve(d3.curveBumpX))

                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.datum(noMedal)
                    .transition().duration(1000)
                    .attr('fill', 'rgba(0,0,0,0)')
                    .attr("stroke", 'rgb(220, 220, 220)')
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function (d) {
                            return x(d.key)
                        })
                        .y(function (d) {
                            return y(d.value)
                        })
                        .curve(d3.curveBumpX))

            },
        )


    svg.selectAll("#naCircle").data(noMedal)
        .join(
            function (enter) {
                return enter.data(noMedal)
                    .append("circle")
                    .attr("id", "naCircle")
                    .attr("r", 6)
                    .attr("fill", "#999999")
                    .attr("fill-opacity", "0.5")
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.data(noMedal)
                    .transition().duration(1000)
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .select("title")
                    .text(function (d) {
                            return "Athletes without medals\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
                        }
                    )

            },
            function (exit) {
                return exit
                    .call(exit => exit
                        .remove())
            }
        )
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", "3px")
                .style("opacity", 1)

        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", "3px")
                .style("opacity", 1)
        })
        .append("title")
        .text(function (d) {
                return "Athletes without medals\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
            }
        )

    ;

    svg.selectAll("#goldCircle").data(goldMedal)
        .join(
            function (enter) {
                return enter.data(goldMedal)
                    .append("circle")
                    .attr("id", "goldCircle")
                    .attr("r", 6)
                    .attr("fill", "#999999")
                    .attr("fill-opacity", "0.5")
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.data(goldMedal)
                    .transition().duration(1000)
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .select("title")
                    .text(function (d) {
                            return "Gold Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
                        }
                    )

            },
            function (exit) {
                return exit
                    .call(exit => exit
                        .remove())
            }
        )
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", "3px")
                .style("opacity", 1)

        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", "3px")
                .style("opacity", 1)
        })
        .append("title")
        .text(function (d) {
                return "Gold Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
            }
        )
    ;

    svg.selectAll("#silverCircle").data(silverMedal)
        .join(
            function (enter) {
                return enter.data(silverMedal)
                    .append("circle")
                    .attr("id", "silverCircle")
                    .attr("r", 6)
                    .attr("fill", "#999999")
                    .attr("fill-opacity", "0.5")
                    .attr("cx", function (d) {

                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.data(silverMedal)
                    .transition().duration(1000)
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .select("title")
                    .text(function (d) {
                            return "Silver Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
                        }
                    )

            },
            function (exit) {
                return exit
                    .call(exit => exit
                        .remove())
            }
        )
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", "3px")
                .style("opacity", 1)

        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", "3px")
                .style("opacity", 1)
        })
        .append("title")
        .text(function (d) {
                return "Silver Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
            }
        )
    ;

    svg.selectAll("#bronzeCircle").data(bronzeMedal)
        .join(
            function (enter) {
                return enter.data(bronzeMedal)
                    .append("circle")
                    .attr("id", "bronzeCircle")
                    .attr("r", 6)
                    .attr("fill", "#999999")
                    .attr("fill-opacity", "0.5")
                    .attr("cx", function (d) {

                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .attr("transform", "translate(50,30)")
                    .transition().duration(1000)
            },
            function (update) {
                return update.data(bronzeMedal)
                    .transition().duration(1000)
                    .attr("cx", function (d) {
                        return x(d.key);
                    })
                    .attr("cy", function (d) {
                        return y(d.value);
                    })
                    .select("title")
                    .text(function (d) {
                            return "Bronze Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
                        }
                    )

            },
            function (exit) {
                return exit
                    .call(exit => exit
                        .remove())
            }
        )
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", "3px")
                .style("opacity", 1)

        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", "3px")
                .style("opacity", 1)
        })
        .append("title")
        .text(function (d) {
                return "Bronze Medallists\nHeight: " + d.key + " cm\nPercentage Athletes: " + (d.value * 100).toFixed(2) + "%";
            }
        )
    ;


// smooth axes transition
    svg.select(".yaxis")
        .transition().duration(1000)

        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")))

    svg.select(".xaxis")
        .transition().duration(1000)

        .call(d3.axisBottom(x))

}


// find javacsript key by value
// https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
// https://www.d3-graph-gallery.com/graph/line_basic.html
// https://stackoverflow.com/questions/49319648/remove-outline-along-the-axes-in-d3-js-area-chart
// https://stackoverflow.com/questions/58322806/d3-join-enter-called-instead-of-update
// https://stackoverflow.com/questions/25146333/update-second-chart-on-mouseover
// https://stackoverflow.com/questions/63416477/d3-js-getting-x-axis-to-transition-smoothly-in-a-time-series-graph-for-each-sec

// https://bl.ocks.org/bumbeishvili/63841a5dcf018b902457fa80d5c5d83e
// https://stackoverflow.com/questions/56795743/how-to-convert-map-to-array-of-object/56795800

// https://www.d3-graph-gallery.com/graph/violin_basicHist.html
export default draw;
