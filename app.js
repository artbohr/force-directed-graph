const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
const width = 1150;
const height = 700;

const svg = d3.select(".container").append("svg").attr("height", height).attr("width", width);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(50))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("y", d3.forceY(1))
    .force("x", d3.forceX(1));

d3.json(URL).get((error, data)=>{
  if(error) throw error;

  const link = svg.append("g")
      .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line");

  const node = d3.select('.flags').selectAll('img')
        .data(data.nodes)
        .enter().append("img")
          .attr("class", d => `flag flag-${d.code}`)
            .on("mouseover", function() {
            tooltip.style("visibility", "visible");
            })
            .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function(d) {
            tooltip.select("text").text(`${d.country}`);
            })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));


  const tooltip = svg.append("g").attr("class","tooltip").style("visibility", "hidden");
  tooltip.append("text").attr("x","320").attr("y","80");

  simulation
      .nodes(data.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(data.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .style("left", function(d) { return d.x+"px"; })
        .style("top", function(d) { return d.y+"px"; });
  }

});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
