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

    function formatDates(menuArray) {
      var formattedMenuArray = angular.extend({}, menuArray);
      angular.forEach(formattedMenuArray, function (menu) {
        var formatFromAPI = 'YYYY-MM-DD';
        menu.startDate = moment(menu.startDate, formatFromAPI).format('l').toString();
        menu.endDate = moment(menu.endDate, formatFromAPI).format('l').toString();
      });
      return formattedMenuArray;
    }

    menuService.getMenuList().then(function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    });
  });
