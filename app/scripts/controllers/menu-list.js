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

    $scope.clearForm = function() {
      $scope.search = {};
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

    menuService.getMenuList().then(function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    });
  });
