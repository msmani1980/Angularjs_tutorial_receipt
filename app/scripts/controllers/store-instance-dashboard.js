'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceDashboardCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceDashboardCtrl',
  function ($scope, storeInstanceDashboardFactory) {

    $scope.catererStationList = [];
    $scope.stationList = [];
    $scope.storeInstanceList = [];
    $scope.search = {};

    function clearSearchForm() {
      $scope.search = {};
    }
    $scope.clearSearchForm = clearSearchForm;

    function getStoreInstancesListSuccess(dataFromAPI) {
      console.log(dataFromAPI.response);
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


    function init () {
      getCatererStationList();
      getStationList();
      getStoreInstanceList();

    }

    init();


  });
