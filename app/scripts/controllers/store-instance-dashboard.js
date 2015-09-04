'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceDashboardCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceDashboardCtrl', function ($scope) {

	$scope.viewName = 'Store Instance Dashboard';
    $scope.search = {};
    $scope.multiSelectedValues = {};
    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
