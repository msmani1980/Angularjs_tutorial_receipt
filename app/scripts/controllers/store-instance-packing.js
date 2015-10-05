'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstanceFactory, $routeParams, lodash, ngToast, storeInstanceWizardConfig, $location, $q, dateUtility) {

    this.actions = {};
    var $this = this;

    $scope.emptyMenuItems = [];
    $scope.filteredMasterItemList = [];
    $scope.addItemsNumber = 1;
    $scope.readOnly = true;
    $scope.saveButtonName = 'Exit';

    var nextStep = {
      stepName: '2',
      URL: 'store-instance-seals/' + $routeParams.action + '/' + $routeParams.storeId
    };
    var prevStep = {
      stepName: '1',
      URL: 'store-instance-create/' + $routeParams.action + '/' + $routeParams.storeId
    };

    var dashboardURL = 'store-instance-dashboard';

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
        if (angular.isDefined(item.menuQuantity)) {
          delete item.id;
        }
        if (angular.isDefined(item.quantity)) {
          item.quantity = item.quantity.toString();
        }
        item.itemDescription = item.itemCode + ' - ' + item.itemName;
      });

      $this.mergeMenuItems(menuItems);
    }

    this.getIdByNameFromArray = function (name, array) {
      var matchedObject = lodash.findWhere(array, {name: name});
      if (matchedObject) {
        return matchedObject.id;
      }
      return '';
    };

    this.getStoreInstanceItems = function () {
      storeInstanceFactory.getStoreInstanceItemList($routeParams.storeId).then(getItemsSuccessHandler, showErrors);
    };

    this.getRegularItemTypeIdSuccess = function (dataFromAPI) {
      $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', dataFromAPI);
    };

    this.getRegularItemTypeId = function () {
      return storeInstanceFactory.getItemTypes().then($this.getRegularItemTypeIdSuccess);
    };

    this.getUpliftableCharacteristicIdSuccess = function (dataFromAPI) {
      $scope.upliftableCharacteristicId = $this.getIdByNameFromArray('Upliftable', dataFromAPI);
    };

    this.getUpliftableCharacteristicId = function () {
      return storeInstanceFactory.getCharacteristics().then($this.getUpliftableCharacteristicIdSuccess);
    };

    this.getStoreInstanceMenuItems = function () {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var payload = {
        itemTypeId: $scope.regularItemTypeId,
        date: payloadDate
      };
      if ($scope.upliftableCharacteristicId) {
        payload.characteristicId = $scope.upliftableCharacteristicId;
      }
      storeInstanceFactory.getStoreInstanceMenuItems($routeParams.storeId, payload).then(getItemsSuccessHandler, showErrors);
    };

    $scope.$watchGroup(['masterItemsList', 'menuItems'], function () {
      $scope.filteredMasterItemList = lodash.filter($scope.masterItemsList, function (item) {
        return !(lodash.findWhere($scope.menuItems, {itemMasterId: item.id}));
      });
    });

    this.getMasterItemsListSuccess = function (itemsListJSON) {
      $scope.masterItemsList = itemsListJSON.masterItems;
    };

    this.getMasterItemsList = function () {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var filterPayload = {
        itemTypeId: $scope.regularItemTypeId,
        startDate: payloadDate,
        endDate: payloadDate
      };
      if ($scope.upliftableCharacteristicId) {
        filterPayload.characteristicId = $scope.upliftableCharacteristicId;
      }
      storeInstanceFactory.getItemsMasterList(filterPayload).then($this.getMasterItemsListSuccess, showErrors);
    };

    function updateStoreDetails(response, stepObject) {
      $scope.storeDetails.currentStatus = lodash.findWhere($scope.storeDetails.statusList, {id: response.statusId});
      $location.path(stepObject.URL);
    }

    function updateStatusToStep(stepObject) {
      var statusObject = lodash.findWhere($scope.storeDetails.statusList, {name: stepObject.stepName});
      if (!statusObject) {
        return;
      }
      var statusId = statusObject.id;
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusId).then(function (response) {
        updateStoreDetails(response, stepObject);
      }, showErrors);
    }

    this.getStoreDetailsSuccess = function (dataFromAPI) {
      $scope.storeDetails = angular.copy(dataFromAPI);
    };

    this.getStoreDetails = function () {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then(this.getStoreDetailsSuccess, errorHandler);
    };

    this.checkForDuplicate = function (item) {
      var duplicates = lodash.filter($scope.emptyMenuItems, function (filteredItem) {
        return (item.masterItem && filteredItem.masterItem && filteredItem.masterItem.id === item.masterItem.id);
      });
      return duplicates.length > 1;
    };

    $scope.warnForDuplicateSelection = function (selectedItem) {
      var duplicatesExist = $this.checkForDuplicate(selectedItem);
      if (duplicatesExist) {
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

    this.isInstanceReadOnly = function () {
      if ($scope.storeDetails.currentStatus.name !== '1') {
        showToast('warning', 'Store Instance Status', 'This store instance is not ready for packing');
      } else {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
      }
    };

    this.completeInitializeAfterDependencies = function () {
      $this.isInstanceReadOnly();
      $this.getStoreInstanceItems();
      $this.getStoreInstanceMenuItems();
      $this.getMasterItemsList();
    };

    this.makeInitializePromises = function () {
      var promises = [
        this.getStoreDetails(),
        this.getRegularItemTypeId()
      ];
      if ($routeParams.action === 'replenish') {
        promises.push(this.getUpliftableCharacteristicId());
      }
      return promises;
    };

    this.initialize = function () {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      showLoadingModal('Loading Store Detail for Packing...');
      $scope.menuItems = [];
      $scope.emptyMenuItems = [];
      var promises = $this.makeInitializePromises();
      $q.all(promises).then($this.completeInitializeAfterDependencies);
    };

    this.initialize();

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
        storeInstanceFactory.deleteStoreInstanceItem($routeParams.storeId, itemToDelete.id).then($this.initialize, showErrors);
      }
    };

    function savePackingDataSuccessHandler(dataFromAPI, updateStatus) {
      $scope.emptyMenuItems = [];
      angular.forEach(dataFromAPI.response, function (item) {
        var masterItem = lodash.findWhere($scope.masterItemsList, {id: item.itemMasterId});
        item.itemCode = angular.isDefined(masterItem) ? masterItem.itemCode : '';
        item.itemName = angular.isDefined(masterItem) ? masterItem.itemName : '';
      });
      getItemsSuccessHandler(dataFromAPI);

      if (updateStatus) {
        updateStatusToStep(nextStep);
      } else {
        showToast('success', 'Save Packing Data', 'Data successfully updated!');
        $location.path(dashboardURL);
      }

      hideLoadingModal();
    }

    $scope.savePackingDataAndUpdateStatus = function (shouldUpdateStatus) {
      if ($scope.readOnly) {
        $location.path(dashboardURL);
        return;
      }
      if ($scope.storeInstancePackingForm.$invalid) {
        showToast('danger', 'Save Items', 'All Packed quantities must be a number');
        return false;
      }
      var payload = $this.formatStoreInstanceItemsPayload();
      if (!payload) {
        return;
      }
      showLoadingModal('Saving...');
      storeInstanceFactory.updateStoreInstanceItemsBulk($routeParams.storeId, payload).then(function (responseData) {
        savePackingDataSuccessHandler(responseData, shouldUpdateStatus);
      }, showErrors);
    };

    $scope.saveAndExit = function () {
      if ($scope.readOnly) {
        $location.path(dashboardURL);
      } else {
        $scope.savePackingDataAndUpdateStatus(false);
      }
    };

    $scope.goToPreviousStep = function () {
      $location.path(prevStep.URL);
    };

    $scope.goToNextStep = function () {
      $scope.savePackingDataAndUpdateStatus(true);
    };

    $scope.showQty = function () {
      return ($routeParams.action === 'dispatch');
    };

    $scope.canProceed = function () {
      return ($scope.menuItems.length > 0 || $scope.emptyMenuItems.length > 0);
    };

  });
