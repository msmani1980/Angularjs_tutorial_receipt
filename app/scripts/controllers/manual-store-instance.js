'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualStoreInstanceCtrl
 * @description
 * # ManualStoreInstanceCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualStoreInstanceCtrl', function ($scope) {
	  
	$scope.viewName = 'Create Manual Store Instance';
    $scope.search = {};
    $scope.multiSelectedValues = {};
	    
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
