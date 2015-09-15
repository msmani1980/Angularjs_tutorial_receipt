'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstanceFactory, $routeParams, lodash, ngToast, storeInstanceDispatchWizardConfig, $location) {
    var $this = this;
    $scope.emptyMenuItems = [];
    $scope.filteredMasterItemList = [];
    $scope.addItemsNumber = 1;
    $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);
    $scope.readOnly = true;

    var nextStep = {
      stepName: '2',
      URL: 'store-instance-seals/' + $routeParams.storeId
    };
    var prevStep = {
      stepName: '1',
      URL: 'store-instance-create/'
    };

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showErrors(dataFromAPI) {
      showToast('warning', 'Store Instance Packing', 'error saving items!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
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
          isNewItem: true,
          isDuplicate: false
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
      storeInstanceFactory.getStoreInstanceItemList($scope.storeId).then(getItemsSuccessHandler, showErrors);
    };

    this.getStoreInstanceMenuItems = function () {
      var payload = {
        itemTypeId: 1,
        date: $scope.storeDetails.scheduleDate
      };
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload).then(getItemsSuccessHandler, showErrors);
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
      storeInstanceFactory.getItemsMasterList(filterPayload).then(getMasterItemsListSuccess, showErrors);
    }

    function updateStoreDetails(response, stepObject) {
      $scope.storeDetails.currentStatus = lodash.findWhere($scope.storeDetails.statusList, {id: response.statusId});
      console.log(stepObject.URL);
      $location.path(stepObject.URL);
    }

    function updateStatusToStep(stepObject) {
      var statusObject = lodash.findWhere($scope.storeDetails.statusList, {name: stepObject.stepName});
      if (!statusObject) {
        return;
      }
      var statusId = statusObject.id;
      storeInstanceFactory.updateStoreInstanceStatus($scope.storeId, statusId).then(function(response){
        updateStoreDetails(response, stepObject);
      }, showErrors);
    }

    function getStoreDetailsSuccessHandler(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
      if($scope.storeDetails.currentStatus.name !== '1') {
        showToast('warning', 'Store Instance Status', 'This store instance is not ready for packing');
      } else {
        $scope.readOnly = false;
      }

      $this.getStoreInstanceItems();
      $this.getStoreInstanceMenuItems();

      getMasterItemsList();
    }

    this.checkForDuplicate = function (item) {
      var duplicates = lodash.filter($scope.emptyMenuItems, function (filteredItem) {
        return (item.masterItem && filteredItem.masterItem && filteredItem.masterItem.id === item.masterItem.id);
      });
      return duplicates.length > 1;
    };

    $scope.warnForDuplicateSelection = function (selectedItem) {
      var duplicatesExist = $this.checkForDuplicate(selectedItem);
      if(duplicatesExist) {
        showToast('warning', 'Add Item', 'The item ' + selectedItem.masterItem.itemName + ' has already been added');
      }
    };

    this.checkForDuplicatesInPayload = function () {
      var duplicatesExist = false;
      angular.forEach($scope.emptyMenuItems, function (item) {
        duplicatesExist = duplicatesExist || $this.checkForDuplicate(item);
      });
      return duplicatesExist;
    };

    this.checkForEmptyItemsInPayload = function () {
      var emptyItemsExist = false;
      angular.forEach($scope.emptyMenuItems, function (item) {
        emptyItemsExist = emptyItemsExist || (!item.itemMasterId && !item.masterItem);
      });
      return emptyItemsExist;
    };

    this.createPayload = function () {
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
      console.log(newPayload);
      return newPayload;
    };

    this.formatStoreInstanceItemsPayload = function () {
      var duplicatesExist = $this.checkForDuplicatesInPayload();
      if (duplicatesExist) {
        showToast('danger', 'Save Items', 'Duplicate Entries Exist!');
        return false;
      }
      var emptyItemsExist = $this.checkForEmptyItemsInPayload();
      if (emptyItemsExist) {
        showToast('danger', 'Save Items', 'An item must be selected for all rows');
        return false;
      }

      return $this.createPayload();
    };

    function initialize() {
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

    function removeNewItem(itemToDelete) {
      var index = $scope.emptyMenuItems.indexOf(itemToDelete);
      $scope.emptyMenuItems.splice(index, 1);
    }

    $scope.removeRecord = function (itemToDelete) {
      if (itemToDelete.isNewItem) {
        removeNewItem(itemToDelete);
      } else {
        storeInstanceFactory.deleteStoreInstanceItem($scope.storeId, itemToDelete.id).then(initialize, showErrors);
      }
    };

    function savePackingDataSuccessHandler(dataFromAPI, updateStatus) {
      $scope.emptyMenuItems = [];
      angular.forEach(dataFromAPI.response, function (item) {
        var masterItem = lodash.findWhere($scope.masterItemsList, {id: item.itemMasterId});
        item.itemCode = masterItem.itemCode;
        item.itemName = masterItem.itemName;
      });
      getItemsSuccessHandler(dataFromAPI);

      if (updateStatus) {
        updateStatusToStep(nextStep);
      } else {
        showToast('success', 'Save Packing Data', 'Data successfully updated!');
        $location.path('#');
      }

      hideLoadingModal();
    }

    $scope.savePackingDataAndUpdateStatus = function (shouldUpdateStatus) {
      if (!$scope.storeInstancePackingForm.$valid) {
        showToast('danger', 'Save Items', 'All template quantities must be a number');
        return false;
      }
      var payload = $this.formatStoreInstanceItemsPayload();
      if(!payload) {
        return;
      }
      showLoadingModal('Saving...');
      storeInstanceFactory.updateStoreInstanceItemsBulk($scope.storeId, payload).then(function (responseData) {
        savePackingDataSuccessHandler(responseData, shouldUpdateStatus);
      }, showErrors);
    };

    $scope.saveAndExit = function () {
      if($scope.readOnly) {
        $location.path('#');
      } else {
        $scope.savePackingDataAndUpdateStatus(false);
      }
    };

    $scope.goToPreviousStep = function () {
      updateStatusToStep(prevStep);
      // TODO: show warning modal before leaving
      // TODO: update URL with storeId
    };

    $scope.goToNextStep = function () {
      $scope.savePackingDataAndUpdateStatus(true);
    };

    initialize();
  });
