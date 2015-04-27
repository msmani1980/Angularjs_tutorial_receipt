'use strict';

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

    menuService.getMenu($routeParams.id).then(function (menuFromAPI) {
      $scope.menu = menuFromAPI;
    });
  });
