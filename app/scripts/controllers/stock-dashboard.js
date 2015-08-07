'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function($scope, $http, stockDashboardService, catererStationService, dateUtility) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stockDashboardItemsList = dataFromAPI.response;
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.init = function() {
      stockDashboardService.getStockDashboardItems().then(this.getStockDashboardItemsSuccessHandler);
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
    };

    this.init();

    $scope.isCatererStationListReadOnly = function() {
      if ($scope.cateringStationList) {
        return ($scope.cateringStationList.length === 1);
      }
    };

  });
