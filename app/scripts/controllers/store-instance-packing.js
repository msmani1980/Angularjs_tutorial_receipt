'use strict';
/* global Map*/
/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstanceFactory, $routeParams, lodash) {

    function mergeMenuItems(menuItemsFromAPI) {
      if ($scope.menuItems.length <= 0) {
        $scope.menuItems = menuItemsFromAPI;
        return;
      }

      angular.forEach(menuItemsFromAPI, function (item) {
        var itemMatch = lodash.findWhere($scope.menuItems, { itemMasterId: item.itemMasterId });
        if(itemMatch) {
          lodash.extend(itemMatch, item);
        } else {
          $scope.menuItems.push(item);
        }
      });
    }

    function getStoreInstanceItems() {
      storeInstanceFactory.getStoreInstanceItemList($scope.storeId).then(getItemsSuccessHandler);
    }

    function getItemsSuccessHandler(dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      angular.forEach(menuItems, function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
      });
      mergeMenuItems(menuItems);
    }

    function getStoreInstanceMenuItems() {
// TODO: getStoreInstanceItems to populate quantity
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload).then(getItemsSuccessHandler);
    }

    function getStoreDetailsSuccessHandler(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      getStoreInstanceItems();
      getStoreInstanceMenuItems();
    }

    function init() {
      $scope.storeId = $routeParams.storeId;
      $scope.APIItems = [];
      $scope.menuItems = [];
      storeInstanceFactory.getStoreDetails($scope.storeId).then(getStoreDetailsSuccessHandler);
    }

    init();

  });
