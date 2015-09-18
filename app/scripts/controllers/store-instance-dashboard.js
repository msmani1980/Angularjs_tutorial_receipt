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
    $scope.storeInstanceList = [];
    $scope.search = {};

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
      angular.forEach($scope.storeInstanceList, function (storeInstance) {
        storeInstance.storeNumber = getStoreNumberById(storeInstance.storeId);
        storeInstance.statusName = getStatusNameById(storeInstance.statusId);
        storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);
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
      if($scope.storeInstanceList && $scope.storesList && $scope.catererStationList) {
        formatStoreInstanceList();
      }
    });

    function init () {
      getCatererStationList();
      getStoreInstanceList();
      getStoresList();
      getStatusList();
    }

    init();

  });
