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

    $scope.showMenu = function (menu) {
      $location.path('menu-edit/' + menu.id);
    };

    var attachMenuListToScope = function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    };

    $scope.searchMenus = function () {
      menuService.getMenuList($scope.search).then(attachMenuListToScope);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchMenus();
    };

    function formatDates(menuArray) {
      var formattedMenuArray = angular.copy(menuArray);
      angular.forEach(formattedMenuArray, function (menu) {
        var formatFromAPI = 'YYYY-MM-DD';
        menu.startDate = moment(menu.startDate, formatFromAPI).format('L').toString();
        menu.endDate = moment(menu.endDate, formatFromAPI).format('L').toString();
      });
      return formattedMenuArray;
    }

    menuService.getMenuList().then(attachMenuListToScope);
  });
