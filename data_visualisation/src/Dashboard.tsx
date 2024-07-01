import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import './App.css';

interface NumCandidates {
    total: number;
    notVisited: number;
    notAttempted: number;
    attempting: number;
    cheatingDetectedFail: number;
    cheatingDetectedPass: number;
    failed: number;
    passed: number;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<NumCandidates>({
        total: 0,
        notVisited: 0,
        notAttempted: 0,
        attempting: 0,
        cheatingDetectedFail: 0,
        cheatingDetectedPass: 0,
        failed: 0,
        passed: 0
    });

    const [fiveNumberSummary, setFiveNumberSummary] = useState(null);

    const handleClick = () => {

        const newData: NumCandidates = {
            total: 100,
            notVisited: 10,
            notAttempted: 20,
            attempting: 30,
            failed: 16,
            passed: 24,
            cheatingDetectedFail: 10,
            cheatingDetectedPass: 5,
        };
        setData(newData);

        const newSummary = {
            mean: 50,
            stdDev: 15,
            lowest: 20,
            lowerQuartile: 40,
            median: 53,
            upperQuartile: 76,
            highest: 85
        };
        setFiveNumberSummary(newSummary);

    };

    useEffect(() => {
        if (data.total > 0) {
            const hierarchyData = {
                name: "Total",
                children: [
                    { name: "NVD", value: data.notVisited },
                    { name: "NAT", value: data.notAttempted },
                    { name: "ATG", value: data.attempting },
                    {
                        name: "PSD",
                        children: [
                            { name: "CDP", value: data.cheatingDetectedPass },
                            { name: "NCP", value: data.passed - data.cheatingDetectedPass }
                        ]
                    },
                    {
                        name: "FLD",
                        children: [
                            { name: "CDF", value: data.cheatingDetectedFail },
                            { name: "NCF", value: data.failed - data.cheatingDetectedFail }
                        ]
                    }
                ]
            };

            const width = 500;
            const radius = width / 2;
            const color = d3.scaleOrdinal(d3.schemeCategory10);

            const svg = d3.select("#chart")
                .attr("width", width)
                .attr("height", width)
                .append("g")
                .attr("transform", `translate(${radius},${radius})`);

            const partition = d3.partition()
                .size([2 * Math.PI, radius]);

            const root = d3.hierarchy(hierarchyData)
                .sum(d => (d as any).value);

            partition(root);

            const arc = d3.arc<d3.HierarchyRectangularNode<{}>>()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .innerRadius(d => d.depth === 1 ? radius / 3 : radius / 3)
                .outerRadius(d => d.depth === 1 ? radius : radius * 2 / 3);

            svg.selectAll("path")
                .data(root.descendants().filter(d => d.depth))
                .enter()
                .append("path")
                .attr("d", arc as any)
                .style("fill", d => color(d.data.name))
                .append("title")
                .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${(d as any).value}`);

            svg.selectAll("text")
                .data(root.descendants().filter(d => d.depth))
                .enter()
                .append("text")
                .attr("transform", d => {
                    const [x, y] = arc.centroid(d as any);
                    const angle = ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90;
                    const rotate = angle > 90 || angle < -90 ? 180 : 0;
                    return `translate(${x},${y}) rotate(${angle + rotate})`;
                })
                .attr("dx", d => (d.depth === 1 ? "-1em" : "-0.5em"))
                .attr("dy", ".5em")
                .attr("text-anchor", "middle")
                .text(d => d.data.name)
                .style("font-size", d => (d.depth === 1 ? "14px" : "12px"));
        }
    }, [data]);

    useEffect(() => {
        if (fiveNumberSummary) {
            d3.select("#box-plot").selectAll("*").remove();

            const margin = { top: 10, right: 30, bottom: 30, left: 40 };
            const width = 400 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select("#box-plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const data = [
                fiveNumberSummary.lowest,
                fiveNumberSummary.lowerQuartile,
                fiveNumberSummary.median,
                fiveNumberSummary.upperQuartile,
                fiveNumberSummary.highest
            ];

            const y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);

            const yAxis = d3.axisLeft(y).tickSize(5).tickPadding(10);

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(["BoxPlot"]);

            const xAxis = d3.axisBottom(x);

            svg.append("g")
                .call(yAxis)
                .selectAll("line")
                .style("stroke", "black");

            svg.append("g")
                .call(yAxis)
                .selectAll("path")
                .style("stroke", "black");

            svg.append("g")
                .call(yAxis)
                .selectAll("text")
                .style("fill", "black");

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("line")
                .style("stroke", "black");

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("path")
                .style("stroke", "black");

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("fill", "black");


            const center = width / 2;
            const boxWidth = 100;

            // Show the main vertical line
            svg.append("line")
                .attr("x1", center)
                .attr("x2", center)
                .attr("y1", y(data[0]))
                .attr("y2", y(data[4]))
                .attr("stroke", "black");

            // Show the box
            svg.append("rect")
                .attr("x", center - boxWidth / 2)
                .attr("y", y(data[3]))
                .attr("height", y(data[1]) - y(data[3]))
                .attr("width", boxWidth)
                .attr("stroke", "black")
                .style("fill", "#69b3a2");

            // Show median, min and max horizontal lines
            svg.selectAll("toto")
                .data([data[0], data[2], data[4]])
                .enter()
                .append("line")
                .attr("x1", center - boxWidth / 2)
                .attr("x2", center + boxWidth / 2)
                .attr("y1", d => y(d))
                .attr("y2", d => y(d))
                .attr("stroke", "black");
        }
    }, [fiveNumberSummary]);


    return (
        <div className="app-container">
            <main className="main-content">
                <button className="render-button" onClick={handleClick}>Render Data</button>
                <div id="chart-container">
                    <svg id="chart"></svg>
                </div>
                <div>
                    <svg id="box-plot"></svg>
                </div>
            </main>
        </div>
    );

};

export default Dashboard;
