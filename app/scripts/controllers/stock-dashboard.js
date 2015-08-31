'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('StockDashboardCtrl',
  function ($scope, $http, GlobalMenuService, stockDashboardService, catererStationService, companyReasonCodesService,
            dateUtility, $filter,ENV, stockTakeFactory) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();
    $scope.stockTakeList = [];

    var $this = this;

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.getStockDashboardItemsSuccessHandler = function (dataFromAPI) {
      $scope.stockDashboardItemsList = dataFromAPI.response;
      $this.hideLoadingModal();
    };

    this.getCatererStationListSuccessHandler = function (dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getUllageReasonsFromResponse = function (dataFromAPI) {
      $scope.ullageReasons = $filter('filter')(dataFromAPI.companyReasonCodes, {reasonTypeName: 'LMP Stock Adjustment'}, true);
    };

    $scope.updateStockItems = function () {
      if (!$scope.selectedCateringStation) {
        return false;
      }
      $this.displayLoadingModal('Loading items from ' + $scope.selectedCateringStation.name);
      stockDashboardService.getStockDashboardItems($scope.selectedCateringStation.id).then($this.getStockDashboardItemsSuccessHandler);
    };

    this.init = function () {
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
      $scope.$watch('selectedCateringStation', function(newData) {
        if(newData) {
          $scope.updateStockItems();
          $this.setExportURL(newData);
          $this.getStockTakeList(newData);
        }
      });
    };

    this.setExportURL = function(cateringStation) {
      $scope.exportURL = ENV.apiUrl + '/api/stock-management/dashboard/' + cateringStation.id;
      $scope.exportURL += '/file/export?sessionToken=' + $http.defaults.headers.common.sessionToken;
    };

    this.generateStockTakeQuery = function () {
      var query = {
        catererStationId: $scope.selectedCateringStation.id,
        limit: 100
      };
      return query;
    };

    this.getStockTakeList = function () {
      var query = $this.generateStockTakeQuery();
      stockTakeFactory.getStockTakeList(query).then($this.getStockTakeListSuccessHandler);
    };

    this.getStockTakeListSuccessHandler = function(data) {
      $scope.stockTakeList = data.response;
    };

    this.init();

    $scope.isCatererStationListReadOnly = function () {
      if (angular.isDefined($scope.cateringStationList) && $scope.cateringStationList !== null) {
        return ($scope.cateringStationList.length === 1);
      }
    };

    $scope.isCurrentCountMismatched = function (stockItem) {
      var currentCountExpected = (stockItem.openingQuantity + stockItem.receivedQuantity - stockItem.dispatchedQuantity);
      return (stockItem.currentCountQuantity !== currentCountExpected);
    };

    $scope.isRecordUpdatedToday = function(stockItem) {
      return dateUtility.isToday(dateUtility.formatDateForApp(stockItem.lastUpdatedOn));
    };

    $scope.canCreateStockTake = function() {
      if(angular.isUndefined($scope.selectedCateringStation) || !$scope.selectedCateringStation.id) {
        return false;
      }
      if(Array.isArray($scope.stockTakeList)) {
        return $filter('filter')($scope.stockTakeList, {isSubmitted:false}, true).length === 0;
      } else {
        return true;
      }
    };

  });
