// Code goes here

var app = angular.module('myApp', ['ng', 'ngResource', 'ngMaterial'])

app.controller('MainCtrl', function ($scope, $log, $http) {

  $log.info("=== ctrl ", $scope.XY)

  $http.get('http://localhost:3000/api/v1/emoselfreported/findAll').then(function successCallback(response) {
    $log.error(response.data);
  }, function errorCallback(error) {
    $log.error(error);
  })

})

// TODO-EMOVIZ documment this code :p
app.directive('moodMapChart', function () {

  function link(scope, el, attrs) {}

  return {
    restricted: 'E',
    link: link,
    controller: function ($scope, $timeout, $log, $mdDialog) {

      $scope.showConfirm = function (ev) {
        var confirm = $mdDialog.confirm()
          .title('You feel .. !')
          .textContent('Is it ok for you! if not give it another try !')
          .ariaLabel('OK') // TODO-EMOVIZ
          .targetEvent(ev)
          .ok('It okay!')
          .cancel('Try again');

        $mdDialog.show(confirm).then(function () {
          $scope.status = 'You decided to get rid of your debt.';
        }, function () {
          $scope.status = 'You decided to keep your debt.';
        });
      };

      var moodMapLabels = {
        x_right: 'Positif feeling',
        x_left: 'Negatif feeling',
        y_top: 'High energy',
        y_bottom: 'Low energy'
      }

      var cordinateFormating = d3.format('.2f')


      // Start SVG
      // -------------------------------------------------
      var svg = d3.select('#mood-map-chart')
        .append('svg');
      //.classed('filled', true);

      var margin = {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
      };

      var percent = d3.format('%');

      var width = 500;
      var height = 500;

      svg.attr({
        width: width,
        height: height
      });

      var xScale = d3.scale.linear()
        .domain([-1, 1])
        .range([0 + margin.left, width - margin.right])
        .nice();

      var yScale = d3.scale.linear()
        .domain([-1, 1])
        .nice()
        .range([height - margin.top, 0 + margin.bottom])
        .nice();

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(percent);

      var yAxis = d3.svg.axis()
        .orient('left')
        .scale(yScale)
        .tickFormat(percent);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + width / 2 + ',0)')
        .call(yAxis);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height / 2 + ')')
        .call(xAxis);


      // ---------------------------------------------
      // Add labels to our moodmap svg
      // ---------------------------------------------
      svg.append("text")
        .attr("class", "x_right_label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height / 2 - 5)
        .text(moodMapLabels.x_right);

      svg.append("text")
        .attr("class", "x_left_label")
        .attr("text-anchor", "end")
        .attr("x", 80)
        .attr("y", height / 2 - 5)
        .text(moodMapLabels.x_left);

      svg.append("text")
        .attr("class", "y_top_label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top)
        .attr("y", width / 2 + 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(moodMapLabels.y_top);

      svg.append("text")
        .attr("class", "y_top_label")
        .attr("text-anchor", "end")
        .attr("x", -height + 70)
        .attr("y", height / 2 + 5)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(moodMapLabels.y_bottom);

      // ---------------------------------------------
      // End adding labels to our moodmap svg
      // ---------------------------------------------


      // -------------------------------------------------
      // Add focuse to the svg element
      // -------------------------------------------------
      var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
        .attr("r", 4.5)
        .attr("class", "focus_circle");

      focus.append("text")
        .attr("x", -17) // -17
        .attr("y", -17) // -17
        .attr("dy", ".12em")
        .attr("class", "focus_text");



      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("display", "none");

      svg.append("rect")
        .attr("class", "overlay")
        .classed('filled', true)
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      function mousemove() {

        var pos = d3.mouse(this);
        var e = d3.event;
        // Get relative cursor position
        var xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
        var ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;

        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1])
        }

        $scope.$digest();

        //$log.info("=== direc moodmap", $scope.XY)
        div.text(Math.round($scope.XY.xValue * 100) + ", " + Math.round($scope.XY.yValue * 100))
          .style("left", (d3.event.pageX - 34) + "px")
          .style("top", (d3.event.pageY - 25) + "px");
      }

      function mousemove2() {
        var pos = d3.mouse(this);
        var e = d3.event;
        // Get relative cursor position
        var xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
        var ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;

        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1])
        }

        focus.attr("transform", "translate(" + xpos + "," + ypos + ")");
        focus.select("text")
          .text('' + Math.round($scope.XY.xValue * 100) + ', ' + Math.round($scope.XY.yValue * 100))
          .style("color", "red");

        $scope.$digest();
      }

      function mouseover() {
        div.style("display", "inline");
      }

      function mouseout() {
        div.style("display", "none");
      }

      //----------------------------------------------------
      // End adding focus
      //----------------------------------------------------


      // Adding gradient color
      var mainGradient = svg.append('linearGradient')
        .attr('id', 'mainGradient');
      // Create the stops of the main gradient. Each stop will be assigned
      // a class to style the stop using CSS.
      mainGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0');
      mainGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1');


      svg.on('click', function (evt) {
        var e = d3.event;
        // Get relative cursor position
        var xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
        var ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;

        svg.append("circle")
          .attr("cx", xpos)
          .attr("cy", ypos)
          .style("background-color", "steelblue")
          .attr("r", 2);

        // get X, Y cordinates
        var pos = d3.mouse(this);

        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1])
        }

        $log.info($scope.XY);

        $scope.showConfirm(evt)
      });

      svg.on('mousemove', function () {
        var pos = d3.mouse(this);

        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1])
        }

        $scope.$digest();
      })

      /*$scope.$watchCollection('XY', function(value) {
        $log.info("==", value)
      });*/
    }

  }
})

app.directive('moodMapChartReflection', function () {

  return {
    restricted: 'E',
    link: function ($scope) {
      console.log("=== direct mood map ref ", $scope)
    },
    templateUrl: 'mood-map-chart-reflection.template.html'
  }
})


app.directive('moodMapBarChartReflection', function () {
  return {
    restricted: 'E',
    scope: {
      data: '='
    },
    controller: function ($scope, $log) {

      $log.info('===', $scope);

      var margins = {
          top: 12,
          left: 48,
          right: 24,
          bottom: 24
        },
        legendPanel = {
          width: 120
        },
        width = 500 - margins.left - margins.right - legendPanel.width,
        height = 100 - margins.top - margins.bottom;

      var percent = d3.format('%');
      //var width = 500
      //var height = 20
      var svg = d3.select("#chart_reflection")
        .append('svg')
        .attr('width', width + margins.left + margins.right + legendPanel.width)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

      var xScale = d3.scale.linear()
        .domain([0, 1])
        .range([0, width]);

      var yScale = d3.scale.ordinal()
        .domain(['Arousal', 'Valence'])
        .rangeRoundBands([0, height], .1);

      var rect1 = svg.append('rect')
        .style('fill', 'blue')
        .attr('x', function (d) {
          return xScale(0);
        })
        .attr('y', function (d, i) {
          return yScale('Arousal');
        })
        .attr('height', function (d) {
          return yScale.rangeBand();
        })

      var rect2 = svg.append('rect')
        .style('fill', 'red')
        .attr('x', function (d) {
          return xScale(0);
        })
        .attr('y', function (d, i) {
          return yScale('Valence');
        })
        .attr('height', function (d) {
          return yScale.rangeBand();
        })

      var valence_level = svg.selectAll("text")
        .data([1, 3])
        .enter()
        .append('text')
        .style('fill', 'blue')
        .attr('x', function (d) {
          return xScale(0);
        })
        .attr('y', function (d, i) {
          return yScale('Valence');
        })
        .attr('height', function (d) {
          return yScale.rangeBand();
        });


      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .tickFormat(percent);

      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      svg.append('g')
        .attr('class', 'axis')
        .call(yAxis);


      var colours = d3.scale.category10();

      svg.append('rect')
        .attr('fill', '#ddd')
        .attr('width', 160)
        .attr('height', 30 * 2)
        .attr('x', width + margins.left)
        .attr('y', 0);

      ['Positive', 'Negative'].forEach(function (s, i) {
        svg.append('text')
          .attr('fill', 'rgb(35, 58,134)')
          .attr('x', width + margins.left + 8)
          .attr('y', i * 24 + 24)
          .text(s);
        svg.append('rect')
          .attr('fill', colours(i))
          .attr('width', 20)
          .attr('height', 20)
          .attr('x', width + margins.left + 70)
          .attr('y', i * 24 + 6);
      });

      $scope.$watch('data', function (progress) {
        var arousal_level = Math.round(progress * 100)
        rect1.attr({
          width: xScale(progress)
        });


        valence_level.attr("transform", "translate(" + arousal_level + "," + 20 + ")");
        valence_level
          .text(arousal_level)
          .style("color", "yellow");


        rect2.attr({
          width: xScale(progress)
        });

      })
    }
  }
})

app.filter('abs', function () {
  return function (nbr) {
    return Math.abs(nbr)
  }
})

app.filter('round', function () {
  return function (nbr) {
    return Math.round(nbr)
  }
})

// TODO-EMOVIZ
app.factory('EmoSelfReportedFactory', function ($resource) {
  var emoSelfReportedService = $resource('http://localhost:3000/api/v1/emoselfreported/:action', {}, {
    findAll: {
      method: 'GET',
      isArray: true,
      params: {
        action: 'findAll'
      }
    }
  });

  return {
    EmoSelfReportedService: emoSelfReportedService
  }
});
