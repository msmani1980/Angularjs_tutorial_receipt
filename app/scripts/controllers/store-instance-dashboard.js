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
    $scope.search = {};
    var openStoreInstanceId = -1;

    function clearSearchForm() {
      $scope.search = {};
    }
    $scope.clearSearchForm = clearSearchForm;

    function getStoreInstancesListSuccess(dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    }

    function searchStoreInstanceDashboardData() {
      var payload = {};

      var payloadParameterMap = {
        dispatchLMPStation: 'cateringStationId',
        inboundLMPStation: 'cateringStationId',
        storeNumber: 'storeId',
        scheduleStartDate: 'scheduleDate',
        scheduleEndDate: 'scheduleDate',
        //depStations: '?',
        //arrStations: '?',
        storeInstance: 'id'
      };
      angular.forEach(payloadParameterMap, function(value, key) {
        payload[value] = $scope.search[key];
      });

      storeInstanceDashboardFactory.getStoreInstanceList(payload).then(getStoreInstancesListSuccess);
    }

    $scope.searchStoreInstanceDashboardData = searchStoreInstanceDashboardData;

    $scope.doesStoreInstanceHaveReplenishments = function (store) {
      return (store.replenishItems && store.replenishItems.length > 0);
    };

    $scope.isStoreViewExpanded = function (store) {
      return (openStoreInstanceId === store.id);
    };

    function openAccordion (storeInstance) {
      angular.element('#store-' + storeInstance.id).addClass('open-accordion');
    }

    function closeAccordion () {
      angular.element('#store-' + openStoreInstanceId).removeClass('open-accordion');
      openStoreInstanceId = -1;
    }

    $scope.toggleAccordionView = function (storeInstance) {
      if (!$scope.doesStoreInstanceHaveReplenishments(storeInstance)) {
        return;
      }
      if (openStoreInstanceId === storeInstance.id) {
        closeAccordion();
      } else {
        openAccordion(storeInstance);
        closeAccordion();
        openStoreInstanceId = storeInstance.id;
      }
    };

    function getStoreNumberById (id) {
      var store =  lodash.findWhere($scope.storesList, { id: id });
      if(store) {
        return store.storeNumber;
      }
      return '';
    }

    function getStatusNameById (id) {
      var status =  lodash.findWhere($scope.storeStatusList, { id: id });
      if(status) {
        return status.statusName;
      }
      return '';
    }

    function formatStoreInstanceList () {
      angular.forEach($scope.storeInstanceList, function (storeInstance, index) {
        storeInstance.storeNumber = getStoreNumberById(storeInstance.storeId);
        storeInstance.statusName = getStatusNameById(storeInstance.statusId);
        storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);
        if(index === 3) {
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
