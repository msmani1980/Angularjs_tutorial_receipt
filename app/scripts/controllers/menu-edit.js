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

    function getMasterItemUsingId(masterItemId) {
      return $scope.masterItemsList.filter(function (masterItem) {
        return masterItem.id === masterItemId;
      })[0];
    }

    function attachItemsModelToScope(masterItemsFromAPI) {
      $scope.masterItemsList = masterItemsFromAPI.masterItems;
      $scope.menuItemsList = [];
      angular.forEach($scope.menu.menuItems, function (menuItem) {
        var masterItem = {
          itemQty: menuItem.itemQty
        };
        angular.extend(masterItem, getMasterItemUsingId(menuItem.itemId));
        $scope.menuItemsList.push(masterItem);
      });
    }

    function fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, dateForAPIFormat) {
      var startDate = formatDate(menuFromAPI.startDate, dateFromAPIFormat, dateForAPIFormat);
      var endDate = formatDate(menuFromAPI.endDate, dateFromAPIFormat, dateForAPIFormat);

      itemsService.getItemsList({
        startDate: startDate,
        endDate: endDate
      }, true).then(attachItemsModelToScope);
    }

    function localizeDates(dateFromAPIFormat, formatDateTo) {
      $scope.menu.startDate = formatDate($scope.menu.startDate, dateFromAPIFormat, formatDateTo);
      $scope.menu.endDate = formatDate($scope.menu.endDate, dateFromAPIFormat, formatDateTo);
    }

    function attachMenuListModelToScope(menuFromAPI) {
      var dateFromAPIFormat = 'YYYY-MM-DD';
      var formatDateTo = 'L';
      $scope.menu = menuFromAPI;
      fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, 'YYYYMMDD');
      localizeDates(dateFromAPIFormat, formatDateTo);
    }

    $scope.submitForm = function () {
      var formatDateFrom = 'l';
      var formatDateTo = 'YYYYMMDD';
      localizeDates(formatDateFrom, formatDateTo);
      menuService.updateMenu($scope.menu.toJSON()).then(attachMenuListModelToScope);
    };

    menuService.getMenu($routeParams.id).then(attachMenuListModelToScope);

  });
