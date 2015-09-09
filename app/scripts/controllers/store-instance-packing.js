'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstanceFactory, $routeParams, lodash) {
    var $this = this;
    $scope.emptyMenuItems = [];
    $scope.addItemsNumber = 1;

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.addItems = function () {
      for (var i = 0; i < $scope.addItemsNumber; i++) {
        $scope.emptyMenuItems.push({
          menuQuantity: 0
        });
      }
    };

    function errorHandler(error) {
      hideLoadingModal();
    }

    this.mergeMenuItems = function (menuItemsFromAPI) {
      if ($scope.menuItems.length <= 0) {
        $scope.menuItems = menuItemsFromAPI;
        return;
      }

      angular.forEach(menuItemsFromAPI, function (item) {
        var itemMatch = lodash.findWhere($scope.menuItems, {itemMasterId: item.itemMasterId});
        if (itemMatch) {
          lodash.extend(itemMatch, item);
        } else {
          $scope.menuItems.push(item);
        }
      });
      hideLoadingModal();
    };

    function getItemsSuccessHandler(dataFromAPI) {
      if (!dataFromAPI.response) {
        hideLoadingModal();
        return;
      }
      var menuItems = angular.copy(dataFromAPI.response);
      angular.forEach(menuItems, function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
      });
      $this.mergeMenuItems(menuItems);
    }

    function getMenuItemsSuccessHandler(dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      angular.forEach(menuItems, function (item) {
        delete item.id;
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
      });
      $this.mergeMenuItems(menuItems);
    }

    this.getStoreInstanceItems = function () {
      storeInstanceFactory.getStoreInstanceItemList($scope.storeId).then(getItemsSuccessHandler);
    };

    this.getStoreInstanceMenuItems = function () {
      var payload = {
        itemTypeId: 1,
        date: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload).then(getMenuItemsSuccessHandler);
    };

    function getMasterItemsListSuccess(itemsListJSON) {
      $scope.masterItemsList = angular.copy(itemsListJSON.masterItems);
    }

    function getMasterItemsList() {
      var filterPayload = {
        itemTypeId: 1,
        startDate: $scope.storeDetails.scheduleDate,
        endDate: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getItemsMasterList(filterPayload).then(getMasterItemsListSuccess);
    }

    function getStoreDetailsSuccessHandler(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      $this.getStoreInstanceItems();
      $this.getStoreInstanceMenuItems();
      getMasterItemsList();
    }

    this.formatStoreInstanceItemsPayload = function () {
      var newPayload = {response: []};
      var mergedItems = $scope.menuItems.concat($scope.emptyMenuItems);

      angular.forEach(mergedItems, function (item) {
        var itemPayload = {
          itemMasterId: item.itemMasterId || item.masterItem.id,
          quantity: parseInt(item.quantity) || 0
        };
        if (item.id) {
          itemPayload.id = item.id
        }
        newPayload.response.push(itemPayload);
      });

      return newPayload;
    };


    $scope.savePackingData = function () {
      var payload = $this.formatStoreInstanceItemsPayload();
      // TODO: make bulk API call and check for no duplicate items
      storeInstanceFactory.updateStoreInstanceItemsBulk($scope.storeId, payload).then(function (response) {
        console.log(response);
      });
    };


    function init() {
      showLoadingModal('Loading Store Detail for Packing...');
      $scope.storeId = $routeParams.storeId;
      $scope.APIItems = [];
      $scope.menuItems = [];
      storeInstanceFactory.getStoreDetails($scope.storeId).then(getStoreDetailsSuccessHandler, errorHandler);
    }

    init();

  });
