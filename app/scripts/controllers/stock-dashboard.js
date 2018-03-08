'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('StockDashboardCtrl',
  function($scope, $http, globalMenuService, stockManagementStationItemsService, catererStationService,
    companyReasonCodesService, dateUtility, $filter, ENV, stockTakeFactory, identityAccessFactory, accessService) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    $scope.todaysDate = dateUtility.nowFormatted();
    $scope.stockTakeList = [];
    $scope.stockDashboardItemsList = [];

    var $this = this;

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

    var loadingProgress = false;

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stockDashboardItemsList = angular.copy(dataFromAPI.response);
      loadingProgress = false;
      hideLoadingBar();
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      $scope.cateringStationList = angular.copy(dataFromAPI.response);
      if ($scope.cateringStationList.length === 1) {
        $scope.selectedCateringStation = $scope.cateringStationList[0];
      }

      $scope.viewIsReady = true;
    };

    this.getUllageReasonsFromResponse = function(dataFromAPI) {
      $scope.ullageReasons = $filter('filter')(dataFromAPI.companyReasonCodes, {
        reasonTypeName: 'LMP Stock Adjustment'
      }, true);
    };

    $scope.updateStockItems = function() {
      if (!$scope.selectedCateringStation) {
        return false;
      }

      if (loadingProgress) {
        return;
      }

      loadingProgress = true;

      showLoadingBar();
      stockManagementStationItemsService.getStockManagementStationItems($scope.selectedCateringStation.id).then(
        $this.getStockDashboardItemsSuccessHandler);
    };

    this.init = function() {
      hideLoadingBar();
      $scope.isStockTake = accessService.crudAccessGranted('STOCKMANAGER', 'STOCKREPORT', 'CRUDSTR');
      $scope.companyId = globalMenuService.company.get();
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
      companyReasonCodesService.getAll().then($this.getUllageReasonsFromResponse);
      $scope.$watch('selectedCateringStation', function(newData) {
        if (newData) {
          $scope.stockDashboardItemsList = [];
          $scope.updateStockItems();
          $this.setExportURL(newData);
          $this.getStockTakeList();
        }
      });
    };

    this.setExportURL = function(cateringStation) {
      $scope.exportURL = ENV.apiUrl + '/rsvr-pdf/api/stock-management/dashboard/' + cateringStation.id;
      var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
      $scope.exportURL += '/file/export?sortOn=itemName&companyId=' + $scope.companyId + '&sessionToken=' + sessionToken;
    };

    this.generateStockTakeQuery = function() {
      var query = {
        catererStationId: $scope.selectedCateringStation.id,
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
