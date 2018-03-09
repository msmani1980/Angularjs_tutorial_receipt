'use strict';

/* global moment */

// jshint maxcomplexity:6
/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceDashboardCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceDashboardCtrl',
  function ($scope, $q, $route, $location, $filter, $localStorage, storeInstanceDashboardFactory, storeTimeConfig,
            lodash, dateUtility, storeInstanceDashboardActionsConfig, ENV, identityAccessFactory, messageService, accessService) {

    $scope.viewName = 'Store Instance Dashboard';
    $scope.stationList = [];
    $scope.storeInstanceList = null;
    $scope.storeStatusList = [];
    $scope.filteredStoreStatusList = [];
    $scope.timeConfigList = [];
    $scope.search = {};
    $scope.allCheckboxesSelected = false;
    $scope.allScheduleDetailsExpanded = false;
    $scope.openStoreInstanceId = -1;
    $scope.hasSelectedStore = false;
    $scope.exportBulkURL = '';
    $scope.storeInstanceToDelete = {};
    $scope.allowedStatusNamesForDisplay = ['Ready for Packing', 'Ready for Seals', 'Ready for Dispatch', 'Dispatched',
      'On Floor', 'Inbounded'
    ];
    $scope.allAllowedStatuses = ['Ready for Packing', 'Ready for Seals', 'Ready for Dispatch', 'Dispatched',
      'On Floor', 'Inbounded', 'Unpacking', 'Inbound Seals'
    ];
    $scope.statusesThatShouldBeConsideredAsInbounded = ['Discrepancies', 'Confirmed', 'Commission Paid'];
    $scope.allowedStatusNamesForDelete = ['Ready for Packing', 'Ready for Seals', 'Ready for Dispatch'];

    var initDone = false;

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingModal(text) {
      $this.isLoading = true;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      $this.isLoading = false;
      angular.element('#loading').modal('hide');
    }

    function showLoadingBar() {
      $this.isLoading = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $this.isLoading = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function showErrors(dataFromAPI) {
      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    }

    $scope.shouldShowLoadingAlert = function () {
      return (angular.isDefined($scope.storeInstanceList) && $scope.storeInstanceList !== null && $this.meta.offset < $this.meta.count);
    };

    $scope.shouldShowSearchPrompt = function () {
      return !$scope.storeInstanceList;
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !$this.isLoading && angular.isDefined($scope.storeInstanceList) && $scope.storeInstanceList !== null && $scope.storeInstanceList.length <= 0;
    };

    function getValueByIdInArray(id, valueKey, array) {
      var matchedObject = lodash.findWhere(array, {
        id: id
      });
      if (matchedObject) {
        return matchedObject[valueKey];
      }

      return '';
    }

    function getIdByValueInArray(value, valueKey, array) {
      var searchCriteria = {};
      searchCriteria[valueKey] = value;
      var matchedObject = lodash.findWhere(array, searchCriteria);
      if (matchedObject) {
        return matchedObject.id;
      }

      return '';
    }

    var SEARCH_TO_PAYLOAD_MAP = {
      dispatchLMPStation: 'cateringStationId',
      inboundLMPStation: 'inboundStationId',
      storeNumber: 'storeNumber',
      scheduleStartDate: 'startDate',
      scheduleEndDate: 'endDate',
      departureStations: 'departureStationCode',
      arrivalStations: 'arrivalStationCode',
      storeInstance: 'storeInstanceId',
      storeStatusId: 'statusId'
    };

    $scope.doesStoreInstanceHaveReplenishments = function (store) {
      return (store.replenishments && store.replenishments.length > 0);
    };

    $scope.isStoreViewExpanded = function (store) {
      return ($scope.openStoreInstanceId === store.id);
    };

    function openAccordion(storeInstance) {
      angular.element('#store-' + storeInstance.id).addClass('open-accordion');
    }

    function closeAccordion() {
      angular.element('#store-' + $scope.openStoreInstanceId).removeClass('open-accordion');
      $scope.openStoreInstanceId = -1;
    }

    $scope.toggleAccordionView = function (storeInstance) {
      if (!$scope.doesStoreInstanceHaveReplenishments(storeInstance)) {
        return;
      }

      if ($scope.openStoreInstanceId === storeInstance.id) {
        closeAccordion();
      } else {
        openAccordion(storeInstance);
        closeAccordion();
        $scope.openStoreInstanceId = storeInstance.id;
      }
    };

    $scope.shouldShowReplenishAction = function (storeInstance, parentStoreInstance, actionName) {
      var statusNumber = getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
      var parentStatusNumber = getValueByIdInArray(parentStoreInstance.statusId, 'name', $scope.storeStatusList);
      var isAfterDispatch = parseInt(statusNumber) >= 4;
      var isParentOnFloor = parseInt(parentStatusNumber) >= 5;

      if ((isParentOnFloor || isAfterDispatch) && (actionName !== 'Get Flight Docs')) {
        return false;
      }

      return $scope.doesStoreInstanceContainAction(storeInstance, actionName);
    };

    $scope.doesStoreInstanceContainAction = function (storeInstance, actionName) {
      if (!storeInstance.actionButtons) {
        return false;
      }

      return storeInstance.actionButtons.indexOf(actionName) >= 0;
    };

    $scope.doesRepleshinStoreInstanceContainAction = function (storeInstance, parentStoreInstance, actionName) {
      if (!storeInstance.actionButtons) {
        return false;
      }

      var parentStatusNumber = getValueByIdInArray(parentStoreInstance.statusId, 'name', $scope.storeStatusList);
      return (storeInstance.actionButtons.indexOf(actionName) >= 0 && parseInt(parentStatusNumber) !== 8);
    };

    function deleteSuccessHandler() {
      var storeInstance = angular.copy($scope.storeInstanceToDelete);
      var message = sprintf('Store #%s, with Schedule Date %s and Store Instance %s is deleted', storeInstance.storeNumber,
        storeInstance.scheduleDate, storeInstance.id);

      angular.element('#store-' + $scope.storeInstanceToDelete.id).remove();

      messageService.display(
        'success',
        '<strong>Success</strong> - ' + message
      );
    }

    function deleteErrorHandler() {
      messageService.display(
        'danger',
        '<strong>Error</strong> - Couldn\'t delete store instance'
      );
    }

    function deleteStoreInstance(storeInstanceId) {
      storeInstanceDashboardFactory.deleteStoreInstance(storeInstanceId).then(deleteSuccessHandler,
        deleteErrorHandler);
    }

    $scope.showDeleteConfirmation = function (storeInstance) {
      $scope.storeInstanceToDelete = storeInstance;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteStoreInstance = function () {
      angular.element('.delete-warning-modal').modal('hide');

      deleteStoreInstance($scope.storeInstanceToDelete.id);
    };

    $scope.canBeDeleted = function (storeInstance) {
      return $scope.allowedStatusNamesForDelete.indexOf(storeInstance.statusName) > -1;
    };

    $scope.storeSelectionToggled = function () {
      var selectedStores = [];
      lodash.forEach($scope.storeInstanceList, function (store) {
        if (store.selected && $scope.doesStoreInstanceContainAction(store, 'Get Flight Docs')) {
          selectedStores.push(store);
        }

        selectedStores = selectedStores.concat(lodash.filter(store.replenishments, function (replenish) {
          return replenish.selected && $scope.doesStoreInstanceContainAction(replenish, 'Get Flight Docs');
        }));
      });

      $scope.hasSelectedStore = (selectedStores.length !== 0);
      if ($scope.hasSelectedStore) {
        var storeInstanceIds = lodash.map(selectedStores, function (item) {
          return item.id;
        }).join('+');
        var sessionToken = identityAccessFactory.getSessionObject().sessionToken;

        $scope.exportBulkURL = ENV.apiUrl + '/rsvr-pdf/api/dispatch/store-instances/documents/C208.pdf?sessionToken=' +
          sessionToken;
        $scope.exportBulkURL += '&storeInstanceIds=' + storeInstanceIds;
      } else {
        $scope.exportBulkURL = '';
      }
    };

    $scope.toggleAllCheckboxes = function () {
      angular.forEach($scope.storeInstanceList, function (store) {
        if ($scope.doesStoreInstanceContainAction(store, 'Checkbox')) {
          store.selected = $scope.allCheckboxesSelected;
        }

        lodash.forEach(store.replenishments, function (replenish) {
          replenish.selected = $scope.allCheckboxesSelected;
        });
      });

      $scope.storeSelectionToggled();
    };

    $scope.isScheduleDetailOpen = function (id) {
      return !(angular.element('.scheduleDetails-' + id).hasClass('accordion-cell-closed'));
    };

    $scope.toggleScheduleDetails = function (id) {
      angular.element('.scheduleDetails-' + id).toggleClass('accordion-cell-closed');
    };

    $scope.toggleAllScheduleInfo = function () {
      $scope.allScheduleDetailsExpanded = !$scope.allScheduleDetailsExpanded;
      angular.forEach($scope.storeInstanceList, function (store) {
        var storeClass = '.scheduleDetails-' + store.id;
        var closedClass = 'accordion-cell-closed';

        if ($scope.allScheduleDetailsExpanded && !$scope.isScheduleDetailOpen(store.id)) {
          angular.element(storeClass).removeClass(closedClass);
        } else if (!$scope.allScheduleDetailsExpanded && $scope.isScheduleDetailOpen(store.id)) {
          angular.element(storeClass).addClass(closedClass);
        }
      });
    };

    $scope.isUndispatchPossible = function (store) {
      var storeUpdatedDate = moment.utc(store.updatedOn, 'YYYY-MM-DD HH:mm:ss.SSSSSS');
      var hoursSinceUpdatedDate = moment.duration(moment.utc().diff(storeUpdatedDate)).asHours();
      var isNowWithinAllowedHours = hoursSinceUpdatedDate > 0 && hoursSinceUpdatedDate < store.hours;
      return ((store.hours === -1) || isNowWithinAllowedHours) && !$scope.doesStoreInstanceHaveReplenishments(store);
    };

    $scope.undispatch = function (id, isReplenishment) {
      var undispatchStatusId = 1;
      var undispatchRoute = isReplenishment ? 'store-instance-packing/replenish/' + id : 'store-instance-packing/dispatch/' + id;
      showLoadingModal('Undispatching store instance ' + id + '...');
      storeInstanceDashboardFactory.updateStoreInstanceStatusUndispatch(id, undispatchStatusId, true).then(function () {
        hideLoadingModal();
        $location.path(undispatchRoute);
      }, showErrors);
    };

    var STATUS_TO_BUTTONS_MAP = {
      1: ['Pack'],
      2: ['Seal'],
      3: ['Dispatch', 'Offload', 'Checkbox', 'Inbounded', 'On Floor'],
      4: ['Receive', 'Get Flight Docs', 'Replenish', 'Un-dispatch', 'Checkbox'],
      5: ['End Instance', 'Redispatch', 'Get Flight Docs', 'Checkbox'],
      6: ['Start Inbound Seals', 'Get Flight Docs', 'Checkbox'],
      7: ['Start Offload', 'Get Flight Docs', 'Checkbox'],
      8: ['Get Flight Docs', 'Checkbox']
    };

    function setFlightDocsConditions(storeInstance) {
      if (lodash.find(storeInstance.actionButtons, lodash.matches('Get Flight Docs')) || storeInstance.statusName === 'On Floor') {
        storeInstance.showGenerateDocsButton = true;

        var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
        storeInstance.exportURL = ENV.apiUrl + '/rsvr-pdf/api/dispatch/store-instances/documents/C208-' + storeInstance.id +
          '.pdf?sessionToken=' + sessionToken;
      }
    }

    function setStoreInstanceTime(storeInstance) {
      var timeConfig = lodash.filter($scope.timeConfigList, {
        featureId: $scope.undispatchFeatureId
      })[0];

      storeInstance.hours = (angular.isDefined(timeConfig)) ? timeConfig.hours : -1;
    }

    function setStoreInstanceStatusName(storeInstance) {
      return getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
    }

    function setStoreInstanceActionButtons(storeInstance) {
      var statusName = setStoreInstanceStatusName(storeInstance);
      storeInstance.actionButtons = STATUS_TO_BUTTONS_MAP[statusName];
    }

    function setStoreInstanceTamperedFlag(storeInstance) {
      var statusNumber = parseInt(storeInstance.statusNumber);
      var inboundedStatus = lodash.findWhere($scope.storeStatusList, { statusName: 'Inbounded' });
      var inboundedStatusNumber = angular.isDefined(inboundedStatus) ? parseInt(inboundedStatus.name) : 0;
      var tamperedFlagAsString = (storeInstance.tampered) ? 'Yes' : 'No';
      storeInstance.tamperedFlag = (statusNumber >= inboundedStatusNumber) ? tamperedFlagAsString : '';
    }

    function formatStoreInstance(storeInstance) {
      storeInstance.dispatchStationCode = getValueByIdInArray(storeInstance.cateringStationId, 'code', $scope.stationList);
      storeInstance.inboundStationCode = getValueByIdInArray(storeInstance.inboundStationId, 'code', $scope.stationList);
      storeInstance.storeNumber = getValueByIdInArray(storeInstance.storeId, 'storeNumber', $scope.storesList);
      storeInstance.statusNumber = getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
      storeInstance.statusName = getValueByIdInArray(storeInstance.statusId, 'statusName', $scope.storeStatusList);
      storeInstance.statusName = (storeInstance.statusName === 'Unpacking' || storeInstance.statusName ===
      'Inbound Seals') ? 'On Floor' : storeInstance.statusName;
      storeInstance.scheduleDateApi = angular.copy(storeInstance.scheduleDate);
      storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);
      storeInstance.updatedOnDisplay = storeInstance.updatedOn ? dateUtility.formatTimestampForApp(storeInstance.updatedOn) : '';
      storeInstance.inboundedOnDisplay = storeInstance.inboundedOn ? dateUtility.formatTimestampForApp(storeInstance.inboundedOn) : '';

      setStoreInstanceTime(storeInstance);
      setStoreInstanceActionButtons(storeInstance);
      setFlightDocsConditions(storeInstance);
      setStoreInstanceTamperedFlag(storeInstance);

      storeInstance.selected = false;
    }

    function mapStoreInstanceThatSHouldBeCOnsideredAsList(storeInstanceList) {
      var storeInstanceInboundedStatus = lodash.findWhere($scope.storeStatusList, { statusName: 'Inbounded' });

      return lodash.map(angular.copy(storeInstanceList), function (storeInstance) {
        if (!storeInstance) {
          return false;
        }

        var storeInstaceStatus = lodash.findWhere($scope.storeStatusList, { id: storeInstance.statusId });
        var doesStoreInstanceNeedsToBeMappedToInboundedStatus = lodash.indexOf($scope.statusesThatShouldBeConsideredAsInbounded, storeInstaceStatus.statusName) >= 0;

        if (doesStoreInstanceNeedsToBeMappedToInboundedStatus) {
          storeInstance.statusId = storeInstanceInboundedStatus.id;
        }

        return storeInstance;
      });
    }

    $scope.getUpdateByForStoreInstance = function (storeInst) {

      var doesStoreInstanceNeedsToBeMappedToInboundedStatus = lodash.indexOf($scope.statusesThatShouldBeConsideredAsInbounded, storeInst.storeStatus.code) >= 0;

      if (doesStoreInstanceNeedsToBeMappedToInboundedStatus) {
        return storeInst.inboundedByPerson ? storeInst.inboundedByPerson.userName : '';
      }

      return (storeInst.updatedByPerson) ? storeInst.updatedByPerson.userName : storeInst.createdByPerson.userName;
    };

    $scope.getUpdatedOnForStoreInstance = function (storeInst) {

      var doesStoreInstanceNeedsToBeMappedToInboundedStatus = lodash.indexOf($scope.statusesThatShouldBeConsideredAsInbounded, storeInst.storeStatus.code) >= 0;

      if (doesStoreInstanceNeedsToBeMappedToInboundedStatus) {
        return storeInst.inboundedOnDisplay;
      }

      return storeInst.updatedOnDisplay;
    };

    function filterStoreInstanceList(storeInstanceList) {
      return lodash.filter(angular.copy(storeInstanceList), function (storeInstance) {
        if (!storeInstance) {
          return false;
        }

        var storeInstanceName = getValueByIdInArray(storeInstance.statusId, 'statusName', $scope.storeStatusList);
        return lodash.indexOf($scope.allAllowedStatuses, storeInstanceName) >= 0;
      });
    }

    function formatStoreInstanceList(rawStoreInstanceList) {
      var mappedStoreInstacesToBeConsideredAsInbounded = mapStoreInstanceThatSHouldBeCOnsideredAsList(rawStoreInstanceList);
      var filteredStoreInstanceList = filterStoreInstanceList(mappedStoreInstacesToBeConsideredAsInbounded);
      angular.forEach(filteredStoreInstanceList, function (storeInstance) {
        formatStoreInstance(storeInstance);
        angular.forEach(storeInstance.replenishments, function (storeInstance) {
          formatStoreInstance(storeInstance);
        });
      });

      return filteredStoreInstanceList;
    }

    function dispatchStoreInstance(storeId) {
      return storeInstanceDashboardFactory.updateStoreInstanceStatus(storeId, '4');
    }

    function getStoreInstanceListSuccess(dataFromAPI) {
      var rawStoreInstanceList = angular.copy(dataFromAPI.response);
      var formattedInstanceList = formatStoreInstanceList(rawStoreInstanceList);
      $scope.storeInstanceList = $scope.storeInstanceList || [];
      $scope.storeInstanceList = $scope.storeInstanceList.concat(formattedInstanceList);
      $scope.storeInstanceList = $filter('orderBy')($scope.storeInstanceList, ['scheduleDateApi', 'storeNumber',
        'scheduleNumber'
      ]);
    }

    function getStationListSuccess(dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
    }

    function getStationList() {
      return storeInstanceDashboardFactory.getStationList().then(getStationListSuccess);
    }

    function getStoresListSuccess(dataFromAPI) {
      $scope.storesList = angular.copy(dataFromAPI.response);
    }

    function getStoresList() {
      return storeInstanceDashboardFactory.getStoresList({}).then(getStoresListSuccess);
    }

    function getStatusListSuccess(dataFromAPI) {
      $scope.storeStatusList = angular.copy(dataFromAPI);
      $scope.filteredStoreStatusList = lodash.filter($scope.storeStatusList, function (status) {
        return lodash.indexOf($scope.allowedStatusNamesForDisplay, status.statusName) >= 0;
      });
    }

    function getStatusList() {
      return storeInstanceDashboardFactory.getStatusList().then(getStatusListSuccess);
    }

    function getTimeConfigSuccess(dataFromAPI) {
      $scope.timeConfigList = angular.copy(dataFromAPI.response);
    }

    function getStoreInstanceTimeConfig() {
      return storeTimeConfig.getTimeConfig().then(getTimeConfigSuccess);
    }

    function getUndispatchFeatureIdSucccess(dataFromAPI) {
      var featuresList = angular.copy(dataFromAPI);
      var undispatchFeature = lodash.findWhere(featuresList, {
        name: 'Undispatch'
      });
      $scope.undispatchFeatureId = undispatchFeature.id;
    }

    function getUndispatchFeatureId() {
      return storeInstanceDashboardFactory.getFeaturesList().then(getUndispatchFeatureIdSucccess);
    }

    var loadingProgress = false;

    function searchStoreInstanceDashboardDataSuccess(apiData) {
      $this.meta.count = $this.meta.count || apiData.meta.count;
      getStoreInstanceListSuccess(apiData);
      hideLoadingModal();
      hideLoadingBar();
      $scope.isReady = ($this.meta.count > 0) ? true : $scope.isReady;
      loadingProgress = false;
    }

    var lastStartDate = null;

    function formatStatusPayload(payload) {
      if (payload.statusId) {
        var statusName = getValueByIdInArray(parseInt(payload.statusId), 'statusName', $scope.storeStatusList);
        if (statusName === 'On Floor') {
          var unpackingStatusId = getIdByValueInArray('Unpacking', 'statusName', $scope.storeStatusList);
          var inboundSealsStatusId = getIdByValueInArray('Inbound Seals', 'statusName', $scope.storeStatusList);
          payload.statusId = [parseInt(payload.statusId), unpackingStatusId, inboundSealsStatusId].toString();
        } else if (statusName === 'Inbounded') {
          var discrepanciesStatusId = getIdByValueInArray('Discrepancies', 'statusName', $scope.storeStatusList);
          var confirmedStatusId = getIdByValueInArray('Confirmed', 'statusName', $scope.storeStatusList);
          var commissionPaidStatusId = getIdByValueInArray('Commission Paid', 'statusName', $scope.storeStatusList);
          payload.statusId = [parseInt(payload.statusId), discrepanciesStatusId, confirmedStatusId, commissionPaidStatusId].toString();
        }
      }

      return payload;
    }

    function formatStationPayloads(payload) {
      if (payload.departureStationCode) {
        payload.departureStationCode = payload.departureStationCode.toString();
      }

      if (payload.arrivalStationCode) {
        payload.arrivalStationCode = payload.arrivalStationCode.toString();
      }

      return payload;
    }

    function formatDates(payload) {
      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      }

      if (payload.endDate) {
        payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      }

    }

    function searchStoreInstanceFailure() {
      $scope.storeInstanceList = [];
      hideLoadingModal();
    }

    function searchStoreInstanceDashboardData(startDate) {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      if (!initDone || loadingProgress) {
        return;
      }

      loadingProgress = true;
      showLoadingBar();
      var payload = {};
      angular.forEach(SEARCH_TO_PAYLOAD_MAP, function (value, key) {
        if ($scope.search[key]) {
          if (key === 'departureStations' || key === 'arrivalStations') {
            payload[value] = angular.copy(lodash.map($scope.search[key], function (station) {
              return station.code;
            }));
          } else {
            payload[value] = angular.copy($scope.search[key]);
          }
        }
      });

      payload = formatStatusPayload(payload);
      payload = formatStationPayloads(payload);
      formatDates(payload);
      $scope.searchIsActive = true;
      if (startDate) {
        payload.startDate = startDate;
        $scope.searchIsActive = false;
      }

      lastStartDate = payload.startDate;
      payload = lodash.assign(payload, {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        avoidUsrStns: true
      });

      storeInstanceDashboardFactory.getStoreInstanceList(payload).then(searchStoreInstanceDashboardDataSuccess, searchStoreInstanceFailure);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.searchStoreInstanceDashboardData = function () {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      showLoadingModal('Retrieving Store Instances');
      $scope.storeInstanceList = [];
      $localStorage.search.storeInstanceDashboard = angular.copy($scope.search);
      searchStoreInstanceDashboardData();
    };

    $scope.getStoreInstanceDashboardData = function () {
      if (!$scope.storeInstanceList) {
        return;
      }

      searchStoreInstanceDashboardData(lastStartDate);
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.search.scheduleStartDate = '';
      $scope.search.scheduleEndDate = '';
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.storeInstanceList = null;
      $localStorage.search.storeInstanceDashboard = {};
    };

    function checkForLocalStorage() {
      var stepTwoFromOne = $localStorage.stepTwoFromStepOne;
      if (angular.isDefined(stepTwoFromOne) && angular.isDefined(stepTwoFromOne.storeId)) {
        delete $localStorage.stepTwoFromStepOne;
      }

      var savedSearch = $localStorage.search;
      if (angular.isDefined(savedSearch)) {
        $scope.search = savedSearch.storeInstanceDashboard || {};
      } else {
        $scope.search = {};
        $localStorage.search = {};
      }
    }

    function completeInit() {
      initDone = true;
      if (lodash.keys($scope.search).length > 0) {
        $scope.searchStoreInstanceDashboardData();
      }

      var stsMap = STATUS_TO_BUTTONS_MAP[5];
      if (angular.isDefined($localStorage.buttons) && $localStorage.buttons.indexOf('unreceive') !== -1) {
        if (stsMap.indexOf('Un-Receive') === -1) {
          stsMap.push('Un-Receive');
          STATUS_TO_BUTTONS_MAP[5] = stsMap;
        }
      }
    }

    function init() {
      showLoadingBar();
      checkForLocalStorage();
      $scope.allCheckboxesSelected = false;
      $scope.isDispatch = accessService.crudAccessGranted('STATIONOPERATIONS', 'STOREDISPATCH', 'DSPTCHSIDS');
      var dependenciesArray = [];
      dependenciesArray.push(getStationList());
      dependenciesArray.push(getStoresList());
      dependenciesArray.push(getStatusList());
      dependenciesArray.push(getStoreInstanceTimeConfig());
      dependenciesArray.push(getUndispatchFeatureId());

      $q.all(dependenciesArray).then(completeInit, showErrors);
    }

    $scope.bulkDispatch = function () {
      showLoadingModal('Dispatching...');
      var bulkDispatchDependencies = [];
      angular.forEach($scope.storeInstanceList, function (store) {
        if (store.selected && $scope.doesStoreInstanceContainAction(store, 'Dispatch')) {
          bulkDispatchDependencies.push(dispatchStoreInstance(store.id));
        }
      });

      $q.all(bulkDispatchDependencies).then(init, showErrors);
    };

    $scope.reloadRoute = function () {
      $route.reload();
    };

    $scope.openReceiveConfirmation = function (store) {
        var modalElement = angular.element('#receive-confirm');
        modalElement.modal('show');
        $scope.receiveStore = store;
      };

    $scope.openUnReceiveConfirmation = function (store) {
      var modalElement = angular.element('#unreceive-confirm');
      modalElement.modal('show');
      $scope.unReceiveStore = store;
    };

    function storeStatusSuccessHandler() {
      hideLoadingModal();
      messageService.display('success', 'Store has been logged as received.');
      $scope.reloadRoute();
    }

    $scope.storeStatusUnReceived = function (store) {
      var modalElement = angular.element('#unreceive-confirm');
      modalElement.modal('hide');
      showLoadingModal('Changing Store Instance ' + store.id + ' Status');
      var promises = [
        storeInstanceDashboardFactory.updateStoreInstanceStatusUnreceive(store.id, 4)
        ];
      $q.all(promises).then(storeStatusSuccessHandler, showErrors);
    };

    $scope.storeStatusReceived = function (store) {
      var modalElement = angular.element('#receive-confirm');
      modalElement.modal('hide');
      showLoadingModal('Changing Store Instance ' + store.id + ' Status');
      var promises = [
        storeInstanceDashboardFactory.updateStoreInstanceStatus(store.id, 5, store.cateringStationId)
      ];
      $q.all(promises).then(storeStatusSuccessHandler, showErrors);
    };

    function completeNavigateToAction(actionName, storeInstance) {
      var url = storeInstanceDashboardActionsConfig.getURL(actionName, storeInstance.id);
      hideLoadingModal();
      if (url) {
        $location.path(url);
      } else {
        messageService.display('danger', 'Error loading next page!');
      }
    }

    function checkChildIdAndAdjustAction(actionName, storeInstance) {
      var searchPayload = {
        prevStoreInstanceId: storeInstance.id,
        limit: 1
      };
      var storeInstanceForNavigation = angular.copy(storeInstance);
      var actionModifierMap = {
        'Ready for Packing': '-Redispatch-Pack',
        'Ready for Seals': '-Redispatch-Seal',
        'Ready for Dispatch': '-Redispatch-Dispatch'
      };

      storeInstanceDashboardFactory.getStoreInstanceList(searchPayload).then(function (dataFromAPI) {
        var nextStoreInstanceExists = dataFromAPI.response !== null && dataFromAPI.response[0];
        if (nextStoreInstanceExists) {
          storeInstanceForNavigation = angular.copy(dataFromAPI.response[0]);
          var nextStoreInstanceStepName = getValueByIdInArray(storeInstanceForNavigation.statusId, 'statusName',
            $scope.storeStatusList);
          actionName = actionName + actionModifierMap[nextStoreInstanceStepName];
        }

        completeNavigateToAction(actionName, storeInstanceForNavigation);
      });
    }

    function getPrevStoreInstanceAndCompleteAction(actionName, storeInstance) {
      storeInstanceDashboardFactory.getStoreInstance(storeInstance.prevStoreInstanceId).then(function (dataFromAPI) {
        var prevStoreInstance = angular.copy(dataFromAPI);
        var prevStoreInstanceStepName = getValueByIdInArray(prevStoreInstance.statusId, 'statusName', $scope.storeStatusList);
        actionName = (prevStoreInstanceStepName === 'Inbound Seals') ? 'Inbound Seals' : actionName;
        completeNavigateToAction(actionName + '-Redispatch', storeInstance);
      });
    }

    function checkParentIdAndAdjustAction(actionName, storeInstance) {
      var isRedispatch = storeInstance.prevStoreInstanceId !== null;
      var isReplenish = storeInstance.replenishStoreInstanceId !== null;
      var actionModifier = (isReplenish) ? '-Replenish' : '';
      actionModifier = (isRedispatch) ? '-Redispatch' : actionModifier;

      if (isRedispatch && actionName === 'Pack') {
        getPrevStoreInstanceAndCompleteAction(actionName, storeInstance);
      } else {
        completeNavigateToAction(actionName + actionModifier, storeInstance);
      }
    }

    $scope.navigateToAction = function (storeInstance, actionName) {
      showLoadingModal('Redirecting ... ');
      var shouldCheckParentId = actionName === 'Pack' || actionName === 'Seal' || actionName === 'Dispatch';
      var shouldCheckChildId = actionName === 'Offload' || actionName === 'Inbound Seals';
      if (shouldCheckParentId) {
        checkParentIdAndAdjustAction(actionName, storeInstance);
      } else if (shouldCheckChildId) {
        checkChildIdAndAdjustAction(actionName, storeInstance);
      } else {
        completeNavigateToAction(actionName, storeInstance);
      }
    };

    init();

    $scope.displayUndispatchConfirmation = function (store) {
      var isReplenishment = !!store.replenishStoreInstanceId;
      $scope.undispatchStoreDialog = {
        title: sprintf(
          'Are you sure you want to undispatch Store Number %s for Schedule Date %s and Store Instance %d?',
          store.storeNumber, store.scheduleDate, store.id),
        confirmationCallback: function () {
          $scope.undispatch(store.id, isReplenishment);
        }
      };
      angular.element('#confirmation-modal').modal('show');
    };

  });
