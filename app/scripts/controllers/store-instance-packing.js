'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl', function ($scope, storeInstanceFactory) {
    storeInstanceFactory.getStoreDetails(5).then(function (storeDetailsJSON) {
      angular.forEach(storeDetailsJSON, function(value, key){
        $scope[key] = value;
      });
    });

    // TODO: getStoreInstanceItems to populate quantity
    storeInstanceFactory.getStoreInstanceMenuItems(13, {itemTypeId: 1, scheduleDate: $scope.scheduleDate}).then(function(dataFromAPI) {
      $scope.menuItems = angular.copy(dataFromAPI.response);
      angular.forEach($scope.menuItems, function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
      });
    });

  });
