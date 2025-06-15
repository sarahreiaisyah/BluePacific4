d3.json("data.json").then(function(data) {
  // Aggregate mean OBS_VALUE_WINS by GEO_PICT
  const grouped = Array.from(
    d3.group(data, d => d.GEO_PICT),
    ([key, values]) => ({
      GEO_PICT: key,
      mean_value: d3.mean(values, d => +d.OBS_VALUE_WINS)
    })
  );

  // Set up SVG dimensions
  const width = 800, height = 400;
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Scales
  const x = d3.scaleBand()
    .domain(grouped.map(d => d.GEO_PICT))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(grouped, d => d.mean_value)])
    .nice()
    .range([height - 20, 20]);

  // Bars
  svg.selectAll("rect")
    .data(grouped)
    .enter()
    .append("rect")
    .attr("x", d => x(d.GEO_PICT))
    .attr("y", d => y(d.mean_value))
    .attr("width", x.bandwidth())
    .attr("height", d => height - 20 - y(d.mean_value))
    .attr("fill", "#69b3a2");

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0,${height - 20})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Y Axis
  svg.append("g")
    .attr("transform", `translate(0,0)`)
    .call(d3.axisLeft(y));
});
