'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leftNavigationStockOwner
 * @description
 * # leftNavigationStockOwner
 */
angular.module('ts5App')
  .directive('leftNavigationStockOwner', function ( ) {

    var leftNavigationStockOwnerController = function ($scope, $location) {

  		$scope.locationPath = $location.path();

  	};

    return {
      templateUrl: 'views/directives/left-navigation-stock-owner.html',
      restrict: 'E',
      controller: leftNavigationStockOwnerController,
      scope: false
    };

  });
