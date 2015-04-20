'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyCtrl
 * @description
 * # CompanyCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyCtrl', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;
  });
