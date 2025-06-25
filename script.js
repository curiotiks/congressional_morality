const width = 800;
const height = 400;
const radius = 300;

const cx = width  / 2;      // horizontal centre
const cy = height - 20;     // put full circle’s centre 20 px above the bottom

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
  svg.selectAll(".dot").remove();

  const dems = data.filter(d => d.party === "D");
  const reps = data.filter(r => r.party === "R");

  /* ---  NEW ANGLE RANGES  --------------------------------------------
     π   (180°)  ← leftmost
     π/2 ( 90°)  ← top-center
       0 (  0°)  ← rightmost
     Democrats will sit from π   → π/2  (left half, 90° span)
     Republicans will sit from π/2 → 0  (right half, 90° span)
  ---------------------------------------------------------------------*/

  const startDem = 0;        // 180°
  const endDem   = Math.PI / 2;    //  90°
  const startRep = Math.PI / 2;    //  90°
  const endRep   = Math.PI;              //   0°

  const stepDem  = (endDem - startDem) / (dems.length + 1); // negative
  const stepRep  = (endRep - startRep) / (reps.length + 1); // negative

  // 🔵 Democrats (LEFT 90°)
  svg.selectAll(".dot.dem")
    .data(dems)
    .enter().append("circle")
      .attr("class", "dot dem")
      .attr("r", 6)
      .attr("fill", "blue")
      .attr("cx", (d, i) => {
        const a = startDem + (i + 1) * stepDem;
        return width / 2 + radius * Math.cos(a);
      })
      .attr("cy", (d, i) => {
        const a = startDem + (i + 1) * stepDem;
        return height / 1.5 + radius * Math.sin(a);   // adjust 1.2 to lift/lower arch
      })
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip);

  // 🔴 Republicans (RIGHT 90°)
  svg.selectAll(".dot.rep")
    .data(reps)
    .enter().append("circle")
      .attr("class", "dot rep")
      .attr("r", 6)
      .attr("fill", "red")
      .attr("cx", (d, i) => {
        const a = startRep + (i + 1) * stepRep;
        return width / 2 + radius * Math.cos(a);
      })
      .attr("cy", (d, i) => {
        const a = startRep + (i + 1) * stepRep;
        return height / 1.2 + radius * Math.sin(a);
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
