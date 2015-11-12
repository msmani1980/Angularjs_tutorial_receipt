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
  function ($scope, storeInstanceFactory, $routeParams, lodash, ngToast, storeInstanceWizardConfig, $location, $q,
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


    $scope.isNewItem = function (item) {
      return item.isNewItem;
    };

    $scope.shouldDisplayQuantityField = function (fieldName) {
      var actionToFieldMap = {
        'dispatch': ['template', 'picked'],
        'replenish': ['picked'],
        'end-instance': ['ullage', 'inbound'],
        'redispatch': ['inbound', 'ullage', 'template', 'picked', 'dispatch']
      };
      return (actionToFieldMap[$routeParams.action].indexOf(fieldName) >= 0);
    };

    $scope.isActionState = function (actionState) {
      return $routeParams.action === actionState;
    };

    this.getThresholdVariance = function () {
      // TODO: update getThresholdList API, also check if 'dispatch' feature exists first
      $scope.variance = 10; // mock until API is done

      //storeInstanceFactory.getThresholdList('dispatch').then(function (dataFromAPI) {
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
      return storeInstanceFactory.getStoreInstanceMenuItems(storeInstanceId, payload);
    };

    this.getStoreInstanceItems = function (storeInstanceId) {
      return storeInstanceFactory.getStoreInstanceItemList(storeInstanceId);
    };

    this.getMasterItemsList = function () {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var filterPayload = {
        itemTypeId: $scope.regularItemTypeId,
        startDate: payloadDate,
        endDate: payloadDate,
        characteristicId: $scope.characteristicFilterId
      };
      storeInstanceFactory.getItemsMasterList(filterPayload).then(function (response) {
        $scope.masterItemsList = angular.copy(response.masterItems);
      }, this.errorHandler);
    };

    this.getUllageReasonCodes = function () {
      storeInstanceFactory.getReasonCodeList().then(function (response) {
        $scope.ullageReasonCodes = lodash.filter(angular.copy(response.companyReasonCodes), {description: 'Ullage'});
      }, this.errorHandler);
    };

    this.getCharacteristicIdForName = function (characteristicName) {
      return storeInstanceFactory.getCharacteristics().then(function (response) {
        $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, response);
      }, this.errorHandler);
    };

    this.getRegularItemTypeId = function () {
      return storeInstanceFactory.getItemTypes().then(function (response) {
        $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', response);
      }, this.errorHandler);
    };

    this.getCountTypes = function () {
      storeInstanceFactory.getCountTypes().then(function (response) {
        $scope.countTypes = angular.copy(response);
      }, this.errorHandler);
    };


    this.getStoreDetails = function () {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then(function (response) {
        $scope.storeDetails = angular.copy(response);
      }, this.errorHandler);
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
        itemMasterId: itemFromAPI.itemMasterId,
        isNewItem: !isFromMenu
      };
      if(!isFromMenu) {
        newItem.id = itemFromAPI.id;
      }
      return newItem;
    };

    this.mergeStoreInstanceMenuItems = function (items) {
      angular.forEach(items, function (item) {
        var newItem = $this.createFreshItem(item, true);
        if($routeParams.action === 'end-instance') {
          $scope.offloadListItems.push(newItem);
        } else {
          $scope.pickListItems.push(newItem);
        }
      });
    };

    this.setQuantityByType = function (itemFromAPI, itemToSet) {
      var countType = $this.getNameByIdFromArray(itemFromAPI.countTypeId, $scope.countTypes);
      if(countType === 'Warehouse Open') {
        itemToSet.pickedQuantity = itemFromAPI.quantity;
      } else if(countType === 'Offload') {
        itemToSet.inboundQuantity = itemFromAPI.quantity;
      } else if(countType === 'Ullage') {
        itemToSet.ullageQuantity = itemFromAPI.quantity;
        var ullageReason = lodash.findWhere($scope.ullageReasonCodes, {id: itemFromAPI.ullageReasonCode});
        itemToSet.ullageReason = ullageReason || null;
      }
      itemToSet.countTypeId = itemFromAPI.countTypeId;
    };

    this.mergeStoreInstanceRedispatchItems = function (items) {
      angular.forEach(items, function (item) {
        var itemMatch = lodash.findWhere($scope.pickListItems, {itemMasterId: item.itemMasterId});
        var offloadItemMatch = lodash.findWhere($scope.offloadListItems, {itemMasterId: item.itemMasterId});
        itemMatch = itemMatch || offloadItemMatch;
        if(itemMatch) {
          $this.setQuantityByType(item, itemMatch);
        } else {
          var newItem = $this.createFreshItem(item, false);
          $scope.offloadListItems.push(newItem);
        }
      });
    };

    this.mergeStoreInstanceItems = function (items) {
      var listToCheck = ($routeParams.action === 'end-instance') ? $scope.offloadListItems : $scope.pickListItems;
      angular.forEach(items, function (item) {
        var itemMatch = lodash.findWhere(listToCheck, {itemMasterId: item.itemMasterId});
        if(!itemMatch) {
          var newItem = $this.createFreshItem(item, false);
          if($routeParams.action === 'end-instance') {
            $scope.offloadListItems.push(newItem);
          } else {
            $scope.pickListItems.push(newItem);
          }
          itemMatch = newItem;
        }
        $this.setQuantityByType(item, itemMatch);
      });
    };

    this.mergeAllItems = function (responseCollection) {
      console.log('hi! ', responseCollection);
      $this.mergeStoreInstanceMenuItems(angular.copy(responseCollection[0].response));
      $this.mergeStoreInstanceItems(angular.copy(responseCollection[1].response));
      if(responseCollection[2]) {
        $this.mergeStoreInstanceRedispatchItems(angular.copy(responseCollection[2].response));
      }
      $this.hideLoadingModal();
    };

    this.getAllStoreInstanceItems = function () {
      var storeInstanceForMenuItems = ($routeParams.action === 'replenish') ? $scope.storeDetails.replenishStoreInstanceId :
        $routeParams.storeId;
      var getItemsPromises = [
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

      if ($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') {
        $scope.offloadListItems = [];
        $scope.newOffloadListItems = [];
      }
    };

    this.completeInitializeAfterDependencies = function () {
      $this.setInstanceReadOnly();
      $this.getMasterItemsList();
      $this.getAllStoreInstanceItems();
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

//  this.actions = {};
//  var $this = this;
//
//  $scope.emptyMenuItems = [];
//  $scope.filteredMasterItemList = [];
//  $scope.filteredOffloadMasterItemList = [];
//  $scope.addItemsNumber = 1;
//  $scope.readOnly = true;
//  $scope.saveButtonName = 'Exit';
//  this.itemsToDeleteArray = [];
//  var dashboardURL = 'store-instance-dashboard';
//  $scope.shouldUpdateStatusOnSave = false;
//
//  function showToast(className, type, message) {
//    ngToast.create({
//      className: className,
//      dismissButton: true,
//      content: '<strong>' + type + '</strong>: ' + message
//    });
//  }
//
//  function showErrors(dataFromAPI) {
//    showToast('warning', 'Store Instance Packing', 'error saving items!');
//    $scope.displayError = true;
//    if ('data' in dataFromAPI) {
//      $scope.formErrors = dataFromAPI.data;
//    }
//  }
//
//  function showLoadingModal(text) {
//    angular.element('#loading').modal('show').find('p').text(text);
//  }
//
//  function hideLoadingModal() {
//    angular.element('#loading').modal('hide');
//  }
//
//  $scope.deleteNewItem = function (itemIndex) {
//    $scope.emptyMenuItems.splice(itemIndex, 1);
//  };
//
//  this.addItemsToArray = function (array, itemNumber, isInOffload) {
//    if (($scope.filteredMasterItemList.length === 0 && !isInOffload) || ($scope.filteredOffloadMasterItemList.length === 0 && isInOffload)) {
//      showToast('warning', 'Add Item', 'There are no items available');
//      return;
//    }
//    for (var i = 0; i < itemNumber; i++) {
//      var newItem = {
//        menuQuantity: 0,
//        isNewItem: true,
//        isInOffload: isInOffload
//      };
//      array.push(newItem);
//
//    }
//  };
//
//  $scope.addItems = function () {
//    var isEndInstance = $routeParams.action === 'end-instance';
//    $this.addItemsToArray($scope.emptyMenuItems, $scope.addItemsNumber, isEndInstance);
//  };
//
//  $scope.addOffloadItems = function () {
//    $this.addItemsToArray($scope.emptyOffloadMenuItems, $scope.addOffloadItemsQty, true);
//  };
//
//
//  function errorHandler() {
//    hideLoadingModal();
//  }
//
//  $this.calculatePickedQtyFromTotal = function (item) {
//    var totalQuantity = angular.copy(item.totalQuantity) || 0;
//    item.quantity = parseInt(totalQuantity);
//    item.quantity += parseInt(item.ullageQuantity) || 0;
//    item.quantity -= parseInt(item.inboundQuantity) || 0;
//    item.quantity = item.quantity.toString();
//  };
//
//  this.mergeIfItemHasPickListMatch = function (item, itemMatch) {
//    lodash.extend(itemMatch, item);
//    $this.calculatePickedQtyFromTotal(itemMatch);
//  };
//
//  this.mergeNewInstanceItem = function (item) {
//    var offloadItemMatch = lodash.findWhere($scope.offloadMenuItems, {
//      itemMasterId: item.itemMasterId
//    });
//    if (offloadItemMatch) {
//      var mergedItem = lodash.extend(angular.copy(item), angular.copy(offloadItemMatch));
//      mergedItem.isInOffload = false;
//      $scope.menuItems.push(mergedItem);
//      $this.calculatePickedQtyFromTotal(mergedItem);
//      lodash.remove($scope.offloadMenuItems, offloadItemMatch);
//    } else {
//      $scope.menuItems.push(item);
//    }
//  };
//
//  this.mergePrevInstanceItem = function (item) {
//    var offloadItemMatch = lodash.findWhere($scope.offloadMenuItems, {
//      itemMasterId: item.itemMasterId
//    });
//    if (offloadItemMatch) {
//      lodash.extend(offloadItemMatch, item);
//    } else {
//      item.isInOffload = true;
//      $scope.offloadMenuItems.push(item);
//    }
//  };
//
//  this.mergeMenuItemsForRedispatch = function (menuItemsFromAPI) {
//    angular.forEach(menuItemsFromAPI, function (item) {
//      var itemMatch = lodash.findWhere($scope.menuItems, {
//        itemMasterId: item.itemMasterId
//      });
//      if (itemMatch) {
//        $this.mergeIfItemHasPickListMatch(item, itemMatch);
//      } else {
//        var storeInstanceItemType = (item.storeInstanceId === parseInt($routeParams.storeId)) ? 'NewInstance' :
//          'PrevInstance';
//        var mergeFunctionName = 'merge' + storeInstanceItemType + 'Item';
//        $this[mergeFunctionName](item);
//      }
//    });
//    hideLoadingModal();
//  };
//
//  this.mergeMenuItems = function (menuItemsFromAPI) {
//    angular.forEach(menuItemsFromAPI, function (item) {
//      var itemMatch = lodash.findWhere($scope.menuItems, {
//        itemMasterId: item.itemMasterId
//      });
//      if (itemMatch) {
//        lodash.extend(itemMatch, item);
//      } else {
//        $scope.menuItems.push(item);
//      }
//    });
//    hideLoadingModal();
//  };
//
//  $this.getItemType = function (item, storeInstanceId) {
//    var inboundCountTypeId = $this.getIdByNameFromArray('Offload', $scope.countTypes);
//    var inboundClosedCountTypeId = $this.getIdByNameFromArray('Warehouse Close', $scope.countTypes);
//    var ullageCountTypeId = $this.getIdByNameFromArray('Ullage', $scope.countTypes);
//
//    var isFromNewInstance = storeInstanceId === parseInt($routeParams.storeId);
//    var isUllageQuantity = angular.isDefined(item.quantity) && angular.isDefined(item.countTypeId) && item.countTypeId === ullageCountTypeId;
//    var isInboundQuantity = angular.isDefined(item.quantity) && angular.isDefined(item.countTypeId) && (item.countTypeId === inboundCountTypeId || item.countTypeId === inboundClosedCountTypeId);
//
//    if (angular.isDefined(item.menuQuantity)) {
//      return 'Template';
//    } else if (isUllageQuantity) {
//      return 'Ullage';
//    } else if (isInboundQuantity) {
//      return 'Inbound';
//    } else if(isFromNewInstance) {
//      return 'Packed';
//    }
//    return 'ignore';
//  };
//
//  $this.formatTemplateItem = function (item) {
//    delete item.id;
//  };
//
//  $this.formatPackedItem = function (item) {
//    if ($routeParams.action === 'redispatch') {
//      item.totalQuantity = item.quantity;
//      $this.calculatePickedQtyFromTotal(item);
//    }
//    item.quantity = item.quantity.toString();
//  };
//
//  $this.formatInboundItem = function (item) {
//    item.inboundQuantity = angular.copy(item.quantity.toString());
//    item.inboundQuantityId = angular.copy(item.id);
//    delete item.quantity;
//    delete item.id;
//  };
//
//  $this.formatUllageItem = function (item) {
//    item.ullageQuantity = angular.copy(item.quantity.toString());
//    item.ullageId = angular.copy(item.id);
//    var itemUllageReasonObject = lodash.findWhere($scope.ullageReasonCodes, {
//      id: item.ullageReasonCode
//    });
//    item.ullageReason = itemUllageReasonObject || null;
//    delete item.quantity;
//    delete item.id;
//  };
//
//  function getItemsSuccessHandler(dataFromAPI) {
//    if (!dataFromAPI.response) {
//      hideLoadingModal();
//      return;
//    }
//    var menuItems = angular.copy(dataFromAPI.response);
//    angular.forEach(menuItems, function (item) {
//      var itemType = $this.getItemType(item, item.storeInstanceId);
//      var formatItemFunctionName = 'format' + itemType + 'Item';
//      if($this[formatItemFunctionName]) {
//        $this[formatItemFunctionName](item);
//      }
//      item.itemDescription = item.itemCode + ' - ' + item.itemName;
//      if ($routeParams.action === 'redispatch' && item.storeInstanceId === $scope.storeDetails.prevStoreInstanceId) {
//        item.isFromPrevInstance = true;
//      }
//    });
//
//    if ($routeParams.action === 'redispatch') {
//      $this.mergeMenuItemsForRedispatch(menuItems);
//    } else {
//      $this.mergeMenuItems(menuItems);
//    }
//  }
//
//  this.getIdByNameFromArray = function (name, array) {
//    var matchedObject = lodash.findWhere(array, {
//      name: name
//    });
//    if (matchedObject) {
//      return matchedObject.id;
//    }
//    return '';
//  };
//
//  this.getStoreInstanceItems = function (storeInstanceId) {
//    storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then(getItemsSuccessHandler, showErrors);
//  };
//
//  this.getRegularItemTypeIdSuccess = function (dataFromAPI) {
//    $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', dataFromAPI);
//  };
//
//  this.getRegularItemTypeId = function () {
//    return storeInstanceFactory.getItemTypes().then($this.getRegularItemTypeIdSuccess);
//  };
//
//  this.getUpliftableCharacteristicIdSuccess = function (dataFromAPI, characteristicName) {
//    $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, dataFromAPI);
//  };
//
//  this.getCharacteristicIdForName = function (characteristicName) {
//    return storeInstanceFactory.getCharacteristics().then(function (dataFromAPI) {
//      $this.getUpliftableCharacteristicIdSuccess(dataFromAPI, characteristicName);
//    });
//  };
//
//  this.getUpliftableCharacteristicIdSuccess = function (dataFromAPI, characteristicName) {
//    $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, dataFromAPI);
//  };
//
//  this.getCharacteristicIdForName = function (characteristicName) {
//    return storeInstanceFactory.getCharacteristics().then(function (dataFromAPI) {
//      $this.getUpliftableCharacteristicIdSuccess(dataFromAPI, characteristicName);
//    });
//  };
//
//  this.getUllageReasonCodesSuccess = function (dataFromAPI) {
//    $scope.ullageReasonCodes = lodash.filter(angular.copy(dataFromAPI.companyReasonCodes), function (reason) {
//      return reason.description === 'Ullage';
//    });
//  };
//
//  this.getUllageReasonCodes = function () {
//    storeInstanceFactory.getReasonCodeList().then($this.getUllageReasonCodesSuccess, showErrors);
//  };
//
//  this.getCountTypesSuccess = function (dataFromAPI) {
//    $scope.countTypes = angular.copy(dataFromAPI);
//  };
//
//  this.getCountTypes = function () {
//    storeInstanceFactory.getCountTypes().then($this.getCountTypesSuccess, showErrors);
//  };
//
//  this.getVarianceForDispatchFeature = function (featuresList) {
//    // TODO: change undispatch to dispatch once data has been created on BE
//    var dispatchFeature = lodash.findWhere(featuresList, {name: 'Dispatch'});
//    if (!dispatchFeature) {
//      $scope.variance = 9999999;   // show no variance warning if no variance for dispatch is set
//      return;
//    }
//    storeInstanceFactory.getThresholdList(dispatchFeature.id).then(function (dataFromAPI) {
//      if (dataFromAPI.response) {
//        $scope.variance = angular.copy(dataFromAPI.response[0].percentage);
//      } else {
//        $scope.variance = 99999999;
//      }
//    }, showErrors);
//  };
//
//  this.getThresholdVariance = function () {
//    storeInstanceFactory.getFeaturesList().then($this.getVarianceForDispatchFeature, showErrors);
//  };
//
//  this.getStoreInstanceMenuItems = function (storeInstanceId) {
//    var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
//    var payload = {
//      itemTypeId: $scope.regularItemTypeId,
//      date: payloadDate
//    };
//
//    if ($scope.characteristicFilterId) {
//      payload.characteristicId = $scope.characteristicFilterId;
//    }
//    storeInstanceFactory.getStoreInstanceMenuItems(storeInstanceId, payload).then(getItemsSuccessHandler,
//      showErrors);
//  };
//
//  $scope.$watchGroup(['masterItemsList', 'menuItems'], function () {
//      $scope.filteredMasterItemList = lodash.filter($scope.masterItemsList, function (item) {
//        return !(lodash.findWhere($scope.menuItems, {
//          itemMasterId: item.id
//        }));
//      });
//  });
//
//  $scope.$watchGroup(['masterItemsList', 'offloadMenuItems'], function () {
//    $scope.filteredOffloadMasterItemList = lodash.filter($scope.masterItemsList, function (item) {
//      return !(lodash.findWhere($scope.offloadMenuItems, {
//        itemMasterId: item.id
//      }));
//    });
//  });
//
//  this.getMasterItemsListSuccess = function (itemsListJSON) {
//    $scope.masterItemsList = angular.copy(itemsListJSON.masterItems);
//  };
//
//  this.getMasterItemsList = function () {
//    var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
//    var filterPayload = {
//      itemTypeId: $scope.regularItemTypeId,
//      startDate: payloadDate,
//      endDate: payloadDate
//    };
//    if ($scope.characteristicFilterId) {
//      filterPayload.characteristicId = $scope.characteristicFilterId;
//    }
//    storeInstanceFactory.getItemsMasterList(filterPayload).then($this.getMasterItemsListSuccess, showErrors);
//  };
//
//  this.updateInstanceToByStepName = function (stepObject) {
//    if (!stepObject) {
//      $location.url('/store-instance-dashboard');
//      return;
//    }
//
//    showLoadingModal('Updating Status...');
//    var statusUpdatePromiseArray = [];
//    statusUpdatePromiseArray.push(storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, stepObject.stepName));
//    if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
//      statusUpdatePromiseArray.push(storeInstanceFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId, stepObject.storeOne.stepName));
//    }
//
//    $q.all(statusUpdatePromiseArray).then(function () {
//      hideLoadingModal();
//      $location.url(stepObject.uri);
//    }, showErrors);
//
//  };
//
//  this.getStoreDetailsSuccess = function (dataFromAPI) {
//    $scope.storeDetails = angular.copy(dataFromAPI);
//  };
//
//  this.getStoreDetails = function () {
//    return storeInstanceFactory.getStoreDetails($routeParams.storeId).then(this.getStoreDetailsSuccess,
//      errorHandler);
//  };
//
//  function savePackingDataSuccessHandler(dataFromAPI) {
//    $scope.emptyMenuItems = [];
//    angular.forEach(dataFromAPI.response, function (item) {
//      var masterItem = lodash.findWhere($scope.masterItemsList, {
//        id: item.itemMasterId
//      });
//      item.itemCode = angular.isDefined(masterItem) ? masterItem.itemCode : '';
//      item.itemName = angular.isDefined(masterItem) ? masterItem.itemName : '';
//    });
//    getItemsSuccessHandler(dataFromAPI);
//  }
//
//  this.checkForDuplicate = function (item) {
//    var menuToCheck = angular.copy($scope.emptyMenuItems);
//    if($routeParams.action === 'redispatch') {
//      menuToCheck = menuToCheck.concat(angular.copy($scope.emptyOffloadMenuItems));
//    }
//
//    var duplicates = lodash.filter(menuToCheck, function (filteredItem) {
//      return (item.masterItem && filteredItem.masterItem && filteredItem.masterItem.id === item.masterItem.id);
//    });
//    return duplicates.length > 1;
//  };
//
//  $scope.warnForDuplicateSelection = function (selectedItem) {
//    var duplicatesExist = $this.checkForDuplicate(selectedItem);
//    if (duplicatesExist) {
//      showToast('warning', 'Add Item', 'The item ' + selectedItem.masterItem.itemName + ' has already been added');
//    }
//  };
//
//  this.checkForDuplicatesInPayload = function () {
//    var duplicatesExist = false;
//    var mergedEmptyItems = angular.copy($scope.emptyMenuItems);
//    if($routeParams.action === 'redispatch') {
//      mergedEmptyItems = mergedEmptyItems.concat(angular.copy($scope.emptyOffloadMenuItems));
//    }
//
//    angular.forEach(mergedEmptyItems, function (item) {
//      duplicatesExist = duplicatesExist || $this.checkForDuplicate(item, false);
//    });
//    return duplicatesExist;
//  };
//
//  this.checkForEmptyItemsInPayload = function () {
//    var emptyItemsExist = false;
//    var mergedMenuItems = (angular.copy($scope.emptyMenuItems));
//    if ($routeParams.action === 'redispatch') {
//      mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.emptyOffloadMenuItems));
//    }
//    angular.forEach(mergedMenuItems, function (item) {
//      emptyItemsExist = emptyItemsExist || (!item.itemMasterId && !item.masterItem);
//    });
//    return emptyItemsExist;
//  };
//
//  this.checkForIncompleteUllagePayload = function () {
//    if ($routeParams.action !== 'end-instance' && $routeParams.action !== 'redispatch') {
//      return false;
//    }
//    var mergedMenuItems = angular.copy($scope.menuItems).concat(angular.copy($scope.emptyMenuItems));
//    if ($routeParams.action === 'redispatch') {
//      mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.offloadMenuItems));
//      mergedMenuItems = mergedMenuItems.concat(angular.copy($scope.emptyOffloadMenuItems));
//    }
//
//    var ullageDataIncomplete = false;
//    angular.forEach(mergedMenuItems, function (item) {
//      ullageDataIncomplete = ullageDataIncomplete || (item.ullageQuantity > 0 && !item.ullageReason);
//    });
//    return ullageDataIncomplete;
//  };
//
//  $scope.calculateTotalDispatchedQty = function (item) {
//    var total = parseInt(item.quantity) || 0;
//    total += parseInt(item.inboundQuantity) || 0;
//    total -= parseInt(item.ullageQuantity) || 0;
//    return total;
//  };
//
//  this.dispatchAndReplenishCreatePayload = function (item, workingPayload) {
//    var itemPayload = {
//      itemMasterId: item.itemMasterId || item.masterItem.id,
//      quantity: parseInt(item.quantity) || 0
//    };
//    if (item.id) {
//      itemPayload.id = item.id;
//    }
//    workingPayload.push(itemPayload);
//  };
//
//  this.createUllagePayload = function (item) {
//    var ullageCountTypeId = $this.getIdByNameFromArray('Ullage', $scope.countTypes);
//
//    var ullagePayload = {
//      itemMasterId: item.itemMasterId || item.masterItem.id,
//      quantity: parseInt(item.ullageQuantity) || 0,
//      countTypeId: ullageCountTypeId
//    };
//
//    if (item.ullageQuantity > 0) {
//      ullagePayload.ullageReasonCode = item.ullageReason.id;
//    }
//    if (item.ullageId) {
//      ullagePayload.id = item.ullageId;
//    }
//    return ullagePayload;
//  };
//
//  this.createInboundPayload = function (item) {
//    var inboundCountTypeId = $this.getIdByNameFromArray('Offload', $scope.countTypes);
//    var inboundClosedCountTypeId = $this.getIdByNameFromArray('Warehouse Close', $scope.countTypes);
//    var shouldUseInboundClosedCountType = !angular.isDefined(item.isInOffload) && !item.isInOffload && $routeParams.action === 'redispatch';
//    var countTypeIdToUse = shouldUseInboundClosedCountType ? inboundClosedCountTypeId : inboundCountTypeId;
//
//
//    var inboundPayload = {
//      itemMasterId: item.itemMasterId || item.masterItem.id,
//      quantity: parseInt(item.inboundQuantity),
//      countTypeId: countTypeIdToUse
//    };
//    if (item.inboundQuantityId) {
//      inboundPayload.id = item.inboundQuantityId;
//    }
//    return inboundPayload;
//  };
//
//  this.createDispatchedPayload = function (item) {
//    var dispatchedCountTypeId = $this.getIdByNameFromArray('Warehouse Open', $scope.countTypes);
//    var dispatchedPayload = {
//      itemMasterId: item.itemMasterId || item.masterItem.id,
//      quantity: $scope.calculateTotalDispatchedQty(item),
//      countTypeId: dispatchedCountTypeId
//    };
//    if (item.id) {
//      dispatchedPayload.id = item.id;
//    }
//    return dispatchedPayload;
//  };
//
//  this.endInstanceCreatePayload = function (item, workingPayload) {
//    var ullagePayload = $this.createUllagePayload(item);
//    var inboundPayload = $this.createInboundPayload(item);
//    workingPayload.push(ullagePayload);
//    workingPayload.push(inboundPayload);
//  };
//
//  this.redispatchCreatePayload = function (item, workingPayload) {
//    if (item.ullageQuantity) {
//      var ullagePayload = $this.createUllagePayload(item);
//      workingPayload.prevStoreInstancePayload.push(ullagePayload);
//    }
//    if (item.inboundQuantity) {
//      var inboundPayload = $this.createInboundPayload(item);
//      workingPayload.prevStoreInstancePayload.push(inboundPayload);
//    }
//    if (!item.isInOffload) {
//      var dispatchedPayload = $this.createDispatchedPayload(item);
//      workingPayload.currentStoreInstancePayload.push(dispatchedPayload);
//    }
//  };
//
//  this.createPayload = function () {
//    var newPayload = {
//      response: []
//    };
//    var mergedItems = $scope.menuItems.concat($scope.emptyMenuItems);
//    angular.forEach(mergedItems, function (item) {
//      if ($routeParams.action === 'end-instance') {
//        $this.endInstanceCreatePayload(item, newPayload.response);
//      } else {
//        $this.dispatchAndReplenishCreatePayload(item, newPayload.response);
//      }
//    });
//    return newPayload;
//  };
//
//  $this.createPayloadForRedispatch = function () {
//    var combinedPayload = {
//      currentStoreInstancePayload: [],
//      prevStoreInstancePayload: []
//    };
//    var mergedItems = $scope.menuItems.concat($scope.emptyMenuItems);
//    mergedItems = mergedItems.concat($scope.offloadMenuItems);
//    mergedItems = mergedItems.concat($scope.emptyOffloadMenuItems);
//
//    angular.forEach(mergedItems, function (item) {
//      $this.redispatchCreatePayload(item, combinedPayload);
//    });
//    return combinedPayload;
//  };
//
//  this.createPayloadAndSave = function (shouldUpdateStatus) {
//    var payload = $this.createPayload();
//    showLoadingModal('Saving...');
//    storeInstanceFactory.updateStoreInstanceItemsBulk($routeParams.storeId, payload).then(function (responseData) {
//      savePackingDataSuccessHandler(responseData);
//      if (shouldUpdateStatus) {
//        $this.updateInstanceToByStepName($this.nextStep);
//      } else {
//        showToast('success', 'Save Packing Data', 'Data successfully updated!');
//        $location.path(dashboardURL);
//      }
//      hideLoadingModal();
//    });
//  };
//
//  this.createPayloadAndSaveForRedispatch = function (shouldUpdateStatus) {
//    showLoadingModal('Saving...');
//    var combinedPayload = $this.createPayloadForRedispatch();
//    var currentStorePayload = {
//      response: combinedPayload.currentStoreInstancePayload
//    };
//    var prevStorePayload = {
//      response: combinedPayload.prevStoreInstancePayload
//    };
//    var promises = [
//      storeInstanceFactory.updateStoreInstanceItemsBulk($routeParams.storeId, currentStorePayload)
//    ];
//    if (prevStorePayload.response.length > 0) {
//      promises.push(storeInstanceFactory.updateStoreInstanceItemsBulk($scope.storeDetails.prevStoreInstanceId,
//        prevStorePayload));
//    }
//    $q.all(promises).then(function () {
//      hideLoadingModal();
//      if (shouldUpdateStatus) {
//        $this.updateInstanceToByStepName($this.nextStep);
//      } else {
//        showToast('success', 'Save Packing Data', 'Data successfully updated!');
//        $location.path(dashboardURL);
//      }
//    });
//  };
//
//  this.checkFormValidity = function () {
//    if ($scope.storeInstancePackingForm.$invalid) {
//      showToast('danger', 'Save Items', 'All quantities must be a number');
//      return false;
//    }
//    var duplicatesExist = $this.checkForDuplicatesInPayload();
//    if (duplicatesExist) {
//      showToast('danger', 'Save Items', 'Duplicate Entries Exist!');
//      return false;
//    }
//    var emptyItemsExist = $this.checkForEmptyItemsInPayload();
//    if (emptyItemsExist) {
//      showToast('danger', 'Save Items', 'An item must be selected for all rows');
//      return false;
//    }
//    var ullagePayloadIncomplete = $this.checkForIncompleteUllagePayload();
//    if (ullagePayloadIncomplete) {
//      showToast('danger', 'Save Items', 'All items with an ullage quantity require an ullage reason');
//      return false;
//    }
//
//    return true;
//  };
//
//
//  this.isStatusCorrectForSetAction = function (statusName) {
//    if ($routeParams.action === 'end-instance' && statusName === '7') {
//      return true;
//    } else if ($routeParams.action !== 'end-instance' && statusName === '1') {
//      return true;
//    }
//    return false;
//  };
//
//  this.isInstanceReadOnly = function () {
//    if ($this.isStatusCorrectForSetAction($scope.storeDetails.currentStatus.name)) {
//      $scope.readOnly = false;
//      $scope.saveButtonName = 'Save & Exit';
//    } else {
//      showToast('warning', 'Store Instance Status', 'This store instance is not ready for packing');
//    }
//  };
//
//  this.completeInitializeAfterDependencies = function () {
//    $this.isInstanceReadOnly();
//    $this.getMasterItemsList();
//    $this.getStoreInstanceItems($routeParams.storeId);
//    var storeInstanceForMenuItems = ($routeParams.action === 'replenish') ? $scope.storeDetails.replenishStoreInstanceId :
//      $routeParams.storeId;
//    $this.getStoreInstanceMenuItems(storeInstanceForMenuItems);
//
//    if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
//      $this.getStoreInstanceItems($scope.storeDetails.prevStoreInstanceId);
//    }
//  };
//
//  this.makeInitializePromises = function () {
//    var promises = [
//      this.getStoreDetails(),
//      this.getRegularItemTypeId(),
//      this.getThresholdVariance()
//    ];
//
//    if ($routeParams.action === 'end-instance' || $routeParams.action === 'redispatch') {
//      promises.push($this.getCountTypes());
//      promises.push($this.getUllageReasonCodes());
//    }
//
//    var characteristicForAction = {
//      'replenish': 'Upliftable',
//      'dispatch': 'Inventory',
//      'end-instance': 'Inventory',
//      'redispatch': 'Inventory'
//    };
//    if (characteristicForAction[$routeParams.action]) {
//      promises.push(this.getCharacteristicIdForName(characteristicForAction[$routeParams.action]));
//    }
//
//    return promises;
//  };
//
//  this.redispatchInit = function () {
//    $scope.offloadMenuItems = [];
//    $scope.emptyOffloadMenuItems = [];
//    $scope.addOffloadItemsQty = 1;
//  };
//
//  this.initialize = function () {
//    showLoadingModal('Loading Store Detail for Packing...');
//    $this.itemsToDeleteArray = [];
//    $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
//    var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
//      controllerName: 'Packing'
//    });
//    $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
//    $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);
//
//    $scope.menuItems = [];
//    $scope.emptyMenuItems = [];
//    if ($routeParams.action === 'redispatch') {
//      $this.redispatchInit();
//    }
//    var promises = $this.makeInitializePromises();
//    $q.all(promises).then($this.completeInitializeAfterDependencies);
//  };
//
//  this.initialize();
//
//  function removeNewItem(itemToDelete) {
//    var workingArray = (itemToDelete.isInOffload) ? $scope.emptyOffloadMenuItems : $scope.emptyMenuItems;
//    var index = workingArray.indexOf(itemToDelete);
//    workingArray.splice(index, 1);
//  }
//
//  function removeItemFromArray(itemArray, itemToDelete){
//    var itemMatch = lodash.findWhere(itemArray, {itemMasterId: itemToDelete.itemMasterId});
//    if (itemMatch) {
//      lodash.remove(itemArray, itemMatch);
//      return true;
//    }
//    return false;
//  }
//
//  function removeExistingItemFromList(itemToDelete) {
//    var storeInstance = (itemToDelete.isInOffload && $scope.storeDetails.prevStoreInstanceId) ? $scope.storeDetails.prevStoreInstanceId : $routeParams.storeId;
//
//    var item = {
//      storeInstance: storeInstance,
//      itemToDelete: angular.copy(itemToDelete)
//    };
//
//    removeItemFromArray($scope.menuItems, itemToDelete);
//    if (removeItemFromArray($scope.offloadMenuItems, itemToDelete)) {
//      item.storeInstance = $scope.storeDetails.prevStoreInstanceId;
//    }
//
//    return item;
//  }
//
//  $scope.removeRecord = function (itemToDelete) {
//    if (itemToDelete.isNewItem) {
//      removeNewItem(itemToDelete);
//    } else {
//      var item = removeExistingItemFromList(itemToDelete);
//      $this.itemsToDeleteArray.push(item);
//    }
//  };
//
//  $scope.showDeleteWarning = function (item) {
//    if (item.quantity > 0) {
//      $scope.deleteRecordDialog(item, ['itemDescription']);
//    } else {
//      $scope.removeRecord(item);
//    }
//  };
//
//  function createPromiseToDeleteItems() {
//    var deleteItemsPromiseArray = [];
//    angular.forEach($this.itemsToDeleteArray, function (item) {
//      var storeInstance = item.storeInstance;
//      var itemToDelete = item.itemToDelete;
//      deleteItemsPromiseArray.push(storeInstanceFactory.deleteStoreInstanceItem(storeInstance, itemToDelete.id));
//    });
//    return deleteItemsPromiseArray;
//  }
//
//  function saveData(shouldUpdateStatus) {
//    if ($routeParams.action === 'redispatch') {
//      $this.createPayloadAndSaveForRedispatch(shouldUpdateStatus);
//      return;
//    }
//    $this.createPayloadAndSave(shouldUpdateStatus);
//  }
//
//  this.getRequiredQuantityForVarianceCalculation = function (item) {
//    var requiredQuantity = angular.copy(item.menuQuantity) || 1;
//    requiredQuantity = (angular.isNumber(requiredQuantity)) ? requiredQuantity : parseInt(requiredQuantity);
//    return requiredQuantity;
//  };
//
//  this.getDispatchedQuantityForVarianceCalculation = function (item) {
//    var dispatchedQuantity;
//    if($routeParams.action === 'redispatch') {
//      dispatchedQuantity = $scope.calculateTotalDispatchedQty(angular.copy(item)) || 0;
//    } else {
//      dispatchedQuantity = angular.copy(item.quantity) || 0;
//    }
//    dispatchedQuantity = (angular.isNumber(dispatchedQuantity)) ? dispatchedQuantity : parseInt(dispatchedQuantity);
//    return dispatchedQuantity;
//  };
//
//  this.calculateVariance = function (item) {
//    // don't check variance on manually added items
//    if(!item.menuQuantity) {
//      item.exceedsVariance = false;
//      return false;
//    }
//    var requiredQuantity = $this.getRequiredQuantityForVarianceCalculation(item) || 1;
//    var dispatchedQuantity = $this.getDispatchedQuantityForVarianceCalculation(item) || 0;
//
//    var threshold;
//    threshold = ((dispatchedQuantity / requiredQuantity) - 1) * 100;
//    item.exceedsVariance = (threshold > $scope.variance);
//  };
//
//  this.checkForExceededVariance = function () {
//    if($routeParams.action === 'end-instance' || $routeParams.action === 'replenish') {
//      return false;
//    }
//    var highVarianceExists = false;
//    angular.forEach($scope.menuItems, function (item) {
//      $this.calculateVariance(item);
//      highVarianceExists = highVarianceExists || item.exceedsVariance;
//    });
//    angular.forEach($scope.emptyMenuItems, function (item) {
//      $this.calculateVariance(item);
//      highVarianceExists = highVarianceExists || item.exceedsVariance;
//    });
//    return highVarianceExists;
//  };
//
//  $scope.savePackingDataAndUpdateStatus = function (shouldUpdateStatus) {
//    if ($scope.readOnly) {
//      $location.path(dashboardURL);
//      return;
//    }
//
//    if ($this.checkFormValidity()) {
//      var deleteItemsPromiseArray = createPromiseToDeleteItems();
//      $q.all(deleteItemsPromiseArray).then(function () {
//        saveData(shouldUpdateStatus);
//      });
//    }
//  };
//
//  $scope.checkAndShowVarianceWarning = function () {
//    if($this.checkForExceededVariance()) {
//      angular.element('#varianceWarningModal').modal('show');
//    } else {
//      $scope.savePackingDataAndUpdateStatus($scope.shouldUpdateStatusOnSave);
//    }
//  };
//
//  $scope.saveAndExit = function () {
//    $scope.shouldUpdateStatusOnSave = false;
//    if ($scope.readOnly) {
//      $location.path(dashboardURL);
//    } else {
//      $scope.checkAndShowVarianceWarning();
//    }
//  };
//
//  $scope.goToPreviousStep = function () {
//    showLoadingModal('Updating Status...');
//    var prevStep = $scope.wizardSteps[$scope.wizardStepToIndex] || $this.prevStep;
//    $this.updateInstanceToByStepName(prevStep);
//  };
//
//  $scope.goToNextStep = function () {
//    $scope.shouldUpdateStatusOnSave = true;
//    $scope.checkAndShowVarianceWarning();
//  };
//
//  $scope.canProceed = function () {
//    return ($scope.menuItems.length > 0 || $scope.emptyMenuItems.length > 0);
//  };
//
//  $scope.isActionState = function (actionState) {
//    return $routeParams.action === actionState;
//  };
//
//  $scope.shouldDisplayQuantityField = function (fieldName) {
//    var actionToFieldMap = {
//      'dispatch': ['template', 'packed'],
//      'replenish': ['packed'],
//      'end-instance': ['ullage', 'inbound'],
//      'redispatch': ['inbound', 'ullage', 'template', 'packed', 'dispatch']
//    };
//    return (actionToFieldMap[$routeParams.action].indexOf(fieldName) >= 0);
//  };
//
//  $scope.showInboundBasedOnAction = function (action, item) {
//    if (action === 'end-instance') {
//      return true;
//    }
//    if (action === 'redispatch') {
//      return (angular.isDefined(item.ullageQuantity)) || item.isFromPrevInstance;
//    }
//    return false;
//  };
//
//  $scope.shouldDisplayInboundFields = function (item) {
//    return ($scope.showInboundBasedOnAction($routeParams.action, item));
//  };
//
//  $scope.showVarianceWarningClass = function (item) {
//    if(angular.isDefined(item.exceedsVariance) && item.exceedsVariance) {
//      return 'warning-row';
//    } else {
//      return '';
//    }
//  };
//
//  $scope.shouldShowDeleteButton = function (item) {
//    return (!angular.isDefined(item.menuQuantity) || item.menuQuantity === null);
//  };
//
//});
