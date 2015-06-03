'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:MenuListCtrl
 * @description
 * # MenuListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuListCtrl', function ($scope, $location, menuService) {
    $scope.viewName = 'Menu Management';

    function formatDates(menuArray) {
      var formattedMenuArray = angular.copy(menuArray);
      angular.forEach(formattedMenuArray, function (menu) {
        var formatFromAPI = 'YYYY-MM-DD';
        menu.startDate = moment(menu.startDate, formatFromAPI).format('L').toString();
        menu.endDate = moment(menu.endDate, formatFromAPI).format('L').toString();
      });
      return formattedMenuArray;
    }

    function serializeDates(payload) {
      var formattedPayload = angular.copy(payload),
        datePickerFormat = 'MM/DD/YYYY',
        serializedFormat = 'YYYYMMDD';
      if (formattedPayload.startDate) {
        formattedPayload.startDate = moment(formattedPayload.startDate, datePickerFormat).format(serializedFormat).toString();
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = moment(formattedPayload.endDate, datePickerFormat).format(serializedFormat).toString();
      }
      return formattedPayload;
    }

    $scope.showMenu = function (menu) {
      $location.path('menu-edit/' + menu.id);
    };

    $scope.deleteMenu = function () {
      return false;
    };

    $scope.showDeleteConfirmation = function (menuToDelete) {
      $scope.menuToDelete = menuToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.isMenuReadOnly = function (menu) {
      var isGreaterThanToday = moment(menu.endDate, 'L').format('L') <= moment().format('L');
      return isGreaterThanToday;
    };

    var attachMenuListToScope = function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    };

    $scope.searchMenus = function () {
      menuService.getMenuList(serializeDates($scope.search)).then(attachMenuListToScope);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchMenus();
    };

    menuService.getMenuList().then(attachMenuListToScope);
  });
