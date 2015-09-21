'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceDashboardCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceDashboardCtrl',
  function ($scope, storeInstanceDashboardFactory, lodash, dateUtility) {

    $scope.catererStationList = [];
    $scope.stationList = [];
    $scope.storeInstanceList = [];
    $scope.storeStatusList = [];
    $scope.search = {};
    $scope.allCheckboxesSelected = false;
    $scope.openStoreInstanceId = -1;

    function clearSearchForm() {
      $scope.search = {};
    }
    $scope.clearSearchForm = clearSearchForm;

    function getStoreInstancesListSuccess(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    }

    var SEARCH_TO_PAYLOAD_MAP = {
      dispatchLMPStation: 'cateringStationId',
      inboundLMPStation: 'cateringStationId',
      storeNumber: 'storeId',
      scheduleStartDate: 'scheduleDate',
      scheduleEndDate: 'scheduleDate',
      //depStations: '?',
      //arrStations: '?',
      storeInstance: 'id',
      storeStatusId: 'statusId'
    };

    function searchStoreInstanceDashboardData() {
      var payload = {};
      angular.forEach(SEARCH_TO_PAYLOAD_MAP, function(value, key) {
        payload[value] = $scope.search[key];
      });

      storeInstanceDashboardFactory.getStoreInstanceList(payload).then(getStoreInstancesListSuccess);
    }

    $scope.searchStoreInstanceDashboardData = searchStoreInstanceDashboardData;

    $scope.doesStoreInstanceHaveReplenishments = function (store) {
      return (store.replenishItems && store.replenishItems.length > 0);
    };

    $scope.isStoreViewExpanded = function (store) {
      return ($scope.openStoreInstanceId === store.id);
    };

    function openAccordion (storeInstance) {
      angular.element('#store-' + storeInstance.id).addClass('open-accordion');
    }

    function closeAccordion () {
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


    $scope.doesStoreInstanceContainAction = function (storeInstance, actionName) {
      if(storeInstance.actionButtons) {
        return storeInstance.actionButtons.indexOf(actionName) >= 0;
      }
      return false;
    };

    $scope.toggleAllCheckboxes = function () {
      angular.forEach($scope.storeInstanceList, function (store) {
        if($scope.doesStoreInstanceContainAction(store, 'Checkbox')) {
          store.selected = $scope.allCheckboxesSelected;
        }
      });
    };

    $scope.toggleScheduleDetails = function (id) {
      angular.element('.scheduleDetails-' + id).toggleClass('accordion-cell-closed');
    };

    function getValueByIdInArray(id, valueKey, array) {
      var matchedObject = lodash.findWhere(array, {id: id});
      if(matchedObject) {
        return matchedObject[valueKey];
      }
      return '';
    }

    var STATUS_TO_BUTTONS_MAP = {
      '1' : ['Pack', 'Delete'],
      '2' : ['Seal', 'Delete'],
      '3' : ['Dispatch', 'Delete', 'Checkbox'],
      '4' : ['Receive', 'Get Flight Docs', 'Replenish', 'Un-dispatch', 'Checkbox'],
      '5' : ['End instance', 'Re-dispatch', 'Checkbox'],
      '6' : ['N/A'],
      '7' : ['Instance audit report']
    };

    function formatStoreInstanceList () {
      angular.forEach($scope.storeInstanceList, function (storeInstance, index) {
        storeInstance.dispatchStationCode = getValueByIdInArray(storeInstance.cateringStationId, 'code', $scope.stationList);
        storeInstance.storeNumber = getValueByIdInArray(storeInstance.storeId, 'storeNumber', $scope.storesList);
        storeInstance.statusName = getValueByIdInArray(storeInstance.statusId, 'statusName', $scope.storeStatusList);
        storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);

        var statusName = getValueByIdInArray(storeInstance.statusId, 'name', $scope.storeStatusList);
        storeInstance.actionButtons = STATUS_TO_BUTTONS_MAP[statusName];
        storeInstance.selected = false;
        // TODO: remove once API returns nested replenishedItems structure.
        if(index === 3 || index === 5) {
          storeInstance.replenishItems = [$scope.storeInstanceList[0], $scope.storeInstanceList[1]];
        }
      });
    }

    function getCatererStationListSuccess (dataFromAPI) {
      $scope.catererStationList = dataFromAPI.response;
    }

    function getCatererStationList () {
      storeInstanceDashboardFactory.getCatererStationList().then(getCatererStationListSuccess);
    }

    function getStoreInstanceListSuccess (dataFromAPI) {
      $scope.storeInstanceList = dataFromAPI.response;
    }

    function getStoreInstanceList () {
      storeInstanceDashboardFactory.getStoreInstanceList().then(getStoreInstanceListSuccess);
    }

    function getStationListSuccess (dataFromAPI) {
      $scope.stationList = dataFromAPI.response;
    }

    function getStationList () {
      storeInstanceDashboardFactory.getStationList().then(getStationListSuccess);
    }

    function getStoresListSuccess (dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    }

    function getStoresList () {
      storeInstanceDashboardFactory.getStoresList({}).then(getStoresListSuccess);
    }

    function getStatusListSuccess (dataFromAPI) {
      $scope.storeStatusList = dataFromAPI;
    }

    function getStatusList () {
      storeInstanceDashboardFactory.getStatusList().then(getStatusListSuccess);
    }

    $scope.$watchGroup(['storeInstanceList', 'storesList', 'catererStationList'], function () {
      if($scope.storeInstanceList && $scope.storesList && $scope.catererStationList && $scope.storeStatusList) {
        formatStoreInstanceList();
      }
    });

    function init () {
      getCatererStationList();
      getStationList();
      getStoreInstanceList();
      getStoresList();
      getStatusList();
    }

    init();


  });
