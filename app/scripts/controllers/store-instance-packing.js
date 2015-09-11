'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstanceFactory, $routeParams, lodash, ngToast) {
    var $this = this;
    $scope.emptyMenuItems = [];
    $scope.filteredMasterItemList = [];
    $scope.addItemsNumber = 1;

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.deleteNewItem = function (itemIndex) {
      $scope.emptyMenuItems.splice(itemIndex, 1);
    };

    $scope.addItems = function () {
      if ($scope.filteredMasterItemList.length === 0) {
        showToast('warning', 'Add Item', 'There are no items available');
        return;
      }

      for (var i = 0; i < $scope.addItemsNumber; i++) {
        $scope.emptyMenuItems.push({
          menuQuantity: 0,
          isNewItem: true
        });
      }
    };

    function errorHandler() {
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
        if (item.menuQuantity) {
          delete item.id;
        }
        item.itemDescription = item.itemCode + ' - ' + item.itemName;
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
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload).then(getItemsSuccessHandler);
    };

    $scope.$watchGroup(['masterItemsList', 'menuItems'], function () {
      $scope.filteredMasterItemList = lodash.filter($scope.masterItemsList, function (item) {
        return !(lodash.findWhere($scope.menuItems, {itemMasterId: item.id}));
      });
    });

    function getMasterItemsListSuccess(itemsListJSON) {
      $scope.masterItemsList = itemsListJSON.masterItems;
    }

    function getMasterItemsList() {
      var filterPayload = {
        itemTypeId: 1,
        startDate: $scope.storeDetails.scheduleDate,
        endDate: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getItemsMasterList(filterPayload).then(getMasterItemsListSuccess);
    }

    function updateStoreDetails(response) {
      $scope.storeDetails.currentStatus = lodash.findWhere($scope.storeDetails.statusList, {id: response.statusId});
    }

    function updateStatusToStep(stepName) {
      var statusObject = lodash.findWhere($scope.storeDetails.statusList, {name: stepName.toString()});
      if (!statusObject) {
        return;
      }
      var statusId = statusObject.id;
      storeInstanceFactory.updateStoreInstanceStatus($scope.storeId, statusId).then(updateStoreDetails);
    }

    function getStoreDetailsSuccessHandler(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;

      $this.getStoreInstanceItems();
      $this.getStoreInstanceMenuItems();

      if($scope.storeDetails.currentStatus.name !== '1') {
        updateStatusToStep(1);
      }

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
          itemPayload.id = item.id;
        }
        newPayload.response.push(itemPayload);
      });

      return newPayload;
    };

    function init() {
      showLoadingModal('Loading Store Detail for Packing...');
      $scope.storeId = $routeParams.storeId;
      $scope.APIItems = [];
      $scope.menuItems = [];
      $scope.emptyMenuItems = [];
      storeInstanceFactory.getStoreDetails($scope.storeId).then(getStoreDetailsSuccessHandler, errorHandler);
    }


    $scope.showDeleteWarning = function (item) {
      if (item.quantity > 0) {
        $scope.deleteRecordDialog(item, ['itemDescription']);

      } else {
        $scope.removeRecord(item);
      }
    };

    function getIndexOfNewItem(itemToDelete) {
      return lodash.findIndex($scope.emptyMenuItems, function (item) {
        return item === itemToDelete;
      });
    }

    function removeNewItem(itemToDelete) {
      var index = getIndexOfNewItem(itemToDelete);
      $scope.emptyMenuItems.splice(index, 1);
    }

    $scope.removeRecord = function (itemToDelete) {
      if (itemToDelete.isNewItem) {
        removeNewItem(itemToDelete);
      } else {
        storeInstanceFactory.deleteStoreInstanceItem($scope.storeId, itemToDelete.id).then(init);
      }
    };

    function savePackingDataSuccessHandler(dataFromAPI) {
      $scope.emptyMenuItems = [];
      angular.forEach(dataFromAPI.response, function(item) {
        var masterItem = lodash.findWhere($scope.masterItemsList, {id: item.itemMasterId});
        item.itemCode = masterItem.itemCode;
        item.itemName = masterItem.itemName;
      });
      getItemsSuccessHandler(dataFromAPI);
      updateStatusToStep(2);
      hideLoadingModal();
    }

    $scope.savePackingData = function () {
      var payload = $this.formatStoreInstanceItemsPayload();
      showLoadingModal('Saving...');
      // TODO: make bulk API call and check for no duplicate items
      storeInstanceFactory.updateStoreInstanceItemsBulk($scope.storeId, payload).then(savePackingDataSuccessHandler);
    };

    init();
  });
