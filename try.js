var margins = {
    top: 12,
    left: 48,
    right: 24,
    bottom: 24
  },
  legendPanel = {
    width: 180
  },
  width = 500 - margins.left - margins.right - legendPanel.width,
  height = 100 - margins.top - margins.bottom,
  dataset = [{
      data: [{
        month: 'Valence',
        count: 1
      }, {
        month: 'Arousal',
        count: 0.0
      }],
      name: 'Positive'
    }, {
      data: [{
        month: 'Valence',
        count: 0.0
      }, {
        month: 'Arousal',
        count: 0.6
      }],
      name: 'Negative'
    }
              ];

var levels = dataset.map(function (d) {
  return d.name;
});

var dataset = dataset.map(function (d) {
  return d.data.map(function (o, i) {
    // Structure it so that your numeric
    // axis (the stacked amount) is y
    return {
      y: o.count,
      x: o.month
    };
  });
});



var stack = d3.layout.stack();

stack(dataset);

var dataset = dataset.map(function (group) {
  return group.map(function (d) {
    // Invert the x and y values, and y0 becomes x0
    return {
      x: d.y,
      y: d.x,
      x0: d.y0
    };
  });
});

console.log('== dataset', dataset)

setInterval(function () {
  dataset[0][0].x = Math.random();
  $scope.$apply()
  console.log($scope)
}, 100)

var percent = d3.format('%');

var svg = d3.select('#chart_reflection')
  .append('svg')
  .attr('width', width + margins.left + margins.right + legendPanel.width)
  .attr('height', height + margins.top + margins.bottom)
  .append('g')
  .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

var xScale = d3.scale.linear()
  .domain([0, 1])
  .range([0, width]);

var months = dataset[0].map(function (d) {
  return d.y;
});


var yScale = d3.scale.ordinal()
  .domain(months)
  .rangeRoundBands([0, height], .1);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .tickFormat(percent);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient('left');

var colours = d3.scale.category10();

var groups = svg.selectAll('g')
  .data(dataset)
  .enter()
  .append('g')
  .style('fill', function (d, i) {
    return colours(i);
  });


var rects = groups.selectAll('rect')
  .data(function (d) {
    return d;
  })
  .enter()
  .append('rect')
  .attr('x', function (d) {
    return xScale(d.x0);
  })
  .attr('y', function (d, i) {
    return yScale(d.y);
  })
  .attr('height', function (d) {
    return yScale.rangeBand();
  })
  .attr('width', function (d) {
    return xScale(d.x);
  })


svg.append('g')
  .attr('class', 'axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);

svg.append('g')
  .attr('class', 'axis')
  .call(yAxis);

svg.append('rect')
  .attr('fill', 'yellow')
  .attr('width', 160)
  .attr('height', 30 * dataset.length)
  .attr('x', width + margins.left)
  .attr('y', 0);

levels.forEach(function (s, i) {
  svg.append('text')
    .attr('fill', 'black')
    .attr('x', width + margins.left + 8)
    .attr('y', i * 24 + 24)
    .text(s);
  svg.append('rect')
    .attr('fill', colours(i))
    .attr('width', 60)
    .attr('height', 20)
    .attr('x', width + margins.left + 90)
    .attr('y', i * 24 + 6);
});
