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
    catererStationService, companyReasonCodesService, dateUtility,ENV) {

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
      $scope.ullageReasons = dataFromAPI.companyReasonCodes.filter(function(reasonCode) {
        return reasonCode.reasonTypeName === 'Ullage';
      });
    };

    this.init = function() {
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
    };

    this.setExportURL = function(newValue) {
      if(newValue){
        $scope.exportURL = ENV.apiUrl + '/api/stock-management/dashboard/' + newValue.id;
        $scope.exportURL += '/file/export?sessionToken=' + $http.defaults.headers.common.sessionToken;
      }
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

    $scope.isClassDanger = function(stockItem) {
      var currentCountExpected = (stockItem.openingQuantity + stockItem.receivedQuantity - stockItem.dispatchedQuantity);
      if (stockItem.currentCountQuantity > currentCountExpected) {
        return 'bg-danger';
      }
    };

    $scope.$watch('selectedCateringStation', $this.setExportURL);

  });
