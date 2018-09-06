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
  .controller('ReconciliationDashboardCtrl', function($q, $scope, dateUtility, catererStationService,
                                                      reconciliationFactory, payloadUtility, $location, storeInstanceFactory, lodash, $localStorage, accessService) {

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
    $scope.reconciliationList = null;
    $scope.allCheckboxesSelected = false;
    $scope.actionToExecute = null;
    $scope.instancesForActionExecution = {};
    $scope.isSearch = false;

    this.defaultSearch = {
      startDate: dateUtility.dateNumDaysBeforeTodayFormatted(10),
      endDate: dateUtility.dateNumDaysBeforeTodayFormatted(2)
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    $scope.shouldShowSearchPrompt = function () {
      return !$scope.reconciliationList && !$scope.loadingBarVisible;
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !$scope.loadingBarVisible && angular.isDefined($scope.reconciliationList) && $scope.reconciliationList !== null && $scope.reconciliationList.length <= 0;
    };

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
        item.isEcb = (item.isEcb) ? 'Yes' : 'No';
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
      $this.recalculateActionsForCommissionPaidStatus(item, actions);

      item.actions = actions;
    };

    function isShowForceReconcile (data) {
      if (data && data.toLowerCase() === 'no') {
        return true;
      }

      if (data && data.indexOf('\/') > -1) {
        var arrayEposData = data.split('\/');
        return (arrayEposData !== null && arrayEposData.length === 2 && arrayEposData[0] !== arrayEposData[1]);
      }

      return false;
    }

    this.recalculateActionsForInboundStatus = function(item, actions) {
      if (item.statusName === 'Inbounded') {
        actions.push('Validate');

        if (isShowForceReconcile(item.eposData) || isShowForceReconcile(item.postTripData) || isShowForceReconcile(item.cashHandlerData)) {
          actions.push('ForceReconcile');
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

    this.recalculateActionsForConfirmedStatus = function(item, actions) {
      if (item.statusName === 'Confirmed') {
        actions.push(
          'Review',
          'Pay Commission',
          'Unconfirm',
          'Amend Data'
        );
      }
    };

    this.recalculateActionsForDiscrepanciesStatus = function(item, actions) {
      if (item.statusName === 'Discrepancies') {
        actions.push(
          'Validate',
          'Review',
          'Confirm',
          'Amend Data'
        );
      }
    };

    this.recalculateActionsForCommissionPaidStatus = function(item, actions) {
      if (item.statusName === 'Commission Paid') {
        actions.push(
          'Amend Data'
        );
      }
    };

    $scope.requiresAmendVerification = function (storeInstance) {
      return storeInstance.requiresAmendVerification;
    };

    this.normalizePrecheckDevices = function (item) {
      item.eposDataFullDetails = angular.copy(item.precheckDevices);

      item.iseposDataDetailsValid = item.eposDataFullDetails && (item.eposDataFullDetails.devicesSynced || item.eposDataFullDetails.totalDevices);
      item.eposData = (item.iseposDataDetailsValid) ? item.eposDataFullDetails.devicesSynced + '/' + item.eposDataFullDetails.totalDevices : 'No';

      $this.recalculateActionsColumn(item);
    };

    $scope.showEposDataDetailsModal = function (item) {
      if (!item.devices) {
        return;
      }

      $scope.currentModalDevices = angular.copy(item.devices);

      angular.element('#eposDataDetailsModal').modal('show');
    };

    this.normalizePrecheckSchedules = function (item) {
      var dataFromAPI = angular.copy(item.precheckSchedules);
      item.postTripData = (item.precheckSchedules && (dataFromAPI.postTripScheduleCount || dataFromAPI.eposScheduleCount)) ? dataFromAPI.postTripScheduleCount +
        '/' + dataFromAPI.eposScheduleCount : 'No';

      $this.recalculateActionsColumn(item);
    };

    this.normalizePrecheckCashbags = function (item) {
      var dataFromAPI = angular.copy(item.precheckCashbags);
      item.cashHandlerData = (item.precheckCashbags && (dataFromAPI.cashHandlerCashbagCount || dataFromAPI.totalCashbagCount)) ?
        dataFromAPI.cashHandlerCashbagCount + '/' + dataFromAPI.totalCashbagCount : 'No';
      $this.recalculateActionsColumn(item);
    };

    this.attachReconciliationDataListToScope = function(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      $scope.reconciliationList = $scope.reconciliationList || [];
      $scope.reconciliationList = $scope.reconciliationList.concat($this.normalizeReconciliationDataList(dataFromAPI.response));
      $scope.reconciliationList = lodash.filter($scope.reconciliationList, function(item) {
        return $scope.filterReconciliationList(item);
      });

      $scope.reconciliationList = $scope.reconciliationList.map(function (item) {
        $this.normalizePrecheckDevices(item);
        $this.normalizePrecheckSchedules(item);
        $this.normalizePrecheckCashbags(item);

        return item;
      });

      hideLoadingBar();
      $this.hideLoadingModal();
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
      $localStorage.search.reconciliationDashboard = angular.copy($scope.search);

      $this.fixSearchDropdowns($scope.search);

      var payload = lodash.assign(payloadUtility.serializeDates($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        includePrechecks: true
      });
      if (startDate) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }

      lastStartDate = payload.startDate;
      lastEndDate = payload.endDate;

      // Filter by allowed stations only
      if (!payload.statusId) {
        payload.statusIds = Object.keys($scope.allowedStoreStatusMap).join(',');
      }

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
      if (!$scope.reconciliationList) {
        return;
      }

      searchReconciliationDataList(lastStartDate, lastEndDate);
    };

    this.setStationList = function(dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);

      if (lodash.keys($scope.search).length > 0) {
        searchReconciliationDataList();
      } else {
        $scope.search = angular.copy($this.defaultSearch);
      }

      $this.hideLoadingModal();
    };

    this.storeStatusListSuccess = function(responseFromAPI) {
      var dataFromAPI = angular.copy(responseFromAPI);
      dataFromAPI.filter($this.filterAvailableStoreStatus)
        .forEach(function(item) {
          $scope.allowedStoreStatusMap[item.id] = item;
        });

      catererStationService.getCatererStationList().then($this.setStationList);
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
      $scope.search = {};
      $scope.reconciliationList = null;
      $localStorage.search.reconciliationDashboard = {};
    };

    $scope.highlightSelected = function(item) {
      return item.selected ? 'active' : '';
    };

    $scope.hasSelectedInstance = function() {
      return lodash.filter($scope.reconciliationList, function(item) {
          return item.selected === true;
        }).length > 0;
    };

    $scope.hasSelectedInstancesWithRequiresAmendVerification = function () {
      return lodash.filter($scope.reconciliationList, function(item) {
          return item.selected === true && item.requiresAmendVerification === true;
        }).length > 0;
    };

    $scope.hasSelectedInstanceWithStatus = function(status) {
      var hasSelectedInstance = lodash.filter($scope.reconciliationList, function(item) {
        return item.selected === true;
      }).length;
      var hasStatusSelected = lodash.filter($scope.reconciliationList, function(item) {
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

    $scope.viewView = function(instance) {
      $location.path('/reconciliation-discrepancy-detail/view/' + instance.id);
    };

    $scope.viewAmendData = function(instance) {
      $location.path('/store-instance-amend/' + instance.id);
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

    this.handForceReconciliationleResponseError = function(responseFromAPI) {
      if ($scope.isSearch) {
        $scope.searchReconciliationDataList();
      } else {
        resetReconciliationList();
        $this.getStoreStatusList();
      }

      $this.hideLoadingModal();
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
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

    function handleForceReconcileActionExecutionSuccess(instance) {
      if (!instance.amendToConfirm) {
        $scope.instancesForActionExecution = [instance];
        $scope.actionToExecute = 'Confirmed';
        var status = 10;
        var pr = [
          storeInstanceFactory.updateStoreInstanceStatus(instance.id, status, false)
        ];
        $q.all(pr).then($this.handleActionExecutionSuccess, $this.handleActionExecutionSuccess);
      } else {
        $this.handleActionExecutionSuccess();
      }
    }

    $scope.forceReconcile = function(instance, action) {
      $this.showLoadingModal('Force Reconcile action');
      $scope.instancesForActionExecution = [instance];
      $scope.actionToExecute = action;
      var status = 9;
      var promises = [
        storeInstanceFactory.updateStoreInstanceStatusForceReconcile(instance.id, status)
      ];
      $q.all(promises).then(function() { handleForceReconcileActionExecutionSuccess(instance); }, $this.handleResponseError);
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
        promises.push(storeInstanceFactory.updateStoreInstanceStatus(instance.id, status, true));
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
      return lodash.filter($scope.reconciliationList, function(instance) {
        return instance.selected === true;
      });
    };

    this.getSearchFromLocalStorage = function () {
      var savedSearch = $localStorage.search;
      if (angular.isDefined(savedSearch)) {
        $scope.search = savedSearch.reconciliationDashboard || {};
      } else {
        $scope.search = {};
        $localStorage.search = {};
      }
    };

    this.init = function() {
      $scope.tableSortTitle = '[scheduleDate, storeNumber, storeInstanceId, dispatchedStation, receivedStation]';
      $scope.isPayCommision = accessService.crudAccessGranted('RECONCILIATION', 'RECONCILIATION', 'RPCSI');
      $scope.isConfirm = accessService.crudAccessGranted('RECONCILIATION', 'RECONCILIATION', 'RUCSI');
      $scope.displayColumns = {
        receivedStation: false,
        storeInstanceId: false,
        updatedDate: false,
        updatedBy: false
      };

      $this.getSearchFromLocalStorage();
      $this.getStoreStatusList();
    };

    this.init();

  });

angular.module('ts5App').filter('reconciliationBooleanToCheckedIcon', function () {
  return function (booleanValue) {
    if (booleanValue) {
      return '<i class="checked-green" aria-hidden="true" ></i>';
    } else {
      return '<i class="unchecked-red" aria-hidden="true" ></i>';
    }
  };
});
