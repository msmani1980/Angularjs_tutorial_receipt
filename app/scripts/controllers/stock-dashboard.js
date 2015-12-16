'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('StockDashboardCtrl',
  function($scope, $http, GlobalMenuService, stockManagementStationItemsService, catererStationService,
    companyReasonCodesService,
    dateUtility, $filter, ENV, stockTakeFactory, identityAccessFactory) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();
    $scope.stockTakeList = [];
    $scope.stockDashboardItemsList = [];

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      $scope.stockDashboardItemsList = $scope.stockDashboardItemsList.concat(dataFromAPI.response);
      loadingProgress = false;
      hideLoadingBar();
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getUllageReasonsFromResponse = function(dataFromAPI) {
      $scope.ullageReasons = $filter('filter')(dataFromAPI.companyReasonCodes, {
        reasonTypeName: 'LMP Stock Adjustment'
      }, true);
    };

    var loadingProgress = false;
    $scope.updateStockItems = function() {
      if (!$scope.selectedCateringStation) {
        return false;
      }
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      if (loadingProgress) {
        return;
      }
      loadingProgress = true;

      showLoadingBar();
      stockManagementStationItemsService.getStockManagementStationItems($scope.selectedCateringStation.id, $this.meta.limit, $this.meta.offset).then(
        $this.getStockDashboardItemsSuccessHandler);
      $this.meta.offset += $this.meta.limit;
    };

    this.init = function() {
      hideLoadingBar();
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
      $scope.$watch('selectedCateringStation', function(newData) {
        if (newData) {
          $this.meta = {
            count: undefined,
            limit: 100,
            offset: 0
          };
          $scope.stockDashboardItemsList = [];
          $scope.updateStockItems();
          $this.setExportURL(newData);
          $this.getStockTakeList(newData);
        }
      });
    };

    this.setExportURL = function(cateringStation) {
      $scope.exportURL = ENV.apiUrl + '/api/stock-management/dashboard/' + cateringStation.id;
      var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
      $scope.exportURL += '/file/export?sessionToken=' + sessionToken;
    };

    this.generateStockTakeQuery = function() {
      var query = {
        catererStationId: $scope.selectedCateringStation.id,
        limit: 100
      };
      return query;
    };

    this.getStockTakeList = function() {
      var query = $this.generateStockTakeQuery();
      stockTakeFactory.getStockTakeList(query).then($this.getStockTakeListSuccessHandler);
    };

    this.getStockTakeListSuccessHandler = function(data) {
      $scope.stockTakeList = data.response;
    };

    this.init();

    $scope.isCatererStationListReadOnly = function() {
      if (angular.isDefined($scope.cateringStationList) && $scope.cateringStationList !== null) {
        return ($scope.cateringStationList.length === 1);
      }
    };

    $scope.isCurrentCountMismatched = function(stockItem) {
      var currentCountExpected = (stockItem.openingQuantity + stockItem.receivedQuantity - stockItem.dispatchQuantity);
      return (stockItem.currentQuantity !== currentCountExpected);
    };

    $scope.isRecordUpdatedToday = function(stockItem) {
      return dateUtility.isToday(dateUtility.formatDateForApp(stockItem.lastUpdatedOn));
    };

    $scope.canCreateStockTake = function() {
      if (angular.isUndefined($scope.selectedCateringStation) || !$scope.selectedCateringStation.id) {
        return false;
      }
      if (Array.isArray($scope.stockTakeList)) {
        return $filter('filter')($scope.stockTakeList, {
          isSubmitted: false
        }, true).length === 0;
      } else {
        return true;
      }
    };

  });
