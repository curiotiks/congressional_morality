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

  const angleStep = Math.PI / data.length;

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", (d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius;
      return width / 2 + r * Math.cos(angle);
    })
    .attr("cy", (d, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = radius;
      return height / 1.1 + r * Math.sin(angle);
    })
    .attr("fill", d => d.party === "R" ? "red" : "blue")
    .on("mouseover", function (event, d) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px")
        .style("display", "block")
        .html(`<strong>${d.name} (${d.party}-${d.state})</strong><br>
               ${d.office}, ${d.year}<br>
               <em>${d.category}</em><br>
               ${d.allegations}<br>
               <small>${d.status}</small>`);
    })
    .on("mouseout", () => tooltip.style("display", "none"));
}
