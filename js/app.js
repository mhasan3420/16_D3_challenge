var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper (SVG boilerplate code)
var svg = d3
    .select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// Append SVG group
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Import and parse the data 
d3.csv('data.csv').then(function(CensusData){
    CensusData.forEach(function(data) {
        // data.healthcare = +data.healthcare;
        // data.poverty = +data.poverty;
        data.age = +data.age;
        data.smokes = +data.smokes;
        console.log(data);
    });

    // Create scale
    const xScale = d3.scaleLinear()
        .domain(d3.extent(CensusData, d => d.age))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([6,d3.max(CensusData, d => d.smokes)])
        .range([height, 0]);

    // Create axis 
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Add axes to chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
    chartGroup.append('g').call(yAxis)

    // Create scatter
    chartGroup.selectAll('circle')
        .data(CensusData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.age))
        .attr("cy", d => yScale(d.smokes))
        .attr("r", "15")
        .classed("stateCircle", true)

    // Add x axis label
    chartGroup.append('text')
        .attr('y', ((width / 2)) + 40)
        .attr('x', (height + margin.top))
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text('Age (Median)');    

    // Add y axis label
    chartGroup.append("text")
        .attr('y', 0 - ((margin.left / 2) + 15))
        .attr('x', 0 - (height / 2))
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .text('Smokers (%)');

    // Add state labels on each circle
    chartGroup.append('g')
        .selectAll('text')
        .data(CensusData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr('x', d => xScale(d.age))
        .attr('y', d => yScale(d.smokes))
        .classed('.stateText', true)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'central')
        .attr('fill', 'white')
}); 
