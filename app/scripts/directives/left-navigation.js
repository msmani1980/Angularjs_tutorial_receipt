'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leftNavigation
 * @description
 * # leftNavigation
 */
angular.module('ts5App')
  .directive('leftNavigation', function () {

    var leftNavigationController = function ($scope, $location) {

      $scope.locationPath = $location.path();
      switch ($scope.basePath) {
      case 'retail-items':

        $scope.itemListPath = '/item-list';
        $scope.itemCreatePath = '/item-create';
        $scope.manageCategoriesPath = 'ember/#/retail-items/categories';

        break;

      case 'stock-owner-items':

        $scope.itemListPath = '/stock-owner-item-list';
        $scope.itemCreatePath = '/stock-owner-item-create';
        $scope.manageCategoriesPath =
          'ember/#/stock-owner-item/categories';

        break;

      }

    };

    return {
      templateUrl: '/views/directives/left-navigation.html',
      restrict: 'E',
      scope: {
        basePath: '@'
      },
      controller: leftNavigationController
    };

  });
