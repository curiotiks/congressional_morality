const width = 800;
const height = 400;
const radius = 300;
const svg = d3.select("svg");
const tooltip = d3.select(".tooltip");

let fullData = [];

d3.json("table2_ethics_violations.json").then(data => {
  fullData = data;
  drawDots(data);
});

function filterData(category) {
  let filtered = category === "All" ? fullData : fullData.filter(d => d.category === category);
  drawDots(filtered);
}

function drawDots(data) {
  svg.selectAll("circle").remove();

  const dems = data.filter(d => d.party === "D");
  const reps = data.filter(r => r.party === "R");

  const demArc = Math.PI; // 180°
  const repArc = Math.PI;

  const angleStepDem = demArc / (dems.length + 1);
  const angleStepRep = repArc / (reps.length + 1);

  // Draw Democrats on the LEFT
  svg.selectAll(".dot.dem")
    .data(dems)
    .enter()
    .append("circle")
    .attr("class", "dot dem")
    .attr("r", 6)
    .attr("fill", "blue")
    .attr("cx", (d, i) => {
      const angle = Math.PI + (i + 1) * angleStepDem;
      return width / 2 + radius * Math.cos(angle);
    })
    .attr("cy", (d, i) => {
      const angle = Math.PI + (i + 1) * angleStepDem;
      return height / 1.1 + radius * Math.sin(angle);
    })
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  // Draw Republicans on the RIGHT
  svg.selectAll(".dot.rep")
    .data(reps)
    .enter()
    .append("circle")
    .attr("class", "dot rep")
    .attr("r", 6)
    .attr("fill", "red")
    .attr("cx", (d, i) => {
      const angle = -Math.PI + (i + 1) * angleStepRep;
      return width / 2 + radius * Math.cos(angle);
    })
    .attr("cy", (d, i) => {
      const angle = -Math.PI + (i + 1) * angleStepRep;
      return height / 1.1 + radius * Math.sin(angle);
    })
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);
}

function showTooltip(event, d) {
  tooltip
    .style("left", event.pageX + 10 + "px")
    .style("top", event.pageY - 30 + "px")
    .style("display", "block")
    .html(`<strong>${d.name} (${d.party}-${d.state})</strong><br>
           ${d.office}, ${d.year}<br>
           <em>${d.category}</em><br>
           ${d.allegations}<br>
           <small>${d.status}</small>`);
}

function hideTooltip() {
  tooltip.style("display", "none");
}
