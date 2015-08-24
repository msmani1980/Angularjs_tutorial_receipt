'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeReportCtrl
 * @description
 * # StockTakeReportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('StockTakeReportCtrl', function ($scope,$filter, dateUtility,stockTakeFactory,ngToast) {

    var $this = this;
    $scope.stationsList = [];
    $scope.stockTakeList = [];
    $scope.stationItems = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    $scope.userSelectedStation = false;

    this.init = function() {
      this.getCatererStationList();
      $scope.$watch('catererStationId', function(newData) {
        if(newData) {
          $this.getStockTakeList();
          $this.getStockDashboardItems();
        }
      });
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.generateStockTakeQuery = function () {
      var query = {
        catererStationId: $scope.catererStationId,
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
      }
      if($scope.dateRange.endDate) {
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }
      return query;
    };

    this.getStockTakeList = function () {
      $scope.userSelectedStation = false;
      var query = $this.generateStockTakeQuery();
      $this.displayLoadingModal('Getting a list of stock takes');
      stockTakeFactory.getStockTakeList(query).then($this.getStockTakeListSuccessHandler);
    };

    this.getStockTakeListSuccessHandler = function(data) {
      $scope.userSelectedStation = true;
      $scope.stockTakeList = data.response;
      $this.formatStockTakeDates();
      $this.hideLoadingModal();
    };

    this.getStockDashboardItems = function() {
      stockTakeFactory.getStockDashboardItems($scope.catererStationId).then($this.getStockDashboardItemsSuccessHandler);
    };

    this.getStockDashboardItemsSuccessHandler = function (dataFromAPI) {
      $scope.stationItems = dataFromAPI.response;
    };

    this.formatStockTakeDates = function() {
      if(!Array.isArray($scope.stockTakeList)) { return; }
      $scope.stockTakeList.map(function(stockTake){
        stockTake.updatedOn = dateUtility.removeMilliseconds(stockTake.updatedOn);
        return stockTake;
      });
    };

    this.getCatererStationList = function () {
      stockTakeFactory.getCatererStationList().then(function (data) {
        $scope.stationsList = data.response;
      });
    };

    this.showSuccessMessage = function (message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: message
      });
    };


    $scope.removeRecord = function (stockTake) {
      var stockTakeIndex = $scope.stockTakeList.indexOf(stockTake);
      $this.displayLoadingModal('Removing Stock Take');
      stockTakeFactory.deleteStockTake(stockTake.id).then(function () {
        $this.hideLoadingModal();
        $this.showSuccessMessage('Stock Take Removed!');
        $scope.stockTakeList.splice(stockTakeIndex, 1);
      });
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }
      $this.displayLoadingModal();
      $this.getStockTakeList();
    };

    $scope.searchRecords = function () {
      $this.displayLoadingModal();
      $this.getStockTakeList();
    };

    $scope.canCreateStockTake = function() {
      if(!$scope.catererStationId) {
        return false;
      }
      var found = $filter('filter')($scope.stockTakeList, {isSubmitted:false}, true).length;
      if(found>0) {
        return false;
      }
      if(found>=0) {
        return true;
      }
    };

    $scope.searchIsPossible = function() {
      if(Array.isArray($scope.stockTakeList) && $scope.stockTakeList.length > 0 && $scope.catererStationId) {
        return true;
      }
      return false;
    };

    $scope.importIsPossible = function() {
      if(Array.isArray($scope.stationItems) && $scope.stationItems.length > 0 && $scope.catererStationId) {
        return true;
      }
      return false;
    };

    this.init();

  });
