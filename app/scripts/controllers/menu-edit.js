'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:MenuEditCtrl
 * @description
 * # MenuEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuEditCtrl', function ($scope, $routeParams, menuService) {
    $scope.viewName = 'Menu';

    $scope.submitForm = function () {
      console.log($scope.menuEditForm.$pristine);
    };

    menuService.getMenu($routeParams.id).then(function (menuFromAPI) {
      var formatFromAPI = 'YYYY-MM-DD';
      $scope.menu = menuFromAPI;
      $scope.menu.startDate = moment($scope.menu.startDate, formatFromAPI).format('l').toString();
      $scope.menu.endDate = moment($scope.menu.endDate, formatFromAPI).format('l').toString();
    });

  });
