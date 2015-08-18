'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeReportCtrl
 * @description
 * # StockTakeReportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockTakeReportCtrl', function ($scope,$filter, dateUtility,stockTakeService,ngToast,deliveryNoteFactory) {

    var $this = this;
    $scope.stationsList = [];
    $scope.stockTakeList = [];
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
        sortBy: 'ASC',
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }
      return query;
    };

    this.getStockTakeList = function () {
      $scope.userSelectedStation = false;
      var query = $this.generateStockTakeQuery();
      $this.displayLoadingModal('Getting a list of delivery notes');
      stockTakeService.getStockTakeList(query).then(function (data) {
        $scope.userSelectedStation = true;
        $scope.stockTakeList = data.response;
        $this.formatStockTakeDates();
        $this.hideLoadingModal();
      });
    };

    this.formatStockTakeDates = function() {
      angular.forEach($scope.stockTakeList,function(stockTake){
        var pattern = /\.[0-9]+/;
        stockTake.updatedOn = stockTake.updatedOn.replace(pattern, '');
      });
    };

    this.getCatererStationList = function () {
      deliveryNoteFactory.getCatererStationList().then(function (data) {
        $scope.stationsList = data.response;
      });
    };

    this.findStockTakeIndex = function (stockTakeId) {
      var stockTakeIndex = 0;
      for (var key in $scope.stockTakeList) {
        var stockTake = $scope.stockTakeList[key];
        if (stockTake.id === stockTakeId) {
          stockTakeIndex = key;
          break;
        }
      }
      return stockTakeIndex;
    };

    this.showSuccessMessage = function (message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: message
      });
    };

    $scope.removeRecord = function (stockTakeId) {
      var stockTakeIndex = $this.findStockTakeIndex(stockTakeId);
      $this.displayLoadingModal('Removing Stock Take');
      stockTakeService.deleteStockTake(stockTakeId).then(function () {
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

    this.init();

  });
