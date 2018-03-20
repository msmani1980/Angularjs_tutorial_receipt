'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeReportCtrl
 * @description
 * # StockTakeReportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockTakeReportCtrl', function($scope, $filter, dateUtility, stockTakeFactory, messageService, lodash, accessService) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.stationsList = [];
    $scope.stockTakeList = [];
    $scope.stationItems = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    $scope.userSelectedStation = false;

    this.init = function() {
      $scope.isStockTake = accessService.crudAccessGranted('STOCKMANAGER', 'STOCKREPORT', 'CRUDSTR');
      $this.getCatererStationList();
      $this.cateringStationWatcher();
    };

    function showLoadingBar() {
      $scope.showLoadingBar = true;
    }

    function hideLoadingBar() {
      $scope.showLoadingBar = false;
      angular.element('.modal-backdrop').remove();
    }

    $scope.formatUpdatedDate = function (updatedOnTimestamp) {
      return dateUtility.formatTimestampForApp(updatedOnTimestamp);
    };

    this.cateringStationWatcher = function() {
      $scope.$watch('catererStationId', function(newData) {
        if (newData) {
          $scope.stockTakeList = [];
          $this.meta = {
            count: undefined,
            limit: 100,
            offset: 0
          };
          $scope.getStockTakeList();
          $this.getStockDashboardItems();
          showLoadingBar();
        }
      });
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.generateStockTakeQuery = function() {
      var query = {
        catererStationId: $scope.catererStationId,
        limit: 100
      };
      angular.extend(query, $scope.search);
      if ($scope.dateRange.startDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange.startDate);
      }

      if ($scope.dateRange.endDate) {
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange.endDate);
      }

      return query;
    };

    this.getStockTakeListSuccessHandler = function(data) {
      $this.meta.count = $this.meta.count || data.meta.count;
      $scope.userSelectedStation = true;
      if (!data.response) {

        return hideLoadingBar();
      }

      $scope.stockTakeList = $scope.stockTakeList.concat(data.response);
      $this.formatStockTakeDates();
      hideLoadingBar();
    };

    $scope.getStockTakeList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      $scope.userSelectedStation = false;
      var query = $this.generateStockTakeQuery();
      query = lodash.assign(query, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      stockTakeFactory.getStockTakeList(query).then($this.getStockTakeListSuccessHandler);
      $this.meta.offset += $this.meta.limit;
    };

    this.getStockDashboardItems = function() {
      stockTakeFactory.getStockDashboardItems($scope.catererStationId).then($this.getStockDashboardItemsSuccessHandler);
    };

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stationItems = dataFromAPI.response;
    };

    this.formatStockTakeDates = function() {
      if (!Array.isArray($scope.stockTakeList)) {
        return;
      }

      $scope.stockTakeList.map(function(stockTake) {
        stockTake.updatedOn = dateUtility.removeMilliseconds(stockTake.updatedOn);
        return stockTake;
      });
    };

    this.getCatererStationList = function() {
      stockTakeFactory.getCatererStationList().then(function(data) {
        $scope.stationsList = data.response;
        if ($scope.stationsList.length === 1) {
          $scope.catererStationId = $scope.stationsList[0].id.toString();
        }
      });
    };

    this.showSuccessMessage = function(message) {
      messageService.display('success', message);
    };

    $scope.removeRecord = function(stockTake) {
      var stockTakeIndex = $scope.stockTakeList.indexOf(stockTake);
      $this.displayLoadingModal('Removing Stock Take');
      stockTakeFactory.deleteStockTake(stockTake.id).then(function() {
        $this.hideLoadingModal();
        $this.showSuccessMessage('Stock Take Removed!');
        $scope.stockTakeList.splice(stockTakeIndex, 1);
      });
    };

    $scope.clearSearchFilters = function() {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }

      $scope.searchRecords();
    };

    $scope.searchRecords = function() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.stockTakeList = [];
      $scope.getStockTakeList();
    };

    $scope.canCreateStockTake = function() {
      if (!$scope.catererStationId) {
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

    $scope.searchIsPossible = function() {
      if (Array.isArray($scope.stockTakeList) && $scope.stockTakeList.length > 0 && $scope.catererStationId) {
        return true;
      }

      return false;
    };

    $scope.importIsPossible = function() {
      if (Array.isArray($scope.stationItems) && $scope.stationItems.length > 0 && $scope.catererStationId) {
        return true;
      }

      return false;
    };

    this.init();

  });
