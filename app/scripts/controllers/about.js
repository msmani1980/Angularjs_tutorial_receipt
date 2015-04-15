'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('AboutCtrl', function ($scope, $localStorage) {
    $scope.$storage = $localStorage;
  });
