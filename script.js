// Code goes here

var app = angular.module('myApp', ['ng', 'ngResource', 'ngMaterial', 'ngMdIcons'])

app.controller('MainCtrl', function ($scope, $log, $http, $mdDialog) {


  $scope.submitEmotion = function (discrte_emotions, ev) {

    $log.info($scope.XY);

    // filter emotions keep only levels > 0
    // and get red of emotion_icon
    var emotionsFiltred = discrte_emotions.filter(function (emotion) {
      return emotion.emotion_level > 0;
    }).map(function (emotion) {
      return {
        emotion_name: emotion.emotion_name,
        emotion_level: emotion.emotion_level
      }
    })

    // emotions toJson
    var emotions = angular.toJson(emotionsFiltred, true);

    emotions = {
      discrete_emotions: emotions,
      arousal_level: angular.toJson($scope.XY.xValue),
      valence_level: angular.toJson($scope.XY.yValue)
    }

    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#popupContainer')))
      .clickOutsideToClose(true)
      .title('Recap emotions')
      .textContent(emotions)
      .ok('Got it!')
      .targetEvent(ev)
    );
  }

})

// First acquisition !!
// -------------------------
app.filter('capitalize', function () {
  return function (input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
})

app.directive('discreteEmotion', function () {
  return {
    restricted: 'E',
    templateUrl: 'discrete-emotion.directive.html',
    controller: function ($scope) {

      // selected emotions
      // -----------------
      $scope.selectedEmotions = [{}];

      // Discrete Emotions
      // 'ANGER', 'CONTEMPT', 'DISGUST', 'FEAR', 'HAPPINESS', 'NEUTRAL', 'SADNESS', 'SURPRISE'
      // ----------------------------
      $scope.discrte_emotions = [
        {
          emotion_name: 'SURPRISE',
          emotion_icon: 'sentiment_very_satisfied',
          emotion_level: 0
        },
        {
          emotion_name: 'HAPPINESS',
          emotion_icon: 'mood',
          emotion_level: 0
        },
        {
          emotion_name: 'NEUTRAL',
          emotion_icon: 'sentiment_neutral',
          emotion_level: 0
        },
        {
          emotion_name: 'SADNESS',
          emotion_icon: 'sentiment_satisfied',
          emotion_level: 0
        },
        {
          emotion_name: 'ANGER',
          emotion_icon: 'sentiment_dissatisfied',
          emotion_level: 0
        },
//        {
//          emotion_name: 'CONTEMPT',
//          emotion_icon: 'sentiment_very_dissatisfied',
//          emotion_level: 0
//        },
//        {
  //          emotion_name: 'DISGUST',
  //          emotion_icon: 'mood_bad',
  //          emotion_level: 0
  //        },
        {
          emotion_name: 'FEAR',
          emotion_icon: 'sentiment_very_dissatisfied',
          emotion_level: 0
        }
      ]

      $scope.color = {
        blue: Math.floor(Math.random() * 255)
      };

      $scope.level = 0;
    }
  }
})


// Second Acquisition
// --------------------------

// TODO-EMOVIZ documment this code :p
app.directive('moodMapChart', function () {

  function link(scope, el, attrs) {}

  return {
    restricted: 'E',
    link: link,
    controller: function ($scope, $timeout, $log, $mdDialog) {

      $scope.XY = {
        xValue: 0,
        yValue: 0,
        bMoodMapClicked: false
      }

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

      //      var moodMapLabels = {
      //        x_right: 'Positive feeling',
      //        x_left: 'Negative feeling',
      //        y_top: 'High energy',
      //        y_bottom: 'Low energy'
      //      };
      // TODO-EMOVIZ clean lebels positions
      // -------------------------------
      var moodMapLabels = {
        y_top: 'Intensité positive',
        y_bottom: 'Intensité négative',
        x_right: 'Positif',
        x_left: 'Négatif'
      };

      var cordinateFormating = d3.format('.2f')


      // Start SVG
      // -------------------------------------------------
      var svg = d3.select('#mood-map-chart')
        .append('svg')
        .attr('class', 'svg-mood-map-chart');
      //.classed('filled', true);

      var margin = {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
      };

      var percent = d3.format('%');

      var width = 400;
      var height = 400;

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

      var y_axis_g = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + width / 2 + ',0)');

      y_axis_g.call(yAxis);

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
        .attr("x", 50)
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
        .attr("class", "y_bottom_label")
        .attr("text-anchor", "end")
        .attr("x", -height + 95)
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
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1]),
          bMoodMapClicked: false
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

      // ------------------------------------
      // Click on the moodmap
      // ------------------------------------
      svg.on('click', function (evt) {
        var e = d3.event;
        // Get relative cursor position
        var xpos = (e.offsetX === undefined) ? e.layerX : e.offsetX;
        var ypos = (e.offsetY === undefined) ? e.layerY : e.offsetY;

        /*
        svg.append("circle")
          .attr("cx", xpos)
          .attr("cy", ypos)
          .style("background-color", "steelblue")
          .attr("r", 2);
        */
        // get X, Y cordinates
        var pos = d3.mouse(this);

        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1]),
          bMoodMapClicked: true
        }

        $log.info('=== moodmap clicked ', $scope.XY);

        // $scope.showConfirm(evt)
      });


      /*
      svg.on('mousemove', function () {
        $log.info('heree')
        var pos = d3.mouse(this);

        var isMoodMapClicked = $scope.bMoodMapClicked ? true : false;


        $scope.XY = {
          xValue: Math.abs(xScale.invert(pos[0])) > 1 ? Math.sign(xScale.invert(pos[0])) * 1 : xScale.invert(pos[0]),
          yValue: Math.abs(yScale.invert(pos[1])) > 1 ? Math.sign(yScale.invert(pos[1])) * 1 : yScale.invert(pos[1]),
          bMoodMapClicked: isMoodMapClicked
        }

        $scope.$digest();
      })
*/
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
      data: '=',
      bMoodMapClicked: '='
    },
    controller: function ($scope, $log) {

      $scope.$watch('bMoodMapClicked', function (bMoodMapClicked) {
        $log.info("== bMoodMapClicked ", bMoodMapClicked);
      })

      $log.info('===', $scope);

      var margins = {
          top: 12,
          left: 90,
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

      // Dimensions
      var dimensions = ['Arousal', 'Valence'];
      var dimensions_v2 = [{
          key: 'Arousal',
          positive: 'Intésité positive',
          negative: 'Intésité négative'
      },
        {
          key: 'Valence',
          positive: 'Positif',
          negative: 'Négatif'
       }
      ];

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
        .domain(dimensions)
        .rangeRoundBands([0, height], .1);

      var rect1 = svg.append('rect')
        .style('fill', 'blue')
        .attr('x', function (d) {
          return xScale(0);
        })
        .attr('y', function (d, i) {
          return yScale(dimensions[0]);
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
          return yScale(dimensions[1]);
        })
        .attr('height', function (d) {
          return yScale.rangeBand();
        })

      // ---------------------------------------------
      // Add labels to our moodmap svg
      // ---------------------------------------------
      svg.append("text")
        .attr("class", "x_right_label_mp_ref")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -4)
        .text('Sentiment:');



      var valence_level = svg.selectAll("text1")
        .data([1, 3])
        .enter()
        .append('text')
        .attr('x', 3)
        .style('fill', 'white');

      var arousal_level = svg.selectAll("text2")
        .data([1, 3])
        .enter()
        .append('text')
        .attr('x', 3)
        .style('fill', 'white');

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

      var y_axis_g = svg.append('g')
        .attr('class', 'y_axis');

      y_axis_g.call(yAxis);


      var colors = d3.scale.category10();

      // TODO-organize this
      //--------------------
      var dimentions_labels = {
        positive_arousal: 'Intensité positive',
        negative_arousal: 'Intensité négative',
        positive_valence: 'Positif',
        negative_valence: 'Négatif'
      };

      var dimentions_labels_color = {
        positive_arousal: '#FFEB3B', // yellow
        negative_arousal: '#2196F3', // blue
        positive_valence: '#4CAF50', // green
        negative_valence: '#F44336' // red
      }

      // Adding legend
      // -------------------------
      /*
      svg.append('rect')
        //.attr('fill', '#ddd')
        .style("stroke", '#ddd')
        .style("fill", "none")
        .style("stroke-width", 1)
        .attr('width', 70)
        .attr('height', 23 * 2)
        .attr('x', width + margins.left + 10)
        .attr('y', 0);

      ['Positif', 'Négatif'].forEach(function (s, i) {
        svg.append('text')
          .attr('fill', 'black')
          .attr('x', width + margins.left + 30)
          .attr('y', i * 24 + 15)
          .text(s);
        svg.append('rect')
          .attr('fill', colors(i))
          .attr('width', 10)
          .attr('height', 10)
          .attr('x', width + margins.left + 15)
          .attr('y', i * 24 + 6);
      });

  */


      $scope.$watch('data', function (progress) {

        console.log('==== progress bMoodMapClicked', progress.bMoodMapClicked);
        console.log('==== progress', progress);
        if (!!progress.bMoodMapClicked) {
          console.log('==== clicked fired', progress.bMoodMapClicked)
          return;
        }

        // Arousal
        // ----------------
        rect1.attr({
            width: xScale(Math.abs(progress.yValue))
          })
          // Adding color
          .style('fill', progress.yValue >= 0 ? dimentions_labels_color.positive_arousal : dimentions_labels_color.negative_arousal)
        valence_level.attr("transform", "translate(" + xScale(Math.abs(progress.yValue)) + "," + 20 + ")");
        valence_level.text(Math.round(progress.yValue * 100));

        // Valence
        // ----------------
        rect2.attr({
            width: xScale(Math.abs(progress.xValue))
          })
          // Adding color
          .style('fill', progress.xValue >= 0 ? dimentions_labels_color.positive_valence : dimentions_labels_color.negative_valence);

        arousal_level.attr("transform", "translate(" + xScale(Math.abs(progress.xValue)) + "," + 50 + ")");
        arousal_level.text(Math.round(progress.xValue * 100));


        // change label & color
        // -------------------
        if (progress.xValue < 0 && progress.yValue >= 0) {
          yScale
            .domain([dimentions_labels.positive_arousal, dimentions_labels.negative_valence]);
          y_axis_g.call(yAxis);

          //          y_axis_g.select('.y_axis text')
          //            .style('fill', dimentions_labels_color.negative_arousal)
        }

        if (progress.xValue >= 0 && progress.yValue >= 0) {
          yScale
            .domain([dimentions_labels.positive_arousal, dimentions_labels.positive_valence]);
          y_axis_g.call(yAxis);

          //          y_axis_g.select('.y_axis text')
          //            .style('fill', dimentions_labels_color.positive_arousal);
        }

        if (progress.xValue < 0 && progress.yValue < 0) {
          yScale
            .domain([dimentions_labels.negative_arousal, dimentions_labels.negative_valence]);
          y_axis_g.call(yAxis);
        }

        if (progress.xValue >= 0 && progress.yValue < 0) {
          yScale
            .domain([dimentions_labels.negative_arousal, dimentions_labels.positive_valence]);
          y_axis_g.call(yAxis);
        }

        // Change color labels
        // --------------------
        // TODO-EMOVIZ

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
