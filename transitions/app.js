var minYear = d3.min(birthData, function(d) { 
  return d.year;  
});
var maxYear = d3.max(birthData, function(d) {
  return d.year;
});
var width = 600;
var height = 600;
var barPadding = 10;
var numBars = 12;
var barWidth = width / numBars - barPadding;
var maxBirths = d3.max(birthData, function(d) { 
  return d.births;
});
var yScale = d3.scaleLinear()
               .domain([0, maxBirths])
               .range([height, 0]);

d3.select("input")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear);

d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .selectAll("rect")
  .data(birthData.filter(function(d) {
    return d.year === minYear;
  }))
  .enter()
  .append("rect")
    .attr("width", barWidth)
    .attr("height", function(d) {
      return height - yScale(d.births);
    })
    .attr("y", function(d) {
      return yScale(d.births);
    })
    .attr("x", function(d,i) {
      return (barWidth + barPadding) * i;
    })
    .attr("fill", "purple");



d3.select("svg")
    .append("text")
    .classed('title',true)
    .text("birth data in " + minYear)
    .attr('x',width / 2)
    .attr('y',30)
    .style('text-anchor','middle')
    .style('font-size','2em');
d3.select("input")
    .on("input", function() {
      var year = +d3.event.target.value;
      d3.selectAll("rect")
        .data(birthData.filter(function(d) {
          return d.year === year;
        })).transition()
          .ease(d3.easeLinear)
          .delay((d,i) => i * 250)
          .on('start',function (d,i) {
              if (i === 0){
                  d3.select('.title')
                      .text("Updating to" + year + "data...");
              }

          })
          .on('end',function (d,i,nodes) {
              if(i === nodes.length - 1){
                  d3.select('.title').text("Birth data in " + year);
              }

          })
          .on('interrupt',function () {
              console.log("Interrupted!! No longer updating to " + year + "data...")

          })
          .attr("height", function(d) {
            return height - yScale(d.births);
          })
          .attr("y", function(d) {
            return yScale(d.births);
          });
    });