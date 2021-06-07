import * as d3 from "d3";
import styles from "./forceGraph.module.css";
import {
  createContextMenu
} from "./utils";

const ForceGraphGenerator = (
  container,
  linksData,
  nodesData,
  nodeHoverTooltip,
  userNodeClicked,
  openDialog
) => {
  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const dragInteraction = d3.drag().on("drag", (event, node) => {
    node.fx = event.x;
    node.fy = event.y;
    simulation.alpha(1);
    simulation.restart();
  });

  const menuItems = [{
    title: "Feedback",
    action: function (e) {
      openDialog(e);
      console.log(linksData)
      //console.log(e)
    }
  }];

  // Add the tooltip element to the graph
  const tooltip = document.querySelector("#graph-tooltip");
  if (!tooltip) {
    const tooltipDiv = document.createElement("div");
    tooltipDiv.classList.add(styles.tooltip);
    tooltipDiv.style.opacity = "0";
    tooltipDiv.id = "graph-tooltip";
    document.body.appendChild(tooltipDiv);
  }
  const div = d3.select("#graph-tooltip");

  const addTooltip = (hoverTooltip, d, x, y) => {
    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(hoverTooltip(d))
      .style("left", `${x}px`)
      .style("top", `${y - 28}px`);
  };

  const removeTooltip = () => {
    div.transition().duration(200).style("opacity", 0);
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
      .forceLink(links)
      .id((d) => d.name)
      .distance((d) => 100)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("id", "graphSvg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(
      d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
      })
    );

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));


  link
    .on("click", (event) => {
      //   console.log(event.target.innerHTML);
      alert("what")
    });
  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .on("contextmenu", (event, d) => {
      createContextMenu(event, d, menuItems, width, height, "#graphSvg");
    })
    .attr("r", 12)
    .attr("fill", function (d) {
      return color(d.group);
    })

    // .call(drag(simulation));
    .call(dragInteraction);

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .on("contextmenu", (event, d) => {
      createContextMenu(event, d, menuItems, width, height, "#graphSvg");
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text(function (d) {
      return d.name;
    })
    .style("font-size", "8px")
    // .call(drag(simulation));
    .call(dragInteraction);

  label
    .on("mouseover", (event, d) => {
      addTooltip(nodeHoverTooltip, d, event.pageX, event.pageY);
    })
    .on("mouseout", () => {
      removeTooltip();
    })
    .on("click", (event) => {
      //   console.log(event.target.innerHTML);
      userNodeClicked(event.target.innerHTML);
    });

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

  return {
    destroy: () => {
      simulation.stop();
    },
    nodes: () => {
      return svg.node();
    },
  };
};

export default ForceGraphGenerator;