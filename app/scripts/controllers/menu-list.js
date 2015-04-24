'use strict';

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

    $scope.showMenu = function(menu) {
      $location.path('menu-edit/' + menu.id);
    };

    menuService.getMenuList().then(function(menuListFromAPI){
      $scope.menuList = menuListFromAPI;
    });
  });
