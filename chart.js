'use strict'

app.factory('d3', function () {
  return d3
})

app.directive('myChart', function (d3, $log) {
  return {
    restrict: 'E',
    scope: {

    },
    link: function (scope, el, attrs) {
      $log.info("mychart directive ...")
    }
  }
})
