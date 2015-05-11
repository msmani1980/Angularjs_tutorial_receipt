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
  .controller('MenuEditCtrl', function ($scope, $routeParams, menuService, itemsService) {
    $scope.viewName = 'Menu';

    function formatStartAndEndDates(formatFrom, formatTo) {
      $scope.menu.startDate = moment($scope.menu.startDate, formatFrom).format(formatTo).toString();
      $scope.menu.endDate = moment($scope.menu.endDate, formatFrom).format(formatTo).toString();
    }

    function attachModelToScope(menuFromAPI) {
      var formatDateFrom = 'YYYY-MM-DD';
      var formatDateTo = 'L';
      $scope.menu = menuFromAPI;
      formatStartAndEndDates(formatDateFrom, formatDateTo);
    }

    $scope.submitForm = function () {
      var formatDateFrom = 'l';
      var formatDateTo = 'YYYYMMDD';
      formatStartAndEndDates(formatDateFrom, formatDateTo);
      menuService.updateMenu($scope.menu.toJSON()).then(attachModelToScope);
    };

    menuService.getMenu($routeParams.id).then(attachModelToScope);
    itemsService.getItem(359)

  });
