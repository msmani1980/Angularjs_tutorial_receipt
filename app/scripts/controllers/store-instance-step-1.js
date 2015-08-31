'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceStep1Ctrl
 * @description
 * # StoreInstanceStep1Ctrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceStep1Ctrl', function ($scope,catererStationService,menuService) {

    $scope.cateringStationList = [];
    $scope.menuList = [];

    this.init = function() {
      this.getCatererStationList();
      this.getMenuList();
    };

    this.getCatererStationList = function() {
      // TODO: Use store instance factory
      catererStationService.getCatererStationList().then(this.setCatererStationList);
    };

    this.setCatererStationList = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getMenuList = function() {
      // TODO: Use store instance factory
      menuService.getMenuList().then(this.setMenuList);
    };

    this.setMenuList = function(dataFromAPI) {
      $scope.menuList = dataFromAPI.menus;
    };

    this.init();

  });
