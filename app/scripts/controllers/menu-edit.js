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


    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    }

    function fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, dateForAPIFormat) {
      var startDate = formatDate(menuFromAPI.startDate, dateFromAPIFormat, dateForAPIFormat);
      var endDate = formatDate(menuFromAPI.endDate, dateFromAPIFormat, dateForAPIFormat);

      itemsService.getItemsList({
        startDate: startDate,
        endDate: endDate
      }, true);
    }

    function localizeDates(dateFromAPIFormat, formatDateTo) {
      $scope.menu.startDate = formatDate($scope.menu.startDate, dateFromAPIFormat, formatDateTo);
      $scope.menu.endDate = formatDate($scope.menu.endDate, dateFromAPIFormat, formatDateTo);
    }

    function attachModelToScope(menuFromAPI) {
      var dateFromAPIFormat = 'YYYY-MM-DD';
      var formatDateTo = 'L';
      $scope.menu = menuFromAPI;
      localizeDates(dateFromAPIFormat, formatDateTo);
      //fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, 'YYYYMMDD');
    }

    $scope.submitForm = function () {
      var formatDateFrom = 'l';
      var formatDateTo = 'YYYYMMDD';
      formatDate(formatDateFrom, formatDateTo);
      menuService.updateMenu($scope.menu.toJSON()).then(attachModelToScope);
    };

    menuService.getMenu($routeParams.id).then(attachModelToScope);

  });
