'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceDashboardCtrl
 * @description
 * # StoreInstanceDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceDashboardCtrl',
  function ($scope, storeInstanceDashboardFactory, lodash) {

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

    function formatStoreInstanceList () {
      angular.forEach($scope.storeInstanceList, function (storeInstance) {
        storeInstance.storeNumber = getStoreNumberById(storeInstance.storeId);
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

    $scope.$watchGroup(['storeInstanceList', 'storesList', 'catererStationList'], function () {
      if($scope.storeInstanceList && $scope.storesList && $scope.catererStationList) {
        formatStoreInstanceList();
      }
    });

    function init () {
      getCatererStationList();
      getStoreInstanceList();
      getStoresList();
    }

    init();

  });
