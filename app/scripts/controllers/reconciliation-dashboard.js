'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDashboardCtrl
 * @description
 * # ReconciliationDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDashboardCtrl', function ($scope, dateUtility, stationsService, reconciliationFactory, payloadUtility) {

    var $this = this;

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};
    $scope.stationList = [];
    $scope.allowedStoreStatusList = ['Inbounded', 'Confirmed', 'Discrepancies', 'Commission Paid'];
    $scope.allowedStoreStatusMap = {};
    $scope.reconciliationList = [];

    $scope.toggleColumnView = function (columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.updateOrderBy = function (orderName) {
      $scope.tableSortTitle = ($scope.tableSortTitle === orderName) ? ('-' + $scope.tableSortTitle) : (orderName);
    };

    $scope.doesInstanceContainAction = function (instance, actionName) {
      if (!instance.actions) {
        return false;
      }
      return instance.actions.indexOf(actionName) >= 0;
    };

    $scope.getSortingType = function (orderName) {
      if ($scope.tableSortTitle === orderName) {
        return 'ascending';
      } else if ($scope.tableSortTitle === '-' + orderName) {
        return 'descending';
      }
      return 'none';
    };

    $scope.getArrowIconAndClassForSorting = function (orderName) {
      var sortTypeToArrowTypeMap = {
        ascending: 'fa fa-sort-asc active',
        descending: 'fa fa-sort-desc active',
        none: 'fa fa-sort text-muted-light'
      };
      var sortType = $scope.getSortingType(orderName);
      return sortTypeToArrowTypeMap[sortType];
    };

    $scope.filterReconciliationList = function (item) {
      return !$.inArray(item.statusName, $scope.allowedStoreStatusList);
    };

    this.getStoreStatusNameById = function (storeStatusId) {
      return ($scope.allowedStoreStatusMap[storeStatusId]) ? $scope.allowedStoreStatusMap[storeStatusId].statusName : null;
    };

    this.normalizeReconciliationDataList = function (dataFromAPI) {
      if (!dataFromAPI) {
        return [];
      }

      return dataFromAPI.map(function (item) {
        item.scheduleDate = dateUtility.formatDateForApp(item.scheduleDate)
        item.updatedOn = (item.updatedOn) ? dateUtility.formatTimestampForApp(item.updatedOn) : null;
        item.statusName = $this.getStoreStatusNameById(item.statusId);
        item.isEcb = (item.isEcb === 'true') ? 'Yes' : 'No';
        item.eposData = 'Loading...';

        return item;
      });
    };

    this.populateEposDataColumn = function () {
      angular.forEach($scope.reconciliationList, function (item) {
        reconciliationFactory.getReconciliationPrecheckDevices({storeInstanceId: item.id}).then(function (dataFromAPI) {
          item.eposData = (dataFromAPI.devicesSynced && dataFromAPI.totalDevies) ? dataFromAPI.devicesSynced + '/' + dataFromAPI.totalDevies : 'No';
        });
      });
    };

    this.getReconciliationDataList = function () {
      reconciliationFactory.getReconciliationDataList().then(function (dataFromAPI) {
        $scope.reconciliationList = $this.normalizeReconciliationDataList(dataFromAPI.response);
        $this.populateEposDataColumn();
        $this.hideLoadingModal();
      });
    };

    this.getStationList = function () {
      stationsService.getGlobalStationList().then(function (dataFromAPI) {
        $scope.stationList = dataFromAPI.response
      })
    };

    this.filterAvailableStoreStatus = function (item)
    {
      return $.inArray(item.statusName, $scope.allowedStoreStatusList) > -1
    };

    this.getStoreStatusList = function () {
      $this.showLoadingModal("Loading Data");
      reconciliationFactory.getStoreStatusList().then(function (dataFromAPI) {
        dataFromAPI.filter($this.filterAvailableStoreStatus)
                   .forEach(function (item) {
                      $scope.allowedStoreStatusMap[item.id] = item;
                   });

        $this.getReconciliationDataList();
      });
    };

    $this.fixSearchDropdowns = function (search) {
      if (search.departureStationCode === '') search.departureStationCode = null;
      if (search.arrivalStationCode === '') search.arrivalStationCode = null;
      if (search.statusId === '') search.statusId = null;
    };

    $scope.searchReconciliationDataList = function () {
      $this.showLoadingModal('Loading Data');
      $this.fixSearchDropdowns($scope.search);

      $scope.reconciliationList = [];
      reconciliationFactory.getReconciliationDataList(payloadUtility.serializeDates($scope.search)).then(function (dataFromAPI) {
        $scope.reconciliationList = $this.normalizeReconciliationDataList(dataFromAPI.response);
        $this.hideLoadingModal();
      });
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.companyExchangeRates = [];
    };

    this.showLoadingModal = function (message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    function init() {
      // Schedule Date ascending, then Store Number ascending, then Store Instance ascending, then Dispatched Station ascending, and then Received Station.
      $scope.tableSortTitle = '[scheduleDate, storeNumber, storeInstanceId, dispatchedStation, receivedStation]';
      $scope.displayColumns = {
        receivedStation: false,
        storeInstanceId: false,
        updatedDate: false,
        updatedBy: false
      };

      $scope.search = {
        startDate: dateUtility.dateNumDaysBeforeTodayFormatted(10),
        endDate: dateUtility.dateNumDaysBeforeTodayFormatted(2)
      };

      $this.getStationList();
      $this.getStoreStatusList();
    }

    init();

  });
