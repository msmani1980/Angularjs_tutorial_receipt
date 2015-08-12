'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function($scope, $http, GlobalMenuService,
    stockDashboardService, catererStationService, companyReasonCodesService, dateUtility) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();

    this.getCompanyId = function() {
      return GlobalMenuService.company.get();
    };

    var $this = this;

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stockDashboardItemsList = dataFromAPI.response;
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getUllageReasonsFromResponse = function(dataFromAPI) {
      $scope.ullageReasons = dataFromAPI.companyReasonCodes.filter(function(reasonCode) {
        return reasonCode.reasonTypeName === 'Ullage';
      });
    };

    this.init = function() {
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
    };

    this.init();

    $scope.isCatererStationListReadOnly = function() {
      if ($scope.cateringStationList) {
        return ($scope.cateringStationList.length === 1);
      }
    };

    $scope.updateStockItems = function(selectedCateringStation) {
      stockDashboardService.getStockDashboardItems(selectedCateringStation).then($this.getStockDashboardItemsSuccessHandler);
    };

  });
