// YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper and SVG group for our chart.
var svg = d3.select("#scatter")
  .append("svg")
  .classed("chart", true)
  .attr("width",svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data/data.csv").then(function(riskData) {

    // Parse Data
    riskData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(riskData, d => d.poverty)])
      .range([0,width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(riskData, d => d.healthcare)])
      .range([height, 0]);

    // Axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Axes on chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(riskData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");

    var circletextGroup = chartGroup.selectAll()
      .data(riskData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .style("fill", "black")
      .text(d => (d.abbr));


    // Tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style("background","black")
      .style("color", "white")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`)
      });

    // Chart tooltip
    // ==============================
    chartGroup.call(toolTip);

    // Event listeners for display
    // ==============================
    circlesGroup.on("mouseover", function() {
      d3.select(this)
        .transition()
        .duration(1000)
        .attr("r",20)
        .attr("fill","blue");
    })
      .on("click",function(d) {
        toolTip.show(d,this);
      })

      // mouseout event
      .on("mouseout", function() {
        d3.select(this)
        .transition()
        .duration(1000)
        .attr("r",15)
        .attr("fill","green")
        toolTip.hide()
      });

    // Axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
      .attr("class", "axisText")
      .text("In poverty (%)");
  });
