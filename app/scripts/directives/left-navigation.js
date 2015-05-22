'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leftNavigation
 * @description
 * # leftNavigation
 */
angular.module('ts5App')
  .directive('leftNavigation', function ( ) {

    var leftNavigationController = function ($scope, $location) {

  		$scope.locationPath = $location.path();

  	};

    return {
      templateUrl: 'views/directives/left-navigation.html',
      restrict: 'E',
      controller: leftNavigationController,
      scope: false
    };

  });
