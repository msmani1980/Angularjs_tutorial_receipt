'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl', function ($scope, storeInstanceFactory, $routeParams) {

  function getStoreInstanceMenuItemsSuccessHandler(dataFromAPI) {
    $scope.menuItems = angular.copy(dataFromAPI.response);
    angular.forEach($scope.menuItems, function (item) {
      item.itemDescription = item.itemCode + ' -  ' + item.itemName;
    });
  }

  function getStoreInstanceMenuItems() {
// TODO: getStoreInstanceItems to populate quantity
    var payload = {
      itemTypeId: 1,
      scheduleDate: $scope.storeDetails.scheduleDate
    };
    storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId,
      payload).then(getStoreInstanceMenuItemsSuccessHandler);
  }

  function getStoreDetailsSuccessHandler(storeDetailsJSON) {
    $scope.storeDetails = storeDetailsJSON;
    getStoreInstanceMenuItems();
  }

  function init() {
    $scope.storeId = $routeParams.storeId;
    storeInstanceFactory.getStoreDetails($scope.storeId).then(getStoreDetailsSuccessHandler);
  }

  init();

});
