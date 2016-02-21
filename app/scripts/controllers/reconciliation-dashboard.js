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
  .controller('ReconciliationDashboardCtrl', function($q, $scope, dateUtility, stationsService, reconciliationFactory,
    payloadUtility, $location, storeInstanceFactory, lodash) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};
    $scope.stationList = null;
    $scope.allowedStoreStatusList = ['Inbounded', 'Confirmed', 'Discrepancies', 'Commission Paid'];
    $scope.allowedStoreStatusMap = {};
    $scope.reconciliationList = [];
    $scope.allCheckboxesSelected = false;
    $scope.actionToExecute = null;
    $scope.instancesForActionExecution = {};
    $scope.isSearch = false;

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    };

    $scope.toggleColumnView = function(columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.updateOrderBy = function(orderName) {
      $scope.tableSortTitle = ($scope.tableSortTitle === orderName) ? ('-' + $scope.tableSortTitle) : (orderName);
    };

    $scope.doesInstanceContainAction = function(instance, actionName) {
      if (!instance.actions) {
        return false;
      }

      return instance.actions.indexOf(actionName) >= 0;
    };

    $scope.getSortingType = function(orderName) {
      if ($scope.tableSortTitle === orderName) {
        return 'ascending';
      } else if ($scope.tableSortTitle === '-' + orderName) {
        return 'descending';
      }

      return 'none';
    };

    $scope.getArrowIconAndClassForSorting = function(orderName) {
      var sortTypeToArrowTypeMap = {
        ascending: 'fa fa-sort-asc active',
        descending: 'fa fa-sort-desc active',
        none: 'fa fa-sort text-muted-light'
      };
      var sortType = $scope.getSortingType(orderName);
      return sortTypeToArrowTypeMap[sortType];
    };

    $scope.filterReconciliationList = function(item) {
      return $scope.allowedStoreStatusList.indexOf(item.statusName) > -1;
    };

    this.getStoreStatusNameById = function(storeStatusId) {
      return ($scope.allowedStoreStatusMap[storeStatusId]) ? $scope.allowedStoreStatusMap[storeStatusId].statusName :
        null;
    };

    this.getValueByIdInArray = function(id, valueKey, array) {
      var matchedObject = lodash.findWhere(array, {
        id: id
      });
      if (matchedObject) {
        return matchedObject[valueKey];
      }

      return '';
    };

    this.normalizeReconciliationDataList = function(dataFromAPI) {
      if (!dataFromAPI) {
        return [];
      }

      return dataFromAPI.map(function(item) {
        item.dispatchStationCode = $this.getValueByIdInArray(item.cateringStationId, 'code', $scope.stationList);
        item.inboundStationCode = $this.getValueByIdInArray(item.inboundStationId, 'code', $scope.stationList);
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

    this.recalculateActionsColumn = function(item) {
      var actions = [];

      actions.push('Reports');

      $this.recalculateActionsForInboundStatus(item, actions);
      $this.recalculateActionsForConfirmedStatus(item, actions);
      $this.recalculateActionsForDiscrepanciesStatus(item, actions);

      item.actions = actions;
    };

    this.recalculateActionsForInboundStatus = function(item, actions) {
      if (item.statusName === 'Inbounded') {
        actions.push('Validate');

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

    this.recalculateActionsForConfirmedStatus = function(item, actions) {
      if (item.statusName === 'Confirmed') {
        actions.push(
          'Review',
          'Pay Commission',
          'Unconfirm'
        );
      }
    };

    this.recalculateActionsForDiscrepanciesStatus = function(item, actions) {
      if (item.statusName === 'Discrepancies') {
        actions.push(
          'Validate',
          'Review',
          'Confirm'
        );
      }
    };

    this.getReconciliationPrecheckDevices = function(item) {
      reconciliationFactory.getReconciliationPrecheckDevices({
        storeInstanceId: item.id
      }).then(function(response) {
        var dataFromAPI = angular.copy(response);
        item.eposData = (dataFromAPI.devicesSynced || dataFromAPI.totalDevices) ? dataFromAPI.devicesSynced +
          '/' + dataFromAPI.totalDevices : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.getReconciliationPrecheckSchedules = function(item) {
      reconciliationFactory.getReconciliationPrecheckSchedules({
        storeInstanceId: item.id
      }).then(function(response) {
        var dataFromAPI = angular.copy(response);
        item.postTripData = (dataFromAPI.postTripScheduleCount || dataFromAPI.eposScheduleCount) ? dataFromAPI.postTripScheduleCount +
          '/' + dataFromAPI.eposScheduleCount : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.getReconciliationPrecheckCashbags = function(item) {
      reconciliationFactory.getReconciliationPrecheckCashbags({
        storeInstanceId: item.id
      }).then(function(response) {
        var dataFromAPI = angular.copy(response);
        item.cashHandlerData = (dataFromAPI.cashHandlerCashbagCount || dataFromAPI.totalCashbagCount) ?
          dataFromAPI.cashHandlerCashbagCount + '/' + dataFromAPI.totalCashbagCount : 'No';
        $this.recalculateActionsColumn(item);
      });
    };

    this.populateLazyColumns = function() {
      angular.forEach($scope.reconciliationList, function(item) {
        $this.getReconciliationPrecheckDevices(item);
        $this.getReconciliationPrecheckSchedules(item);
        $this.getReconciliationPrecheckCashbags(item);
      });
    };

    this.attachReconciliationDataListToScope = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      $scope.reconciliationList = $scope.reconciliationList.concat($this.normalizeReconciliationDataList(
        dataFromAPI.response));
      $scope.reconciliationList = $scope.reconciliationList.filter(function(item) {
        return $scope.filterReconciliationList(item);
      });

      $this.populateLazyColumns();
      hideLoadingBar();
      $this.hideLoadingModal();
    };

    this.getReconciliationDataList = function() {
      $scope.reconciliationList = [];
      $scope.displayError = false;
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };
      reconciliationFactory.getReconciliationDataList(payload).then(function(dataFromAPI) {
        $this.attachReconciliationDataListToScope(angular.copy(dataFromAPI));
      }, function() {

        $this.hideLoadingModal();
      });
    };

    this.filterAvailableStoreStatus = function(item) {
      return $scope.allowedStoreStatusList.indexOf(item.statusName) > -1;
    };

    var loadingProgress = false;
    var lastStartDate = null;
    var lastEndDate = null;

    function searchReconciliationDataList(startDate, endDate) {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      if ($scope.stationList === null) {
        return;
      }

      if (loadingProgress) {
        return;
      }

      loadingProgress = true;

      showLoadingBar();
      $this.fixSearchDropdowns($scope.search);

      var payload = lodash.assign(payloadUtility.serializeDates($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      if (startDate) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }

      lastStartDate = payload.startDate;
      lastEndDate = payload.endDate;

      reconciliationFactory.getReconciliationDataList(payload).then(function(dataFromAPI) {
        $this.attachReconciliationDataListToScope(dataFromAPI);
        loadingProgress = false;
      });

      $this.meta.offset += $this.meta.limit;
    }

    function resetReconciliationList() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.reconciliationList = [];
    }

    $scope.searchReconciliationDataList = function() {
      $scope.isSearch = true;
      resetReconciliationList();
      searchReconciliationDataList();
    };

    $scope.getReconciliationDataList = function() {
      searchReconciliationDataList(lastStartDate, lastEndDate);
    };

    this.setStationList = function(dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
      searchReconciliationDataList(dateUtility.formatDateForAPI(dateUtility.nowFormatted()));
      $this.hideLoadingModal();
    };

    this.storeStatusListSuccess = function(responseFromAPI) {
      var dataFromAPI = angular.copy(responseFromAPI);
      dataFromAPI.filter($this.filterAvailableStoreStatus)
        .forEach(function(item) {
          $scope.allowedStoreStatusMap[item.id] = item;
        });

      stationsService.getGlobalStationList().then($this.setStationList);
    };

    this.getStoreStatusList = function() {
      $this.showLoadingModal('Loading Data');
      reconciliationFactory.getStoreStatusList().then($this.storeStatusListSuccess);
    };

    this.fixSearchDropdowns = function(search) {
      if (search.cateringStationId === '') {
        search.cateringStationId = null;
      }

      if (search.arrivalStationCode === '') {
        search.arrivalStationCode = null;
      }

      if (search.statusId === '') {
        search.statusId = null;
      }
    };

    $scope.clearSearchForm = function() {
      $scope.search = {
        startDate: dateUtility.dateNumDaysBeforeTodayFormatted(10),
        endDate: dateUtility.dateNumDaysBeforeTodayFormatted(2)
      };
      $scope.searchReconciliationDataList();
    };

    $scope.highlightSelected = function(item) {
      return item.selected ? 'active' : '';
    };

    $scope.hasSelectedInstance = function() {
      return $scope.reconciliationList.filter(function(item) {
        return item.selected === true;
      }).length > 0;
    };

    $scope.hasSelectedInstanceWithStatus = function(status) {
      var hasSelectedInstance = $scope.reconciliationList.filter(function(item) {
        return item.selected === true;
      }).length;
      var hasStatusSelected = $scope.reconciliationList.filter(function(item) {
        return item.statusName === status && item.selected === true;
      }).length;
      return (hasStatusSelected === hasSelectedInstance && hasSelectedInstance > 0 && hasStatusSelected > 0);
    };

    $scope.canHaveInstanceCheckbox = function(instance) {
      return $scope.doesInstanceContainAction(instance, 'Validate') || $scope.doesInstanceContainAction(instance,
        'Pay Commission');
    };

    $scope.toggleAllCheckboxes = function() {
      angular.forEach($scope.reconciliationList, function(item) {
        if ($scope.canHaveInstanceCheckbox(item)) {
          item.selected = $scope.allCheckboxesSelected;
        }
      });
    };

    $scope.viewReview = function(instance) {
      $location.path('/reconciliation-discrepancy-detail/' + instance.id);
    };

    $scope.showExecuteActionModal = function(instance, action) {
      $scope.instancesForActionExecution = [instance];
      $scope.actionToExecute = action;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.showBulkExecuteActionModal = function(action) {
      $scope.instancesForActionExecution = $this.findSelectedInstances();
      $scope.actionToExecute = action;

      angular.element('.delete-warning-modal').modal('show');
    };

    this.handleResponseError = function(responseFromAPI) {
      $this.hideLoadingModal();
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    };

    this.handleActionExecutionSuccess = function() {
      if ($scope.isSearch) {
        $scope.searchReconciliationDataList();
      } else {
        resetReconciliationList();
        $this.getStoreStatusList();
      }
    };

    this.executeValidateAction = function() {
      var inboundedInstances = $this.findInstancesWithStatus('Inbounded');
      var discrepanciesInstances = $this.findInstancesWithStatus('Discrepancies');

      var instancesToExecuteOn = inboundedInstances.concat(discrepanciesInstances);

      $this.showLoadingModal('Executing Validate action');

      var payload = {
        ids: []
      };

      payload.ids = instancesToExecuteOn.map(function(storeInstance) {
        return storeInstance.id;
      });

      storeInstanceFactory.validateStoreInstance(payload).then($this.handleActionExecutionSuccess, $this.handleActionExecutionSuccess);
    };

    this.executeOtherAction = function() {
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

      $this.showLoadingModal('Executing ' + $scope.actionToExecute + ' action');

      var promises = [];
      angular.forEach(instancesToExecuteOn, function(instance) {
        promises.push(storeInstanceFactory.updateStoreInstanceStatus(instance.id, status));
      });

      $q.all(promises).then($this.handleActionExecutionSuccess, $this.handleResponseError);
    };

    $scope.executeAction = function() {
      $scope.displayError = false;
      angular.element('.delete-warning-modal').modal('hide');

      if ($scope.actionToExecute === 'Validate') {
        $this.executeValidateAction();
      } else {
        $this.executeOtherAction();
      }
    };

    $scope.validate = function() {
      $scope.instancesForActionExecution = $this.findSelectedInstances();
      $scope.displayError = false;

      $this.executeValidateAction();
    };

    this.findInstancesWithStatus = function(status) {
      return $scope.instancesForActionExecution.filter(function(instance) {
        return instance.statusName === status;
      });
    };

    this.findSelectedInstances = function() {
      return $scope.reconciliationList.filter(function(instance) {
        return instance.selected === true;
      });
    };

    this.init = function() {
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

      $this.getStoreStatusList();
    };

    this.init();

  });
