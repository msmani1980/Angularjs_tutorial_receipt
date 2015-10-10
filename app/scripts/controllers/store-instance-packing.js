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

    this.addItemsToArray = function (array, itemNumber, isInOffload) {
      if ($scope.filteredMasterItemList.length === 0) {
        showToast('warning', 'Add Item', 'There are no items available');
        return;
      }
      for (var i = 0; i < itemNumber; i++) {
        array.push({
          menuQuantity: 0,
          isNewItem: true,
          isInOffload: isInOffload
        });
      }
    };

    $scope.addItems = function () {
      $this.addItemsToArray($scope.emptyMenuItems, $scope.addItemsNumber, false);
    };

    $scope.addOffloadItems = function () {
      $this.addItemsToArray($scope.emptyOffloadMenuItems, $scope.addOffloadItemsQty, true);
    };


    function errorHandler() {
      hideLoadingModal();
    }

    $this.calculatePickedQtyFromTotal = function (item) {
      var totalQuantity = angular.copy(item.totalQuantity);
      item.quantity = parseInt(totalQuantity);
      item.quantity += parseInt(item.ullageQuantity) || 0;
      item.quantity -= parseInt(item.inboundQuantity) || 0;
      item.quantity = item.quantity.toString();
    };

    this.mergeIfItemHasPickListMatch = function (item, itemMatch) {
      lodash.extend(itemMatch, item);
      $this.calculatePickedQtyFromTotal(itemMatch);
    };

    this.mergeNewInstanceItem = function (item) {
      var offloadItemMatch = lodash.findWhere($scope.offloadMenuItems, {itemMasterId: item.itemMasterId});
      if (offloadItemMatch) {
        var mergedItem = lodash.extend(angular.copy(item), angular.copy(offloadItemMatch));
        mergedItem.isInOffload = false;
        $scope.menuItems.push(mergedItem);
        $this.calculatePickedQtyFromTotal(mergedItem);
        lodash.remove($scope.offloadMenuItems, offloadItemMatch);
      } else {
        $scope.menuItems.push(item);
      }
    };

    this.mergePrevInstanceItem = function (item) {
      var offloadItemMatch = lodash.findWhere($scope.offloadMenuItems, {itemMasterId: item.itemMasterId});
      if (offloadItemMatch) {
        lodash.extend(offloadItemMatch, item);
      } else {
        item.isInOffload = true;
        $scope.offloadMenuItems.push(item);
      }
    };

    this.mergeMenuItemsForRedispatch = function (menuItemsFromAPI) {
      angular.forEach(menuItemsFromAPI, function (item) {
        var itemMatch = lodash.findWhere($scope.menuItems, {itemMasterId: item.itemMasterId});
        if (itemMatch) {
          $this.mergeIfItemHasPickListMatch(item, itemMatch);
        } else {
          var storeInstanceItemType = (item.storeInstanceId === parseInt($routeParams.storeId)) ? 'NewInstance' : 'PrevInstance';
          var mergeFunctionName = 'merge' + storeInstanceItemType + 'Item';
          $this[mergeFunctionName](item);
        }
      });
      hideLoadingModal();
    };

    this.mergeMenuItems = function (menuItemsFromAPI) {
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

    $this.getItemType = function (item) {
      var inboundCountTypeId = $this.getIdByNameFromArray('Offload', $scope.countTypes);
      var ullageCountTypeId = $this.getIdByNameFromArray('Ullage', $scope.countTypes);
      if (angular.isDefined(item.menuQuantity)) {
        return 'Template';
      } else if (angular.isDefined(item.quantity) && angular.isDefined(item.countTypeId) && item.countTypeId === inboundCountTypeId) {
        return 'Inbound';
      } else if (angular.isDefined(item.quantity) && angular.isDefined(item.countTypeId) && item.countTypeId === ullageCountTypeId) {
        return 'Ullage';
      }
      return 'Packed';
    };

    $this.formatTemplateItem = function (item) {
      delete item.id;
    };

    $this.formatPackedItem = function (item) {
      if ($routeParams.action === 'redispatch') {
        item.totalQuantity = item.quantity;
        $this.calculatePickedQtyFromTotal(item);
      }
      item.quantity = item.quantity.toString();
    };

    $this.formatInboundItem = function (item) {
      item.inboundQuantity = angular.copy(item.quantity.toString());
      item.inboundQuantityId = angular.copy(item.id);
      delete item.quantity;
      delete item.id;
    };

    $this.formatUllageItem = function (item) {
      item.ullageQuantity = angular.copy(item.quantity.toString());
      item.ullageId = angular.copy(item.id);
      var itemUllageReasonObject = lodash.findWhere($scope.ullageReasonCodes, {id: item.ullageReasonCode});
      item.ullageReason = itemUllageReasonObject || null;
      delete item.quantity;
      delete item.id;
    };

    function getItemsSuccessHandler(dataFromAPI) {
      if (!dataFromAPI.response) {
        hideLoadingModal();
        return;
      }
      var menuItems = angular.copy(dataFromAPI.response);
      angular.forEach(menuItems, function (item) {
        var itemType = $this.getItemType(item);
        var formatItemFunctionName = 'format' + itemType + 'Item';
        $this[formatItemFunctionName](item);
        item.itemDescription = item.itemCode + ' - ' + item.itemName;
      });
      if ($routeParams.action === 'redispatch') {
        $this.mergeMenuItemsForRedispatch(menuItems);
      } else {
        $this.mergeMenuItems(menuItems);
      }
    }

    this.getIdByNameFromArray = function (name, array) {
      var matchedObject = lodash.findWhere(array, {name: name});
      if (matchedObject) {
        return matchedObject.id;
      }
      return '';
    };

    this.getStoreInstanceItems = function (storeInstanceId) {
      storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then(getItemsSuccessHandler, showErrors);
    };

    this.getRegularItemTypeIdSuccess = function (dataFromAPI) {
      $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', dataFromAPI);
    };

    this.getRegularItemTypeId = function () {
      return storeInstanceFactory.getItemTypes().then($this.getRegularItemTypeIdSuccess);
    };

    this.getUpliftableCharacteristicIdSuccess = function (dataFromAPI, characteristicName) {
      $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, dataFromAPI);
    };

    this.getCharacteristicIdForName = function (characteristicName) {
      return storeInstanceFactory.getCharacteristics().then(function (dataFromAPI) {
        $this.getUpliftableCharacteristicIdSuccess(dataFromAPI, characteristicName);
      });
    };

    this.getUpliftableCharacteristicIdSuccess = function (dataFromAPI, characteristicName) {
      $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, dataFromAPI);
    };

    this.getCharacteristicIdForName = function (characteristicName) {
      return storeInstanceFactory.getCharacteristics().then(function (dataFromAPI) {
        $this.getUpliftableCharacteristicIdSuccess(dataFromAPI, characteristicName);
      });
    };

    this.getUlageReasonCodesSuccess = function (dataFromAPI) {
      $scope.ullageReasonCodes = lodash.filter(angular.copy(dataFromAPI.companyReasonCodes), function (reason) {
        return reason.description === 'Ullage';
      });
    };

    this.getUlageReasonCodes = function () {
      storeInstanceFactory.getReasonCodeList().then($this.getUlageReasonCodesSuccess, showErrors);
    };

    this.getCountTypesSuccess = function (dataFromAPI) {
      $scope.countTypes = angular.copy(dataFromAPI);
    };

    this.getCountTypes = function () {
      storeInstanceFactory.getCountTypes().then($this.getCountTypesSuccess, showErrors);
    };

    this.getStoreInstanceMenuItems = function (storeInstanceId) {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var payload = {
        itemTypeId: $scope.regularItemTypeId,
        date: payloadDate
      };

      if ($scope.characteristicFilterId) {
        payload.characteristicId = $scope.characteristicFilterId;
      }
      storeInstanceFactory.getStoreInstanceMenuItems(storeInstanceId, payload).then(getItemsSuccessHandler, showErrors);
    };

    $scope.$watchGroup(['masterItemsList', 'menuItems'], function () {
      $scope.filteredMasterItemList = lodash.filter($scope.masterItemsList, function (item) {
        var mergedMenuItems = angular.copy($scope.menuItems).concat(angular.copy($scope.offloadMenuItems));
        return !(lodash.findWhere(mergedMenuItems, {itemMasterId: item.id}));
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
      if ($scope.characteristicFilterId) {
        filterPayload.characteristicId = $scope.characteristicFilterId;
      }
      storeInstanceFactory.getItemsMasterList(filterPayload).then($this.getMasterItemsListSuccess, showErrors);
    };

    function updateStoreDetails(response, stepObject) {
      $scope.storeDetails.currentStatus = lodash.findWhere($scope.storeDetails.statusList, {id: response.statusId});
      $location.path(stepObject.uri);
    }

    function updateStatusToStep(stepObject, storeInstanceId, shouldRedirectToStep) {
      storeInstanceFactory.updateStoreInstanceStatus(storeInstanceId, stepObject.stepName).then(function (response) {
        if (shouldRedirectToStep) {
          updateStoreDetails(response, stepObject, storeInstanceId);
        }
      }, showErrors);
    }

    this.getStoreDetailsSuccess = function (dataFromAPI) {
      $scope.storeDetails = angular.copy(dataFromAPI);
    };

    this.getStoreDetails = function () {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then(this.getStoreDetailsSuccess, errorHandler);
    };

    function savePackingDataSuccessHandler(dataFromAPI) {
      $scope.emptyMenuItems = [];
      angular.forEach(dataFromAPI.response, function (item) {
        var masterItem = lodash.findWhere($scope.masterItemsList, {id: item.itemMasterId});
        item.itemCode = angular.isDefined(masterItem) ? masterItem.itemCode : '';
        item.itemName = angular.isDefined(masterItem) ? masterItem.itemName : '';
      });
      getItemsSuccessHandler(dataFromAPI);
    }

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
      var mergedMenuItems = (angular.copy($scope.emptyMenuItems));
      if ($routeParams.action === 'redispatch') {
        mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.emptyOffloadMenuItems));
      }
      angular.forEach(mergedMenuItems, function (item) {
        duplicatesExist = duplicatesExist || $this.checkForDuplicate(item);
      });
      return duplicatesExist;
    };

    this.checkForEmptyItemsInPayload = function () {
      var emptyItemsExist = false;
      var mergedMenuItems = (angular.copy($scope.emptyMenuItems));
      if ($routeParams.action === 'redispatch') {
        mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.emptyOffloadMenuItems));
      }
      angular.forEach(mergedMenuItems, function (item) {
        emptyItemsExist = emptyItemsExist || (!item.itemMasterId && !item.masterItem);
      });
      return emptyItemsExist;
    };

    this.checkForIncompleteUllagePayload = function () {
      if ($routeParams.action !== 'end-instance' && $routeParams.action !== 'redispatch') {
        return false;
      }
      var mergedMenuItems = angular.copy($scope.menuItems).concat(angular.copy($scope.emptyMenuItems));
      if ($routeParams.action === 'redispatch') {
        mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.offloadMenuItems));
        mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.emptyOffloadMenuItems));
      }

      var ullageDataIncomplete = false;
      angular.forEach(mergedMenuItems, function (item) {
        ullageDataIncomplete = ullageDataIncomplete || (item.ullageQuantity > 0 && !item.ullageReason);
      });
      return ullageDataIncomplete;
    };

    this.dispatchAndReplenishCreatePayload = function (item, workingPayload) {
      var itemPayload = {
        itemMasterId: item.itemMasterId || item.masterItem.id,
        quantity: parseInt(item.quantity) || 0
      };
      if (item.id) {
        itemPayload.id = item.id;
      }
      workingPayload.push(itemPayload);
    };

    this.createUllagePayload = function (item) {
      var ullageCountTypeId = $this.getIdByNameFromArray('Ullage', $scope.countTypes);
      var ullagePayload = {
        itemMasterId: item.itemMasterId || item.masterItem.id,
        quantity: parseInt(item.ullageQuantity),
        countTypeId: ullageCountTypeId
      };
      if (item.ullageQuantity > 0) {
        ullagePayload.ullageReasonCode = item.ullageReason.id;
      }
      if (item.ullageId) {
        ullagePayload.id = item.ullageId;
      }
      return ullagePayload;
    };

    this.createInboundPayload = function (item) {
      var inboundCountTypeId = $this.getIdByNameFromArray('Offload', $scope.countTypes);
      var inboundPayload = {
        itemMasterId: item.itemMasterId || item.masterItem.id,
        quantity: parseInt(item.inboundQuantity),
        countTypeId: inboundCountTypeId
      };
      if (item.inboundQuantityId) {
        inboundPayload.id = item.inboundQuantityId;
      }
      return inboundPayload;
    };

    this.createDispatchedPayload = function (item) {
      var dispatchedCountTypeId = $this.getIdByNameFromArray('Warehouse Open', $scope.countTypes);
      var dispatchedPayload = {
        itemMasterId: item.itemMasterId || item.masterItem.id,
        quantity: $scope.calculateTotalDispatchedQty(item),
        countTypeId: dispatchedCountTypeId
      };
      if (item.id) {
        dispatchedPayload.id = item.id;
      }
      return dispatchedPayload;
    };

    this.endInstanceCreatePayload = function (item, workingPayload) {
      var ullagePayload = $this.createUllagePayload(item);
      var inboundPayload = $this.createInboundPayload(item);
      workingPayload.push(ullagePayload);
      workingPayload.push(inboundPayload);
    };

    this.redispatchCreatePayload = function (item, workingPayload) {

      if (item.ullageQuantity) {
        var ullagePayload = $this.createUllagePayload(item);
        workingPayload.prevStoreInstancePayload.push(ullagePayload);
      }
      if (item.inboundQuantity) {
        var inboundPayload = $this.createInboundPayload(item);
        workingPayload.prevStoreInstancePayload.push(inboundPayload);
      }
      if (!item.isInOffload) {
        var dispatchedPayload = $this.createDispatchedPayload(item);
        workingPayload.currentStoreInstancePayload.push(dispatchedPayload);
      }
    };

    this.createPayload = function () {
      var newPayload = {response: []};
      var mergedItems = $scope.menuItems.concat($scope.emptyMenuItems);
      angular.forEach(mergedItems, function (item) {
        if ($routeParams.action === 'end-instance') {
          $this.endInstanceCreatePayload(item, newPayload.response);
        } else {
          $this.dispatchAndReplenishCreatePayload(item, newPayload.response);
        }
      });
      return newPayload;
    };

    $this.createPayloadForRedispatch = function () {
      var combinedPayload = {currentStoreInstancePayload: [], prevStoreInstancePayload: []};
      var mergedItems = $scope.menuItems.concat($scope.emptyMenuItems);
      mergedItems = mergedItems.concat($scope.offloadMenuItems);
      mergedItems = mergedItems.concat($scope.emptyOffloadMenuItems);

      angular.forEach(mergedItems, function (item) {
        $this.redispatchCreatePayload(item, combinedPayload);
      });
      return combinedPayload;
    };

    this.createPayloadAndSave = function (shouldUpdateStatus, redirectURL) {
      var payload = $this.createPayload();
      showLoadingModal('Saving...');
      storeInstanceFactory.updateStoreInstanceItemsBulk($routeParams.storeId, payload).then(function (responseData) {
        savePackingDataSuccessHandler(responseData);
        if (shouldUpdateStatus) {
          updateStatusToStep($this.nextStep, $routeParams.storeId, true);
        } else {
          showToast('success', 'Save Packing Data', 'Data successfully updated!');
          $location.path(redirectURL);
        }
        hideLoadingModal();
      });
    };

    this.makeUpdateStatusPromisesForRedispatch = function () {
      var promises = [
        updateStatusToStep($this.nextStep, $routeParams.storeId, true),
        updateStatusToStep($this.prevInstanceNextStep, $scope.storeDetails.prevStoreInstanceId, false)
      ];
      $q.all(promises).then(function () {
        hideLoadingModal();
      });
    };

    this.createPayloadAndSaveForRedispatch = function (shouldUpdateStatus, redirectURL) {
      showLoadingModal('Saving...');
      var combinedPayload = $this.createPayloadForRedispatch();
      var currentStorePayload = {response: combinedPayload.currentStoreInstancePayload};
      var prevStorePayload = {response: combinedPayload.prevStoreInstancePayload};
      var promises = [
        storeInstanceFactory.updateStoreInstanceItemsBulk($routeParams.storeId, currentStorePayload),
      ];
      if (prevStorePayload.response.length > 0) {
        promises.push(storeInstanceFactory.updateStoreInstanceItemsBulk($scope.storeDetails.prevStoreInstanceId, prevStorePayload));
      }
      $q.all(promises).then(function () {
        hideLoadingModal();
        if (shouldUpdateStatus) {
          $this.makeUpdateStatusPromisesForRedispatch();
        } else {
          showToast('success', 'Save Packing Data', 'Data successfully updated!');
          $location.path(redirectURL);
        }
      });

      // make 2 API calls for save and 2 for update status
    };

    this.checkFormValidity = function () {
      if ($scope.storeInstancePackingForm.$invalid) {
        showToast('danger', 'Save Items', 'All Packed quantities must be a number');
        return false;
      }
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
      var ullagePayloadIncomplete = $this.checkForIncompleteUllagePayload();
      if (ullagePayloadIncomplete) {
        showToast('danger', 'Save Items', 'All items with an ullage quantity require an ullage reason');
        return false;
      }
      return true;
    };


    this.isStatusCorrectForSetAction = function (statusName) {
      if ($routeParams.action === 'end-instance' && statusName === '7') {
        return true;
      } else if ($routeParams.action !== 'end-instance' && statusName === '1') {
        return true;
      }
      return false;
    };

    this.isInstanceReadOnly = function () {
      if ($this.isStatusCorrectForSetAction($scope.storeDetails.currentStatus.name)) {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
      } else {
        showToast('warning', 'Store Instance Status', 'This store instance is not ready for packing');
      }
    };

    this.completeInitializeAfterDependencies = function () {
      $this.isInstanceReadOnly();
      $this.getMasterItemsList();
      $this.getStoreInstanceItems($routeParams.storeId);
      var storeInstanceForMenuItems = ($routeParams.action === 'replenish') ? $scope.storeDetails.replenishStoreInstanceId : $routeParams.storeId;
      $this.getStoreInstanceMenuItems(storeInstanceForMenuItems);

      if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
        $this.getStoreInstanceItems($scope.storeDetails.prevStoreInstanceId);
      }
    };

    this.makeInitializePromises = function () {
      var promises = [
        this.getStoreDetails(),
        this.getRegularItemTypeId()
      ];

      if ($routeParams.action === 'end-instance' || $routeParams.action === 'redispatch') {
        promises.push($this.getCountTypes());
        promises.push($this.getUlageReasonCodes());
      }

      var characteristicForAction = {
        'replenish': 'Upliftable',
        'end-instance': 'Inventory',
        'redispatch': 'Inventory'
      };
      if (characteristicForAction[$routeParams.action]) {
        promises.push(this.getCharacteristicIdForName(characteristicForAction[$routeParams.action]));
      }

      return promises;
    };

    this.redispatchInit = function () {
      $scope.offloadMenuItems = [];
      $scope.emptyOffloadMenuItems = [];
      $scope.addOffloadItemsQty = 1;

      $scope.prevInstanceWizardSteps = storeInstanceWizardConfig.getSteps('end-instance', $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.prevInstanceWizardSteps, {controllerName: 'Packing'});
      $this.prevInstanceNextStep = angular.copy($scope.prevInstanceWizardSteps[currentStepIndex + 1]);
      $this.prevInstancePrevStep = angular.copy($scope.prevInstanceWizardSteps[currentStepIndex - 1]);
    };

    this.initialize = function () {
      showLoadingModal('Loading Store Detail for Packing...');

      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {controllerName: 'Packing'});
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
      $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);

      $scope.menuItems = [];
      $scope.emptyMenuItems = [];
      if ($routeParams.action === 'redispatch') {
        $this.redispatchInit();
      }
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
      var workingArray = (itemToDelete.isInOffload) ? $scope.emptyOffloadMenuItems : $scope.emptyMenuItems;
      var index = workingArray.indexOf(itemToDelete);
      workingArray.splice(index, 1);
    }

    $scope.removeRecord = function (itemToDelete) {
      if (itemToDelete.isNewItem) {
        removeNewItem(itemToDelete);
      } else {
        var storeInstance = (itemToDelete.isInOffload && $scope.storeDetails.prevStoreInstanceId) ? $scope.storeDetails.prevStoreInstanceId : $routeParams.storeId;
        storeInstanceFactory.deleteStoreInstanceItem(storeInstance, itemToDelete.id).then($this.initialize, showErrors);
      }
    };

    $scope.savePackingDataAndUpdateStatus = function (shouldUpdateStatus, redirectURL) {
      if ($scope.readOnly) {
        $location.path(dashboardURL);
        return;
      }
      var isFormValid = $this.checkFormValidity();
      if (isFormValid && $routeParams.action === 'redispatch') {
        $this.createPayloadAndSaveForRedispatch(shouldUpdateStatus, redirectURL);
      } else if (isFormValid) {
        $this.createPayloadAndSave(shouldUpdateStatus, redirectURL);
      }

    };

    $scope.saveAndExit = function () {
      if ($scope.readOnly) {
        $location.path(dashboardURL);
      } else {
        $scope.savePackingDataAndUpdateStatus(false, dashboardURL);
      }
    };

    // TODO: handle redispatch previous!!
    $scope.goToPreviousStep = function () {
      if ($routeParams.action === 'end-instance') {
        showLoadingModal('Updating Status...');
        updateStatusToStep($this.prevStep, $routeParams.storeId, true);
      } else if($routeParams.action === 'redispatch') {
        showLoadingModal('Updating Status...');
        updateStatusToStep($this.prevStep, $routeParams.storeId, true);
        updateStatusToStep($this.prevInstancePrevStep, $scope.storeDetails.prevStoreInstanceId, false);
      } else {
        $location.path($this.prevStep.uri);
      }
    };

    $scope.goToNextStep = function () {
      var shouldUpdateStatus = ($routeParams.action !== 'end-instance');
      $scope.savePackingDataAndUpdateStatus(shouldUpdateStatus, $this.nextStep.uri);
    };

    $scope.canProceed = function () {
      return ($scope.menuItems.length > 0 || $scope.emptyMenuItems.length > 0);
    };

    $scope.isActionState = function (actionState) {
      return $routeParams.action === actionState;
    };

    $scope.shouldDisplayQuantityField = function (fieldName) {
      var actionToFieldMap = {
        'dispatch': ['template', 'packed'],
        'replenish': ['packed'],
        'end-instance': ['ullage', 'inbound'],
        'redispatch': ['inbound', 'ullage', 'template', 'packed', 'dispatch']
      };
      return (actionToFieldMap[$routeParams.action].indexOf(fieldName) >= 0);
    };

    $scope.shouldDisplayInboundFields = function (item) {
      return ($routeParams.action === 'end-instance') || ($routeParams.action === 'redispatch' && angular.isDefined(item.inboundQuantity));
    };

    $scope.calculateTotalDispatchedQty = function (item) {
      var total = parseInt(item.quantity) || 0;
      total += parseInt(item.inboundQuantity) || 0;
      total -= parseInt(item.ullageQuantity) || 0;
      return total;
    };

  });
