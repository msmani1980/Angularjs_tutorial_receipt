'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function($scope, $http, GlobalMenuService, stockDashboardService,
    catererStationService, companyReasonCodesService, dateUtility, $filter) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();

    var $this = this;

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stockDashboardItemsList = dataFromAPI.response;
      $this.hideLoadingModal();
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getUllageReasonsFromResponse = function(dataFromAPI) {
      $scope.ullageReasons = $filter('filter')(dataFromAPI.companyReasonCodes, {reasonTypeName:'Ullage'}, true);
    };

    this.init = function() {
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
    };

    this.init();

    $scope.isCatererStationListReadOnly = function() {
      if (angular.isDefined($scope.cateringStationList) && $scope.cateringStationList !== null) {
        return ($scope.cateringStationList.length === 1);
      }
    };

    $scope.updateStockItems = function(selectedCateringStation) {
      $this.displayLoadingModal('Loading your records...');
      stockDashboardService.getStockDashboardItems(selectedCateringStation).then($this.getStockDashboardItemsSuccessHandler);
    };

    $scope.isCurrentCountMismatched = function(stockItem) {
      var currentCountExpected = (stockItem.openingQuantity + stockItem.receivedQuantity - stockItem.dispatchedQuantity);
      if (stockItem.currentCountQuantity > currentCountExpected) {
        return 'bg-danger';
      }
    };

  });
