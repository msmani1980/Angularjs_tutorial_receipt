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
      for (var i = 0; i < $scope.addItemsNumber; i ++) {
        $scope.emptyMenuItems.push({
          menuQuantity: 0
        });
      }
    };

    function errorHandler(error) {
      debugger;
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

    function getStoreInstanceItems() {
      storeInstanceFactory.getStoreInstanceItemList($scope.storeId).then(getItemsSuccessHandler);
    }

    function getStoreInstanceMenuItems() {
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload).then(getItemsSuccessHandler);
    }

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
      getStoreInstanceItems();
      getStoreInstanceMenuItems();
      getMasterItemsList();
    }

    function formatMenuPayload() {

    }


    $scope.savePackingData = function () {
      formatMenuPayload();
      //function updateStoreInstanceItem(id, itemId, payload) {

        storeInstanceFactory.updateStoreInstanceItem
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
