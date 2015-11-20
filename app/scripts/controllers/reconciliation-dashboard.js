'use strict';
/*jshint maxcomplexity:6 */

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDashboardCtrl
 * @description
 * # ReconciliationDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDashboardCtrl', function ($q, $scope, dateUtility, stationsService, reconciliationFactory, payloadUtility, $location, storeInstanceFactory) {

    var $this = this;

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};
    $scope.stationList = [];
    $scope.allowedStoreStatusList = ['Inbounded', 'Confirmed', 'Discrepancies', 'Commission Paid'];
    $scope.allowedStoreStatusMap = {};
    $scope.reconciliationList = [];
    $scope.allCheckboxesSelected = false;
    $scope.actionToExecute = null;
    $scope.instancesForActionExecution = {};

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
      return $scope.allowedStoreStatusList.indexOf(item.statusName) > -1;
    };

    this.getStoreStatusNameById = function (storeStatusId) {
      return ($scope.allowedStoreStatusMap[storeStatusId]) ? $scope.allowedStoreStatusMap[storeStatusId].statusName : null;
    };

    this.normalizeReconciliationDataList = function (dataFromAPI) {
      if (!dataFromAPI) {
        return [];
      }

      return dataFromAPI.map(function (item) {
        item.scheduleDate = dateUtility.formatDateForApp(item.scheduleDate);
        item.updatedOn = (item.updatedOn) ? dateUtility.formatTimestampForApp(item.updatedOn) : null;
        item.statusName = $this.getStoreStatusNameById(item.statusId);
        item.isEcb = (item.isEcb === 'true') ? 'Yes' : 'No';
        item.eposData = 'Loading...';
        item.postTripData = 'Loading...';
        item.cashHandlerData = 'Loading...';

        return item;
      });
    };

    this.recalculateActionsColumn = function (item) {
      var actions = [];

      actions.push('Reports');

      $this.recalculateActionsForInboundStatus(item, actions);
      $this.recalculateActionsForConfirmedStatus(item, actions);
      $this.recalculateActionsForDiscrepanciesStatus(item, actions);

      item.actions = actions;
    };

    $this.recalculateActionsForInboundStatus = function (item, actions) {
      if (item.statusName === 'Inbounded') {
        if (item.eposData !== 'No' && item.postTripData !== 'No' && item.cashHandlerData !== 'No') {
          actions.push('Validate');
        }
        // TODO: Temporary disabled these buttons as per Roshen's request. Enable once Roshen gives a green light
        /*if (item.eposData === 'No') {
          actions.push('Add ePOS Data');
        }
        if (item.postTripData === 'No') {
          actions.push('Add Post Trip Data');
        }
        if (item.cashHandlerData === 'No') {
          actions.push('Add Cash Handler Data');
        }*/
      }
    };

    $this.recalculateActionsForConfirmedStatus = function (item, actions) {
      if (item.statusName === 'Confirmed') {
        actions.push(
          'Review',
          'Pay Commission',
          'Unconfirm'
        );
      }
    };

    $this.recalculateActionsForDiscrepanciesStatus = function (item, actions) {
      if (item.statusName === 'Discrepancies') {
        actions.push(
          'Review',
          'Confirm'
        );
      }
    };

    this.getReconciliationPrecheckDevices = function (item) {
      reconciliationFactory.getReconciliationPrecheckDevices({storeInstanceId: item.id}).then(function (dataFromAPI) {
        item.eposData = (dataFromAPI.devicesSynced && dataFromAPI.totalDevies) ? dataFromAPI.devicesSynced + '/' + dataFromAPI.totalDevies : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.getReconciliationPrecheckSchedules = function (item) {
      reconciliationFactory.getReconciliationPrecheckSchedules({storeInstanceId: item.id}).then(function (dataFromAPI) {
        item.postTripData = (dataFromAPI.postTripScheduleCount && dataFromAPI.eposScheduleCount) ? dataFromAPI.postTripScheduleCount + '/' + dataFromAPI.eposScheduleCount : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.getReconciliationPrecheckCashbags = function (item) {
      reconciliationFactory.getReconciliationPrecheckCashbags({storeInstanceId: item.id}).then(function (dataFromAPI) {
        item.cashHandlerData = (dataFromAPI.cashHandlerCashbagCount && dataFromAPI.totalCashbagCount) ? dataFromAPI.cashHandlerCashbagCount + '/' + dataFromAPI.totalCashbagCount : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.populateLazyColumns = function () {
      angular.forEach($scope.reconciliationList, function (item) {
        $this.getReconciliationPrecheckDevices(item);
        $this.getReconciliationPrecheckSchedules(item);
        $this.getReconciliationPrecheckCashbags(item);
      });
    };

    this.attachReconciliationDataListToScope = function (dataFromAPI) {
      $scope.reconciliationList = $this.normalizeReconciliationDataList(dataFromAPI.response);
      $this.populateLazyColumns();
      $this.hideLoadingModal();
    };

    this.getReconciliationDataList = function () {
      var payload = { 'startDate': dateUtility.formatDateForAPI(dateUtility.nowFormatted()) };
      reconciliationFactory.getReconciliationDataList(payload).then(function (dataFromAPI) {
        $this.attachReconciliationDataListToScope(dataFromAPI);
      }, function () {
        $this.hideLoadingModal();
      });
    };

    this.getStationList = function () {
      stationsService.getGlobalStationList().then(function (dataFromAPI) {
        $scope.stationList = dataFromAPI.response;
      });
    };

    this.filterAvailableStoreStatus = function (item) {
      return $scope.allowedStoreStatusList.indexOf(item.statusName) > -1;
    };

    this.getStoreStatusList = function () {
      $this.showLoadingModal('Loading Data');
      reconciliationFactory.getStoreStatusList().then(function (dataFromAPI) {
        dataFromAPI.filter($this.filterAvailableStoreStatus)
                   .forEach(function (item) {
                      $scope.allowedStoreStatusMap[item.id] = item;
                   });

        $this.getReconciliationDataList();
      });
    };

    this.fixSearchDropdowns = function (search) {
      if (search.departureStationCode === '') {
        search.departureStationCode = null;
      }
      if (search.arrivalStationCode === '') {
        search.arrivalStationCode = null;
      }
      if (search.statusId === '') {
        search.statusId = null;
      }
    };

    $scope.searchReconciliationDataList = function () {
      $this.showLoadingModal('Loading Data');
      $this.fixSearchDropdowns($scope.search);

      $scope.reconciliationList = [];
      reconciliationFactory.getReconciliationDataList(payloadUtility.serializeDates($scope.search)).then(function (dataFromAPI) {
        $this.attachReconciliationDataListToScope(dataFromAPI);
      });
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.companyExchangeRates = [];
    };

    $scope.highlightSelected = function (item) {
      return item.selected ? 'active' : '';
    };

    $scope.hasSelectedInstance = function () {
      return $scope.reconciliationList.filter(function (item) {
        return item.selected === true;
      }).length > 0;
    };

    $scope.canHaveInstanceCheckbox = function (instance) {
      return $scope.doesInstanceContainAction(instance, 'Validate') || $scope.doesInstanceContainAction(instance, 'Pay Commission');
    };

    $scope.toggleAllCheckboxes = function () {
      angular.forEach($scope.reconciliationList, function (item) {
        if ($scope.canHaveInstanceCheckbox(item)) {
          item.selected = $scope.allCheckboxesSelected;
        }
      });
    };

    $scope.viewReview = function (instance) {
      // TODO: add instance id once discrepancy screen is finished
      instance = null;
      $location.path('/reconciliation-discrepancy-detail');
    };

    $scope.showExecuteActionModal = function (instance, action) {
      $scope.instancesForActionExecution = [instance];
      $scope.actionToExecute = action;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.showBulkExecuteActionModal = function (action) {
      $scope.instancesForActionExecution = $this.findSelectedInstances();
      $scope.actionToExecute = action;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.executeAction = function () {
      angular.element('.delete-warning-modal').modal('hide');

      var status = null;
      var instancesToExecuteOn = [];

      switch ($scope.actionToExecute) {
         case 'Unconfirm':
           instancesToExecuteOn = $this.findInstancesWithStatus('Confirmed');
          status = 9;
          break;
        case 'Confirm':
          instancesToExecuteOn = $this.findInstancesWithStatus('Discrepancies');
          status = 10;
          break;
        case 'Pay Commission':
          instancesToExecuteOn = $this.findInstancesWithStatus('Confirmed');
          status = 11;
          break;
      }

      $this.showLoadingModal('Loading Data');

      var promises = [];
      angular.forEach(instancesToExecuteOn, function (instance) {
        promises.push(storeInstanceFactory.updateStoreInstanceStatus(instance.id, status));
      });

      $q.all(promises).then(function () {
        $this.getReconciliationDataList();
      }, function () {
        $this.hideLoadingModal();
      });
    };

    this.findInstancesWithStatus = function (status) {
      return $scope.instancesForActionExecution.filter(function (instance) {
        return instance.statusName === status;
      });
    };

    this.findSelectedInstances = function () {
      return $scope.reconciliationList.filter(function (instance) {
        return instance.selected === true;
      });
    };

    this.showLoadingModal = function (message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    this.init = function () {
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
    };

    $this.init();

  });
