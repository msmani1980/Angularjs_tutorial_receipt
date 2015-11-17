'use strict';
// jshint maxcomplexity:6

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function ($scope, storeInstancePackingFactory, $routeParams, lodash, ngToast, storeInstanceWizardConfig, $location, $q,
            dateUtility) {

    var $this = this;

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.errorHandler = function () {
      $this.hideLoadingModal();
    };

    this.getIdByNameFromArray = function (name, array) {
      var matchedObject = lodash.findWhere(array, {
        name: name
      });
      return (matchedObject) ? matchedObject.id : '';
    };

    this.getNameByIdFromArray = function (id, array) {
      var matchedObject = lodash.findWhere(array, {
        id: id
      });
      return (matchedObject) ? matchedObject.name : '';
    };

    this.saveStoreInstanceItem = function (storeInstanceId, item) {
      if (item.id) {
        return storeInstancePackingFactory.updateStoreInstanceItem(storeInstanceId, item.id, item);
      } else {
        return storeInstancePackingFactory.createStoreInstanceItem(storeInstanceId, item);
      }
    };

    this.deleteStoreInstanceItem = function (storeInstanceId, itemId) {
      return storeInstancePackingFactory.deleteStoreInstanceItem(storeInstanceId, itemId);
    };

    this.getThresholdVariance = function () {
      // TODO: update getThresholdList API, also check if 'dispatch' feature exists first
      $scope.variance = 10; // mock until API is done

      //storeInstancePackingFactory.getThresholdList('dispatch').then(function (dataFromAPI) {
      //  if (dataFromAPI.response) {
      //    $scope.variance = angular.copy(dataFromAPI.response[0].percentage);
      //  } else {
      //    $scope.variance = 99999999;
      //  }
      //}, showErrors);
    };


    this.getStoreInstanceMenuItems = function (storeInstanceId) {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var payload = {
        itemTypeId: $scope.regularItemTypeId,
        characteristicId: $scope.characteristicFilterId,
        date: payloadDate
      };
      return storeInstancePackingFactory.getStoreInstanceMenuItems(storeInstanceId, payload);
    };

    this.getStoreInstanceItems = function (storeInstanceId) {
      return storeInstancePackingFactory.getStoreInstanceItemList(storeInstanceId);
    };

    this.getMasterItemsList = function () {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var filterPayload = {
        itemTypeId: $scope.regularItemTypeId,
        startDate: payloadDate,
        endDate: payloadDate,
        characteristicId: $scope.characteristicFilterId
      };
      return storeInstancePackingFactory.getItemsMasterList(filterPayload);
    };

    this.getUllageReasonCodes = function () {
      storeInstancePackingFactory.getReasonCodeList().then(function (response) {
        $scope.ullageReasonCodes = lodash.filter(angular.copy(response.companyReasonCodes), {description: 'Ullage'});
      }, this.errorHandler);
    };

    this.getCharacteristicIdForName = function (characteristicName) {
      return storeInstancePackingFactory.getCharacteristics().then(function (response) {
        $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, response);
      }, this.errorHandler);
    };

    this.getRegularItemTypeId = function () {
      return storeInstancePackingFactory.getItemTypes().then(function (response) {
        $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', response);
      }, this.errorHandler);
    };

    this.getCountTypes = function () {
      storeInstancePackingFactory.getCountTypes().then(function (response) {
        $scope.countTypes = angular.copy(response);
      }, this.errorHandler);
    };

    this.getStoreDetails = function () {
      return storeInstancePackingFactory.getStoreDetails($routeParams.storeId).then(function (response) {
        $scope.storeDetails = angular.copy(response);
      }, this.errorHandler);
    };

    $scope.canProceed = function () {
      if ($routeParams.action === 'end-instance') {
        return ($scope.offloadListItems.length > 0 || $scope.newOffloadListItems.length > 0);
      }
      return ($scope.pickListItems.length > 0 || $scope.newPickListItems.length > 0);
    };

    $scope.filterPickListItems = function () {
      $scope.filteredItemsList = lodash.filter($scope.masterItemsList, function (item) {
        var pickListMatch = (lodash.findWhere($scope.pickListItems, {itemMasterId: item.id}));
        var newPickListMatch = (lodash.findWhere($scope.newPickListItems, {masterItem: item}));
        return !pickListMatch && !newPickListMatch;
      });
    };

    $scope.filterOffloadListItems = function () {
      $scope.filteredOffloadItemsList = lodash.filter($scope.masterItemsList, function (item) {
        var offloadMatch = (lodash.findWhere($scope.offloadListItems, {itemMasterId: item.id}));
        var newOffloadMatch = (lodash.findWhere($scope.newOffloadListItems, {masterItem: item}));
        var redispatchMatch = ($routeParams.action === 'redispatch') ? (lodash.findWhere($scope.pickListItems, {
          itemMasterId: item.id,
          isInOffload: false,
          shouldDisplayOffloadData: true
        })) : false;
        return !offloadMatch && !newOffloadMatch && !redispatchMatch;
      });
    };

    this.removeNewItem = function (itemToDelete) {
      var workingArray = (itemToDelete.isInOffload) ? $scope.newOffloadListItems : $scope.newPickListItems;
      var index = workingArray.indexOf(itemToDelete);
      workingArray.splice(index, 1);
    };

    this.removeExistingItemFromArray = function (itemToDelete) {
      var storeInstance = (itemToDelete.isInOffload && $routeParams.action === 'redispatch') ? $scope.storeDetails.prevStoreInstanceId : $routeParams.storeId;
      var itemArray = (itemToDelete.isInOffload) ? $scope.offloadListItems : $scope.pickListItems;

      angular.forEach(['picked', 'inbound', 'ullage'], function (quantity) {
        if (itemToDelete[quantity + 'Quantity'] && itemToDelete[quantity + 'Id']) {
          var deleteData = {
            id: itemToDelete[quantity + 'Id'],
            storeInstanceId: storeInstance
          };
          $this.itemsToDeleteArray.push(deleteData);
        }
      });
      var itemMatch = lodash.findWhere(itemArray, {itemMasterId: itemToDelete.itemMasterId});
      if (itemMatch) {
        lodash.remove(itemArray, itemMatch);
      }
    };

    $scope.removeRecord = function (itemToDelete) {
      if (!itemToDelete.isNewItem) {
        $this.removeExistingItemFromArray(itemToDelete);
      } else {
        $this.removeNewItem(itemToDelete);
      }
      $scope.filterPickListItems();
      $scope.filterOffloadListItems();
    };

    $scope.showDeleteWarning = function (item) {
      if (item.pickedQuantity > 0 || item.ullageQuantity > 0 || item.ullageReason || item.inboundQuantity > 0 || item.masterItem) {
        $scope.deleteRecordDialog(item, ['itemDescription']);
      } else {
        $scope.removeRecord(item);
      }
    };

    this.addItemsToArray = function (array, itemNumber, isInOffload) {
      for (var i = 0; i < itemNumber; i++) {
        var newItem = {
          menuQuantity: 0,
          isMenuItem: false,
          isNewItem: true,
          isInOffload: isInOffload
        };
        array.push(newItem);
      }
    };

    $scope.addOffloadItems = function () {
      $this.addItemsToArray($scope.newOffloadListItems, $scope.addOffloadNum, true);
    };

    $scope.addItems = function () {
      $this.addItemsToArray($scope.newPickListItems, $scope.addPickListNum, false);
    };

    $scope.canDeleteItem = function (item) {
      return item.isNewItem || (!item.isMenuItem);
    };


    this.addItemsToDeleteToPayload = function (promiseArray) {
      angular.forEach($this.itemsToDeleteArray, function (item) {
        promiseArray.push($this.deleteStoreInstanceItem(item.storeInstanceId, item.id));
      });
    };

    this.constructPayloadItem = function (item, quantity, countTypeName) {
      var countTypeId = $this.getIdByNameFromArray(countTypeName, $scope.countTypes);
      var payloadItem = {
        countTypeId: countTypeId,
        quantity: parseInt(angular.copy(quantity))
      };
      payloadItem.itemMasterId = (!item.isNewItem) ? item.itemMasterId : item.masterItem.id;
      if (countTypeName === 'Ullage') {
        payloadItem.ullageReasonCode = item.ullageReason.id;
      }
      return payloadItem;
    };


    this.addPickListItemsToPayload = function (promiseArray) {
      var mergedItems = angular.copy($scope.pickListItems).concat(angular.copy($scope.newPickListItems));
      angular.forEach(mergedItems, function (item) {
        if (item.pickedQuantity > 0) {
          var payloadItem = $this.constructPayloadItem(item, item.pickedQuantity, 'Warehouse Open');
          if (item.pickedId) {
            payloadItem.id = item.pickedId;
          }
          promiseArray.push($this.saveStoreInstanceItem($routeParams.storeId, payloadItem));
        }
      });
    };

    this.addOffloadItemsToPayload = function (promiseArray, isRedispatch) {
      var storeInstanceToUse = ($routeParams.action === 'end-instance') ? $routeParams.storeId : $scope.storeDetails.prevStoreInstanceId;
      var itemsArray = (isRedispatch) ? $scope.pickListItems : ($scope.offloadListItems.concat($scope.newOffloadListItems));
      angular.forEach(itemsArray, function (item) {
        if (item.ullageQuantity > 0) {
          var ullagePayloadItem = $this.constructPayloadItem(item, item.ullageQuantity, 'Ullage');
          if (item.ullageId) {
            ullagePayloadItem.id = item.ullageId;
          }
          promiseArray.push($this.saveStoreInstanceItem(storeInstanceToUse, ullagePayloadItem));
        }
        if (item.inboundQuantity > 0) {
          var countTypeName = (isRedispatch) ? 'Warehouse Close' : 'Offload';
          var offloadPayloadItem = $this.constructPayloadItem(item, item.inboundQuantity, countTypeName);
          if (item.inboundId) {
            offloadPayloadItem.id = item.inboundId;
          }
          promiseArray.push($this.saveStoreInstanceItem(storeInstanceToUse, offloadPayloadItem));
        }
      });
    };

    $scope.setUpdateStatusFlag = function (shouldUpdateStatus) {
      $scope.shouldUpdateStatus = shouldUpdateStatus;
    };

    $scope.save = function () {
      // TODO: check for ullage quantities

      $this.showLoadingModal();
      var promiseArray = [];
      $this.addItemsToDeleteToPayload(promiseArray);

      if ($routeParams.action !== 'end-instance') {
        $this.addPickListItemsToPayload(promiseArray);
      }
      if ($routeParams.action === 'end-instance' || $routeParams.action === 'redispatch') {
        $this.addOffloadItemsToPayload(promiseArray, false);
      }
      if ($routeParams.action === 'redispatch') {
        $this.addOffloadItemsToPayload(promiseArray, true);
      }
      $q.all(promiseArray).then(function () {
        if ($scope.shouldUpdateStatus) {
          console.log('UPDATE STATUS');
          $this.hideLoadingModal();
          // update Status To Next
          // redirect to home page
        } else {
          console.log('EXIT');
          $this.hideLoadingModal();
          // redirect to dashboard
        }
      });
    };

    $scope.shouldDisplayQuantityField = function (fieldName) {
      var actionToFieldMap = {
        'dispatch': ['template', 'picked'],
        'replenish': ['picked'],
        'end-instance': ['ullage', 'inbound'],
        'redispatch': ['inbound', 'ullage', 'template', 'dispatch', 'calcPicked']
      };
      return (actionToFieldMap[$routeParams.action].indexOf(fieldName) >= 0);
    };

    $scope.isActionState = function (actionState) {
      return $routeParams.action === actionState;
    };


    this.setInstanceReadOnly = function () {
      var currentStatus = $scope.storeDetails.currentStatus.name;
      if ($this.currentStep.stepName === currentStatus) {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
      } else {
        $scope.readOnly = true;
        $scope.saveButtonName = 'Exit';
        showToast('warning', 'Store Instance Status', 'This store instance is not ready for packing');  // TODO
      }
    };

    this.createFreshItem = function (itemFromAPI, isFromMenu) {
      var newItem = {
        itemDescription: itemFromAPI.itemCode + ' - ' + itemFromAPI.itemName,
        itemName: itemFromAPI.itemName,
        menuQuantity: (isFromMenu) ? itemFromAPI.menuQuantity : 0,
        pickedQuantity: 0,
        inboundQuantity: 0,
        ullageQuantity: 0,
        dispatchQuantity: 0,
        itemMasterId: itemFromAPI.itemMasterId,
        isMenuItem: isFromMenu,
        isNewItem: false,
        isInOffload: ($routeParams.action === 'end-instance')
      };
      return newItem;
    };

    this.setQuantityByType = function (itemFromAPI, itemToSet, isFromRedispatchInstance) {
      var countType = $this.getNameByIdFromArray(itemFromAPI.countTypeId, $scope.countTypes);
      if (countType === 'Warehouse Open' && !isFromRedispatchInstance) {
        itemToSet.pickedQuantity = itemFromAPI.quantity.toString();
        itemToSet.pickedId = itemFromAPI.id;
      } else if (countType === 'Offload' || countType === 'Warehouse Close') {
        itemToSet.inboundQuantity = itemFromAPI.quantity.toString();
        itemToSet.inboundId = itemFromAPI.id;
      } else if (countType === 'Ullage') {
        itemToSet.ullageQuantity = itemFromAPI.quantity.toString();
        var ullageReason = lodash.findWhere($scope.ullageReasonCodes, {id: itemFromAPI.ullageReasonCode});
        itemToSet.ullageReason = ullageReason || null;
        itemToSet.ullageId = itemFromAPI.id;
      }
      itemToSet.countTypeId = itemFromAPI.countTypeId;
    };

    this.findItemMatch = function (itemFromAPI) {
      var itemMatch;
      if ($routeParams.action === 'redispatch') {
        // offloadList match should be returned before pickList match. match in pickList and offloadList should not be merged
        itemMatch = lodash.findWhere($scope.offloadListItems, {itemMasterId: itemFromAPI.itemMasterId}) || lodash.findWhere($scope.pickListItems, {itemMasterId: itemFromAPI.itemMasterId});
      } else if ($routeParams.action === 'end-instance') {
        itemMatch = lodash.findWhere($scope.offloadListItems, {itemMasterId: itemFromAPI.itemMasterId});
      } else {
        itemMatch = lodash.findWhere($scope.pickListItems, {itemMasterId: itemFromAPI.itemMasterId});
      }
      return itemMatch;
    };

    this.mergeStoreInstanceMenuItems = function (items) {
      angular.forEach(items, function (item) {
        var newItem = $this.createFreshItem(item, true);
        if ($routeParams.action === 'end-instance') {
          $scope.offloadListItems.push(newItem);
        } else {
          $scope.pickListItems.push(newItem);
        }
      });
    };

    this.mergeStoreInstanceItems = function (items) {
      angular.forEach(items, function (item) {
        var itemMatch = $this.findItemMatch(item);
        if (!itemMatch) {
          var newItem = $this.createFreshItem(item, false);
          if ($routeParams.action === 'end-instance') {
            $scope.offloadListItems.push(newItem);
          } else {
            $scope.pickListItems.push(newItem);
          }
          itemMatch = newItem;
        }
        $this.setQuantityByType(item, itemMatch, false);
      });
    };

    // merge offload quantities fisrt to populate entire offload list, then fill in ullage and warehouse close values next.
    this.mergeRedispatchItems = function (items) {
      // sort items so all offload count types are processed first
      angular.forEach(items, function (item) {
        item.countTypeName = $this.getNameByIdFromArray(item.countTypeId, $scope.countTypes);
      });
      items = lodash.sortBy(items, 'countTypeName');

      angular.forEach(items, function (item) {
        var pickListMatch = lodash.findWhere($scope.pickListItems, {itemMasterId: item.itemMasterId});
        var offloadListMatch = lodash.findWhere($scope.offloadListItems, {itemMasterId: item.itemMasterId});
        var itemMatch;
        if ((!pickListMatch && !offloadListMatch) || (!offloadListMatch && item.countTypeName === 'Offload')) {
          var newItem = $this.createFreshItem(item, false);
          newItem.isInOffload = true;
          $scope.offloadListItems.push(newItem);
          itemMatch = newItem;
        } else if (offloadListMatch) {
          itemMatch = offloadListMatch;
        } else {
          pickListMatch.shouldDisplayOffloadData = true;
          itemMatch = pickListMatch;
        }
        $this.setQuantityByType(item, itemMatch, true);
      });
    };

    this.mergeAllItems = function (responseCollection) {
      $scope.masterItemsList = angular.copy(responseCollection[0].masterItems);
      $this.mergeStoreInstanceMenuItems(angular.copy(responseCollection[1].response));
      $this.mergeStoreInstanceItems(angular.copy(responseCollection[2].response));
      if (responseCollection[3]) {
        $this.mergeRedispatchItems(angular.copy(responseCollection[3].response));
      }
      $scope.filterOffloadListItems();
      $scope.filterPickListItems();
      $this.hideLoadingModal();
    };

    this.getAllItems = function () {
      var storeInstanceForMenuItems = ($routeParams.action === 'replenish') ? $scope.storeDetails.replenishStoreInstanceId :
        $routeParams.storeId;
      var getItemsPromises = [
        $this.getMasterItemsList(),
        $this.getStoreInstanceMenuItems(storeInstanceForMenuItems),
        $this.getStoreInstanceItems($routeParams.storeId)
      ];
      if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
        getItemsPromises.push($this.getStoreInstanceItems($scope.storeDetails.prevStoreInstanceId));
      }

      $q.all(getItemsPromises).then($this.mergeAllItems, $this.showErrors);
    };

    this.makeInitializePromises = function () {
      var characteristicName = ($routeParams.action === 'replenish') ? 'Upliftable' : 'Inventory';
      var promises = [
        this.getStoreDetails(),
        this.getRegularItemTypeId(),
        this.getThresholdVariance(),
        this.getCountTypes(),
        this.getCharacteristicIdForName(characteristicName)
      ];
      if ($routeParams.action === 'end-instance' || $routeParams.action === 'redispatch') {
        promises.push($this.getUllageReasonCodes());
      }
      return promises;
    };

    this.initWizardSteps = function () {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: 'Packing'
      });
      $this.currentStep = angular.copy($scope.wizardSteps[currentStepIndex]);
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
      $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);
    };

    this.initControllerVars = function () {
      $this.itemsToDeleteArray = [];
      $scope.pickListItems = [];
      $scope.newPickListItems = [];
      $scope.addPickListNum = 1;
      $scope.filteredItemsList = [];

      if ($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') {
        $scope.offloadListItems = [];
        $scope.newOffloadListItems = [];
        $scope.addOffloadNum = 1;
        $scope.filteredOffloadItemsList = [];
      }
    };

    this.completeInitializeAfterDependencies = function () {
      $this.setInstanceReadOnly();
      $this.getAllItems();
    };

    this.init = function () {
      $this.showLoadingModal('Loading Store Detail for Packing...');
      $this.initWizardSteps();
      $this.initControllerVars();
      var promises = $this.makeInitializePromises();
      $q.all(promises).then($this.completeInitializeAfterDependencies);
    };

    $this.init();
  });
