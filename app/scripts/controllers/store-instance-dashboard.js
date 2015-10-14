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
  function($scope, storeInstanceDashboardFactory, storeTimeConfig, lodash, dateUtility, $q,
    $route, ngToast, $location, $filter, ENV) {

    $scope.viewName = 'Store Instance Dashboard';
    $scope.catererStationList = [];
    $scope.stationList = [];
    $scope.storeInstanceList = [];
    $scope.storeStatusList = [];
    $scope.timeConfigList = [];
    $scope.search = {};
    $scope.allCheckboxesSelected = false;
    $scope.allScheduleDetailsExpanded = false;
    $scope.openStoreInstanceId = -1;
    $scope.hasSelectedStore = false;
    $scope.exportURL = '';

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    }

    function getValueByIdInArray(id, valueKey, array) {
      var matchedObject = lodash.findWhere(array, {
        id: id
      });
      if (matchedObject) {
        return matchedObject[valueKey];
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

    $scope.doesStoreInstanceHaveReplenishments = function(store) {
      return (store.replenishments && store.replenishments.length > 0);
    };

    $scope.isStoreViewExpanded = function(store) {
      return ($scope.openStoreInstanceId === store.id);
    };

    function openAccordion(storeInstance) {
      angular.element('#store-' + storeInstance.id).addClass('open-accordion');
    }

    function closeAccordion() {
      angular.element('#store-' + $scope.openStoreInstanceId).removeClass('open-accordion');
      $scope.openStoreInstanceId = -1;
    }

    $scope.toggleAccordionView = function(storeInstance) {
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

    $scope.doesStoreInstanceContainAction = function(storeInstance, actionName) {
      var statusNumber = getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
      var isReplenishment = storeInstance.replenishStoreInstanceId !== null;
      var isReplenishmentAfterDispatch = isReplenishment && parseInt(statusNumber) >= 4;

      if(!storeInstance.actionButtons || (isReplenishmentAfterDispatch && actionName !== 'Get Flight Docs')) {
        return false;
      }
      return storeInstance.actionButtons.indexOf(actionName) >= 0;
    };

    $scope.storeSelectionToggled = function() {
      var selectedStores = lodash.filter($scope.storeInstanceList, function(store) {
        return store.selected && $scope.doesStoreInstanceContainAction(store, 'Get Flight Docs');
      });
      $scope.hasSelectedStore = (selectedStores.length !== 0);
      if ($scope.hasSelectedStore) {
        var storeInstanceIds = lodash.map(selectedStores, function(item) {
            return item.id;
        }).join('+');
        $scope.exportURL = ENV.apiUrl + '/api/dispatch/store-instances/documents/C208?sessionToken=' + '9e85ffbb3b92134fbf39a0c366bd3f12f0f5&storeInstanceIds=' + storeInstanceIds;//$http.defaults.headers.common.sessionToken;
      } else {
        $scope.exportURL = '';
      }
    };

    $scope.toggleAllCheckboxes = function() {
      angular.forEach($scope.storeInstanceList, function(store) {
        if ($scope.doesStoreInstanceContainAction(store, 'Checkbox')) {
          store.selected = $scope.allCheckboxesSelected;
        }
      });
      $scope.storeSelectionToggled();
    };

    $scope.isScheduleDetailOpen = function(id) {
      return !(angular.element('.scheduleDetails-' + id).hasClass('accordion-cell-closed'));
    };

    $scope.toggleScheduleDetails = function(id) {
      angular.element('.scheduleDetails-' + id).toggleClass('accordion-cell-closed');
    };

    $scope.toggleAllScheduleInfo = function() {
      $scope.allScheduleDetailsExpanded = !$scope.allScheduleDetailsExpanded;
      angular.forEach($scope.storeInstanceList, function(store) {
        var storeClass = '.scheduleDetails-' + store.id;
        var closedClass = 'accordion-cell-closed';

        if ($scope.allScheduleDetailsExpanded && !$scope.isScheduleDetailOpen(store.id)) {
          angular.element(storeClass).removeClass(closedClass);
        } else if (!$scope.allScheduleDetailsExpanded && $scope.isScheduleDetailOpen(store.id)) {
          angular.element(storeClass).addClass(closedClass);
        }
      });
    };

    $scope.isUndispatchPossible = function(store) {
      var storeUpdatedDate = moment.utc(store.updatedOn, 'YYYY-MM-DD HH:mm:ss.SSSSSS');
      var hoursSinceUpdatedDate = moment.duration(moment.utc().diff(storeUpdatedDate)).asHours();
      var isNowWithinAllowedHours = hoursSinceUpdatedDate > 0 && hoursSinceUpdatedDate < store.hours;
      return (store.hours === -1) || (isNowWithinAllowedHours && !$scope.doesStoreInstanceHaveReplenishments(store));
    };

    $scope.undispatch = function(id) {
      var undispatchStatusId = 1;
      showLoadingModal('Undispatching store instance ' + id + '...');
      storeInstanceDashboardFactory.updateStoreInstanceStatus(id, undispatchStatusId).then(function() {
        hideLoadingModal();
        $location.path('store-instance-packing/dispatch/' + id);
      }, showErrors);
    };

    var STATUS_TO_BUTTONS_MAP = {
      '1': ['Pack'],
      '2': ['Seal'],
      '3': ['Dispatch', 'Offload', 'Checkbox'],
      '4': ['Receive', 'Get Flight Docs', 'Replenish', 'Un-dispatch', 'Checkbox'],
      '5': ['End Instance', 'Redispatch', 'Checkbox'],
      '6': ['Start Inbound Seals'],
      '7': ['Start Offload']
    };

    function formatStoreInstance(storeInstance) {
      storeInstance.dispatchStationCode = getValueByIdInArray(storeInstance.cateringStationId, 'code', $scope.stationList);
      storeInstance.inboundStationCode = getValueByIdInArray(storeInstance.inboundStationId, 'code', $scope.stationList);
      storeInstance.storeNumber = getValueByIdInArray(storeInstance.storeId, 'storeNumber', $scope.storesList);
      storeInstance.statusName = getValueByIdInArray(storeInstance.statusId, 'statusName', $scope.storeStatusList);
      storeInstance.scheduleDateApi = angular.copy(storeInstance.scheduleDate);
      storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);
      storeInstance.updatedOnDisplay = storeInstance.updatedOn ? dateUtility.formatTimestampForApp(storeInstance.updatedOn) :
        '';

      // TODO: get timeConfig that has most recent startDate -- will be a new API
      var timeConfig = lodash.findWhere($scope.timeConfigList, {
        featureId: $scope.undispatchFeatureId
      });
      storeInstance.hours = (angular.isDefined(timeConfig)) ? timeConfig.hours : -1;

      var statusName = getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
      storeInstance.actionButtons = STATUS_TO_BUTTONS_MAP[statusName];
      storeInstance.selected = false;
    }

    function formatStoreInstanceList() {
      angular.forEach($scope.storeInstanceList, function(storeInstance) {
        formatStoreInstance(storeInstance);
        angular.forEach(storeInstance.replenishments, function(storeInstance) {
          formatStoreInstance(storeInstance);
        });
      });
      $scope.storeInstanceList = $filter('orderBy')($scope.storeInstanceList, ['scheduleDateApi', 'storeNumber',
        'scheduleNumber'
      ]);
    }

    function dispatchStoreInstance(storeId) {
      return storeInstanceDashboardFactory.updateStoreInstanceStatus(storeId, '4');
    }

    function getCatererStationListSuccess(dataFromAPI) {
      $scope.catererStationList = angular.copy(dataFromAPI.response);
    }

    function getCatererStationList() {
      return storeInstanceDashboardFactory.getCatererStationList().then(getCatererStationListSuccess);
    }

    function getStoreInstanceListSuccess(dataFromAPI) {
      $scope.storeInstanceList = angular.copy(dataFromAPI.response);
    }

    function getStoreInstanceList() {
      return storeInstanceDashboardFactory.getStoreInstanceList({
        'startDate': dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      }).then(getStoreInstanceListSuccess);
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

    function searchStoreInstanceDashboardDataSuccess(apiData) {
      getStoreInstanceListSuccess(apiData);
      formatStoreInstanceList();
      hideLoadingModal();
    }

    function searchStoreInstanceDashboardData() {
      showLoadingModal('Loading Store Instance Dashboard');
      var payload = {};
      angular.forEach(SEARCH_TO_PAYLOAD_MAP, function(value, key) {
        if ($scope.search[key]) {
          if (key === 'departureStations' || key === 'arrivalStations') {
            payload[value] = lodash.map($scope.search[key], function(station) {
              return station.code;
            });
          } else {
            payload[value] = angular.copy($scope.search[key]);
          }
        }
      });

      if (!payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      }

      storeInstanceDashboardFactory.getStoreInstanceList(payload).then(searchStoreInstanceDashboardDataSuccess);
    }

    $scope.searchStoreInstanceDashboardData = searchStoreInstanceDashboardData;

    function clearSearchForm() {
      $scope.search = {};
      searchStoreInstanceDashboardData();
    }

    $scope.clearSearchForm = clearSearchForm;


    function init() {
      showLoadingModal('Loading Store Instance Dashboard');
      $scope.allCheckboxesSelected = false;
      var dependenciesArray = [];
      dependenciesArray.push(getCatererStationList());
      dependenciesArray.push(getStationList());
      dependenciesArray.push(getStoreInstanceList());
      dependenciesArray.push(getStoresList());
      dependenciesArray.push(getStatusList());
      dependenciesArray.push(getStoreInstanceTimeConfig());
      dependenciesArray.push(getUndispatchFeatureId());

      $q.all(dependenciesArray).then(function() {
        formatStoreInstanceList();
        hideLoadingModal();
        $scope.isReady = true;
      });
    }

    $scope.bulkDispatch = function() {
      var bulkDispatchDependencies = [];
      angular.forEach($scope.storeInstanceList, function(store) {
        if (store.selected && $scope.doesStoreInstanceContainAction(store, 'Dispatch')) {
          bulkDispatchDependencies.push(dispatchStoreInstance(store.id));
        }
      });

      $q.all(bulkDispatchDependencies).then(init());
    };

    $scope.showMessage = function(type, message) {
      ngToast.create({
        className: type,
        dismissButton: true,
        content: message
      });
    };

    $scope.reloadRoute = function() {
      $route.reload();
    };

    $scope.openReceiveConfirmation = function(store) {
      var modalElement = angular.element('#receive-confirm');
      modalElement.modal('show');
      $scope.receiveStore = store;
    };

    $scope.storeStatusReceived = function(store) {
      var modalElement = angular.element('#receive-confirm');
      modalElement.modal('hide');
      showLoadingModal('Changing Store Instance ' + store.id + ' Status');
      storeInstanceDashboardFactory.updateStoreInstanceStatus(store.id, 5, store.cateringStationId).then(function() {
        $scope.showMessage('success', 'Store has been logged as received.');
        $scope.reloadRoute();
      });
    };


    function completeNavigateToAction(URL, storeInstance) {
      hideLoadingModal();
      if(URL) {
        $location.path(URL + storeInstance.id);
      } else {
        $scope.showMessage('danger', 'This store instance contains bad data, no further action can be taken');
      }
    }

    function getStoreInstanceNextId(actionName, actionToURLMap, storeInstance) {
      var searchPayload = {prevStoreInstanceId: storeInstance.id, limit: 1};
      var storeInstanceForNavigation = angular.copy(storeInstance);
      storeInstanceDashboardFactory.getStoreInstanceList(searchPayload).then(function (dataFromAPI) {
        var nextStoreInstanceExists = dataFromAPI.response !== null && dataFromAPI.response[0];
        if(nextStoreInstanceExists) {
          storeInstanceForNavigation = angular.copy(dataFromAPI.response[0]);
          var nextStoreInstanceStepName = getValueByIdInArray(storeInstanceForNavigation.statusId, 'statusName', $scope.storeStatusList);
          actionName = (actionName === 'Inbound Seals') ? actionName + '-Redispatch' : actionName + '-' + nextStoreInstanceStepName;
        }
        completeNavigateToAction(actionToURLMap[actionName], storeInstanceForNavigation);
      });
    }

    function setPackingAndSealsURL (actionName, actionToURLMap, storeInstance) {
      if(storeInstance.prevStoreInstanceId !== null) {
        actionToURLMap.Pack = 'store-instance-packing/redispatch/';
        actionToURLMap.Seal = 'store-instance-seals/redispatch/';
        actionToURLMap.Dispatch = 'store-instance-review/redispatch/';
      } else if(storeInstance.replenishStoreInstanceId !== null) {
        actionToURLMap.Pack = 'store-instance-packing/replenish/';
        actionToURLMap.Seal = 'store-instance-seals/replenish/';
        actionToURLMap.Dispatch = 'store-instance-review/replenish/';
      }
      completeNavigateToAction(actionToURLMap[actionName], storeInstance);
    }

    $scope.navigateToAction = function (storeInstance, actionName) {
      showLoadingModal('Redirecting ... ');
      var actionToURLMap = {
        'Pack': 'store-instance-packing/dispatch/',
        'Seal': 'store-instance-seals/dispatch/',
        'Dispatch': 'store-instance-review/dispatch/',
        'Replenish': 'store-instance-create/replenish/',
        'Redispatch': 'store-instance-create/redispatch/',
        'End Instance': 'store-instance-create/end-instance/',
        'Inbound Seals': 'store-instance-inbound-seals/end-instance/',
        'Inbound Seals-Redispatch': 'store-instance-inbound-seals/redispatch/',
        'Offload': 'store-instance-packing/end-instance/',
        'Offload-Ready for Packing': 'store-instance-packing/redispatch/',
        'Offload-Ready for Seals': 'store-instance-seals/redispatch/',
        'Offload-Ready for Dispatch': 'store-instance-review/redispatch/'
      };

      var shouldCheckParentId = actionName === 'Pack' || actionName === 'Seal' || actionName === 'Dispatch';
      var shouldCheckChildId = actionName === 'Offload' || actionName === 'Inbound Seals';

      if (shouldCheckParentId) {
        setPackingAndSealsURL(actionName, actionToURLMap, storeInstance);
      } else if(shouldCheckChildId) {
        getStoreInstanceNextId(actionName, actionToURLMap, storeInstance);
      } else {
        completeNavigateToAction(actionToURLMap[actionName], storeInstance);
      }
    };

    init();

  });
