'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuListCtrl
 * @description
 * # MenuListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuListCtrl', function ($scope, menuService) {
    $scope.viewName = 'Menu Management';

    menuService.getMenuList().then(function(menuListFromAPI){
      $scope.menuList = menuListFromAPI;
    });
  });
