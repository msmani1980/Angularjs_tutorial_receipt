'use strict';
/*jshint maxcomplexity:9 */
/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl',
  function($scope, storeInstancePackingFactory, stockManagementStationItemsService, $routeParams, lodash, storeInstanceWizardConfig,
           $location, $q, dateUtility, socketIO, $filter, $localStorage) {

    var $this = this;

    $scope.undispatch = false;
    $scope.areWizardStepsInitialized = false;
    $scope.pickListOrder = [];
    $scope.stockItemLmpCurrentQuantityDictionary = {};
    $scope.areThereSockItemQuantityErrors = false;
    $scope.errorCustom = [];

    // jshint ignore: start
    // jscs:disable

    $scope.packingListSortOrderTypes = {
      sales_category: ['salesCategoryName', 'itemName'],
      item_name: ['itemName'],
      menu_items: ['menuVersionId', 'sortOrder']
    };

    // jshint ignore: end
    // jscs:enable

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    function handleResponseError(responseFromAPI) {
      $this.hideLoadingModal();
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
      $this.isSaveInProgress = false;
    }

    this.getIdByNameFromArray = function(name, array) {
      var matchedObject = lodash.findWhere(array, {
        name: name
      });
      return (matchedObject) ? matchedObject.id : '';
    };

    this.getNameByIdFromArray = function(id, array) {
      var matchedObject = lodash.findWhere(array, {
        id: id
      });
      return (matchedObject) ? matchedObject.name : '';
    };

    $scope.filterPackingList = function () {
      $scope.filterItemDetails = angular.copy($scope.itemFilterText);
    };

    $scope.clearFilteredPackingList = function () {
      $scope.filterItemDetails = '';
      $scope.itemFilterText = '';
    };

    this.updateInstanceStatusAndRedirect = function(stepObject) {
      if (!stepObject) {
        $location.url('/store-instance-dashboard');
        return;
      }

      $this.showLoadingModal('Updating Status...');
      var statusUpdatePromiseArray = [];
      statusUpdatePromiseArray.push(storeInstancePackingFactory.updateStoreInstanceStatus($routeParams.storeId, stepObject.stepName, $scope.itemSortOrder));
      if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
        statusUpdatePromiseArray.push(
          storeInstancePackingFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId, stepObject.storeOne.stepName)
        );
      }

      $q.all(statusUpdatePromiseArray).then(function() {
        $this.hideLoadingModal();
        if ($scope.undispatch) {
          $location.url(stepObject.uri).search({ undispatch: 'true' });
        } else {
          $location.url(stepObject.uri);
        }
      }, handleResponseError);
    };

    this.saveStoreInstanceItem = function(storeInstanceId, item) {
      if (item.id) {
        return storeInstancePackingFactory.updateStoreInstanceItem(storeInstanceId, item.id, item);
      } else {
        return storeInstancePackingFactory.createStoreInstanceItem(storeInstanceId, item);
      }
    };

    this.deleteStoreInstanceItem = function(storeInstanceId, itemId) {
      return storeInstancePackingFactory.deleteStoreInstanceItem(storeInstanceId, itemId);
    };

    // get active variance closest today
    this.setVarianceFromAPI = function(dataFromAPI) {
      var varianceList = angular.copy(dataFromAPI.response);
      var defaultVariance = 99999999;
      $scope.variance = defaultVariance;
      $scope.canProceedWithExceededVariance = true;
      if (!varianceList) {
        return;
      }

      var sortedVarianceList = lodash.sortByOrder(varianceList, ['startDate', 'id'], ['desc', 'asc']);
      var allowedVarianceList = lodash.filter(sortedVarianceList, function(variance) {
        return dateUtility.isTodayOrEarlierDatePicker(dateUtility.formatDateForApp(variance.startDate));
      });

      if (allowedVarianceList.length && allowedVarianceList[0].percentage !== null) {
        $scope.variance = allowedVarianceList[0].percentage;
        $scope.canProceedWithExceededVariance = $scope.variance > 0;
      }
    };

    this.getThresholdVariance = function() {
      storeInstancePackingFactory.getThresholdList('STOREDISPATCH').then($this.setVarianceFromAPI,
        handleResponseError);
    };

    this.setCompanyPreferenceForInboundQuantity = function (dataFromAPI) {
      var preferencesArray = angular.copy(dataFromAPI.preferences);

      var defaultInboundToEposPreference = null;
      $scope.defaultUllageCountsToIboundCountsForWastage = false;
      angular.forEach(preferencesArray, function (preference) {
        if (defaultInboundToEposPreference === null && preference.featureName === 'Inbound' && preference.optionName === 'Default LMP Inbound counts to ePOS') {
          defaultInboundToEposPreference = preference.isSelected;
        } else if (preference.featureName === 'Dispatch' && preference.choiceCode === 'SLSCTGY' && preference.isSelected) {
          $scope.offLoadItemsSortOrder = '[salesCategoryName,itemName]';

          if (!$scope.storeDetails || !$scope.storeDetails.packingListSortOrderType) {
            $scope.itemSortOrder = 'sales_category';
          }
        } else if (preference.featureName === 'Dispatch' && preference.choiceCode === 'ITEMNME' && preference.isSelected) {
          $scope.offLoadItemsSortOrder = 'itemName';

          if (!$scope.storeDetails || !$scope.storeDetails.packingListSortOrderType) {
            $scope.itemSortOrder = 'item_name';
          }
        } else if (preference.featureName === 'Inbound' && preference.optionCode === 'IWST' && preference.choiceCode === 'ACT' && preference.isSelected) {
          $scope.defaultUllageCountsToIboundCountsForWastage = true;
        }
      });

      $scope.shouldDefaultInboundToEpos = (defaultInboundToEposPreference !== null) ? defaultInboundToEposPreference : true;
    };

    this.getActiveCompanyPreferences = function () {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };
      storeInstancePackingFactory.getCompanyPreferences(payload).then($this.setCompanyPreferenceForInboundQuantity, handleResponseError);
    };

    this.getEposInboundQuantities = function (storeInstanceId) {
      return storeInstancePackingFactory.getCalculatedInboundQuantities(storeInstanceId, {});
    };

    this.getStoreInstanceMenuItems = function(storeInstanceId) {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var payload = {
        itemTypeId: $scope.regularItemTypeId,
        characteristicId: $scope.characteristicFilterId,
        date: payloadDate
      };
      return storeInstancePackingFactory.getStoreInstanceMenuItems(storeInstanceId, payload);
    };

    this.getStoreInstanceItems = function(storeInstanceId) {
      return storeInstancePackingFactory.getStoreInstanceItemList(storeInstanceId, {
        showEpos: true
      });
    };

    this.getMasterItemsList = function() {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var filterPayload = {
        itemTypeId: $scope.regularItemTypeId,
        startDate: payloadDate,
        endDate: payloadDate,
        characteristicId: $scope.characteristicFilterId
      };
      return storeInstancePackingFactory.getItemsMasterList(filterPayload);
    };

    this.getUllageReasonCodes = function() {
      storeInstancePackingFactory.getReasonCodeList().then(function(response) {
        $scope.ullageReasonCodes = lodash.filter(angular.copy(response.companyReasonCodes), {
          description: 'Ullage'
        });

        $scope.defaultUllageReasonCodes = lodash.filter(angular.copy($scope.ullageReasonCodes), {
          isDefault: 1
        });
      }, this.errorHandler);
    };

    this.getCharacteristicIdForName = function(characteristicName) {
      return storeInstancePackingFactory.getCharacteristics().then(function(response) {
        $scope.characteristicFilterId = $this.getIdByNameFromArray(characteristicName, response);
      }, this.errorHandler);
    };

    this.getRegularItemTypeId = function() {
      return storeInstancePackingFactory.getItemTypes().then(function(response) {
        $scope.regularItemTypeId = $this.getIdByNameFromArray('Regular', response);
      }, this.errorHandler);
    };

    this.getCountTypes = function() {
      storeInstancePackingFactory.getCountTypes().then(function(response) {
        $scope.countTypes = angular.copy(response);
      }, this.errorHandler);
    };

    this.getStoreDetails = function() {
      return storeInstancePackingFactory.getStoreDetails($routeParams.storeId).then(function(response) {
        $scope.storeDetails = angular.copy(response);

        // Load sort order used during previous packing step

        if ($scope.storeDetails.packingListSortOrderType) {
          $scope.itemSortOrder = $scope.storeDetails.packingListSortOrderType;
        }

        // Load catering station stock items
        stockManagementStationItemsService.getStockManagementStationItems($scope.storeDetails.cateringStationId).then(function(dataFromAPI) {
          const stockDashboardItemsList = angular.copy(dataFromAPI.response);
          stockDashboardItemsList.forEach(function (stockItem) {
            $scope.stockItemLmpCurrentQuantityDictionary[stockItem.itemMasterId + ''] = stockItem;
          });
        });

        $this.initWizardSteps($scope.storeDetails.replenishStoreInstanceId);
      }, this.errorHandler);
    };

    $scope.showVarianceWarningClass = function(item) {
      return (item.exceedsVariance) ? 'danger' : '';
    };

    this.calculateVariance = function(item) {
      if (!item.isMenuItem) {
        item.exceedsVariance = false;
        return false;
      }

      var requiredQuantity = parseInt(angular.copy(item.menuQuantity)) || 1;
      var dispatchedQuantity = parseInt(angular.copy(item.pickedQuantity)) || 0;

      var threshold;
      threshold = ((dispatchedQuantity / requiredQuantity) - 1) * 100;
      item.exceedsVariance = (threshold > $scope.variance);
    };

    this.checkVarianceOnAllItems = function() {
      if ($routeParams.action === 'end-instance' || $routeParams.action === 'replenish') {
        return true;
      }

      var highVarianceExists = false;
      var allPickListItems = $scope.pickListItems.concat($scope.newPickListItems);
      angular.forEach(allPickListItems, function(item) {
        $this.calculateVariance(item);
        highVarianceExists = highVarianceExists || item.exceedsVariance;
      });

      if (highVarianceExists) {
        angular.element('#varianceWarningModal').modal('show');
        return false;
      }

      return true;
    };

    this.validatePickedItemQuantities = function(nextStep) {
      if (nextStep) { // check stock only if proceeding to next step, ignore if saving
        const allPickListItems = $scope.pickListItems.concat($scope.newPickListItems);

        angular.forEach(allPickListItems, function(item) {
          const itemMasterIdAsString = $this.extractItemMasterIdAsString(item);
          if (itemMasterIdAsString in $scope.stockItemLmpCurrentQuantityDictionary) {
            const cateringStationItem = $scope.stockItemLmpCurrentQuantityDictionary[itemMasterIdAsString];

            const pickedQuantity = ($scope.shouldDisplayQuantityField('picked') || $scope.shouldDisplayQuantityField('dispatch')) ?
              item.pickedQuantity : $scope.calculatePickedQtyFromTotal(item);

            const inboundQuantity = parseInt(item.inboundQuantity) || 0;
            if (pickedQuantity > 0 && pickedQuantity > cateringStationItem.currentQuantity + inboundQuantity) {
              item.exceedsVariance = true;
              const pickQuantity = inboundQuantity > 0 ? $scope.calculatePickedQtyFromTotal(item) : pickedQuantity;
              $scope.errorCustom.push({
                field: 'Item with code ' + cateringStationItem.itemCode,
                value: ' Picked quantity of ' + pickQuantity + ' is more than warehouse current count of ' + cateringStationItem.currentQuantity
              });
            } else {
              item.exceedsVariance = false;
            }
          } else {
            if (item.itemName !== undefined) { // ignore if new record added but item not picked from list box
              item.exceedsVariance = true;
              $scope.errorCustom.push({
                field: 'Item ' + item.itemName,
                value: ' Not found in ' + $scope.storeDetails.displayLMPStation + ' warehouse.'
              });
            }
          }
        });

        if ($scope.errorCustom.length > 0) {
          $this.showWarningModal();
        }
      }

      $scope.areThereSockItemQuantityErrors = $scope.errorCustom.length > 0;
    };

    this.extractItemMasterIdAsString = function(item) {
      if (item.itemMasterId) {
        return item.itemMasterId + '';
      } else if (item.masterItem) {
        return item.masterItem.id + '';
      }

      return null;
    };

    $scope.canProceed = function() {
      if ($routeParams.action === 'end-instance') {
        return ($scope.offloadListItems.length > 0 || $scope.newOffloadListItems.length > 0);
      }

      return ($scope.pickListItems.length > 0 || $scope.newPickListItems.length > 0);
    };

    $scope.filterPickListItems = function() {
      $scope.filteredItemsList = lodash.filter($scope.masterItemsList, function(item) {
        var pickListMatch = (lodash.findWhere($scope.pickListItems, {
          itemMasterId: item.id,
          itemDescription: item.itemCode + ' - ' + item.itemName
        }));
        var newPickListMatch = (lodash.findWhere($scope.newPickListItems, {
          masterItem: item,
          itemDescription: item.itemCode + ' - ' + item.itemName
        }));
        return !pickListMatch && !newPickListMatch;
      });
    };

    $scope.filterOffloadListItems = function() {
      $scope.filteredOffloadItemsList = lodash.filter($scope.masterItemsList, function(item) {
        var offloadMatch = (lodash.findWhere($scope.offloadListItems, {
          itemMasterId: item.id
        }));
        var newOffloadMatch = (lodash.findWhere($scope.newOffloadListItems, {
          masterItem: item
        }));
        var redispatchMatch = ($routeParams.action === 'redispatch') ? (lodash.findWhere($scope.pickListItems, {
          itemMasterId: item.id,
          isInOffload: false,
          shouldDisplayOffloadData: true
        })) : false;
        return !offloadMatch && !newOffloadMatch && !redispatchMatch;
      });
    };

    this.removeNewItem = function(itemToDelete) {
      var workingArray = (itemToDelete.isInOffload) ? $scope.newOffloadListItems : $scope.newPickListItems;
      var index = workingArray.indexOf(itemToDelete);
      workingArray.splice(index, 1);
    };

    this.removeExistingItemFromArray = function(itemToDelete) {
      var storeInstance = (itemToDelete.isInOffload && $routeParams.action === 'redispatch') ? $scope.storeDetails.prevStoreInstanceId :
        $routeParams.storeId;
      var itemArray = (itemToDelete.isInOffload) ? $scope.offloadListItems : $scope.pickListItems;

      angular.forEach(['picked', 'inbound', 'ullage'], function(quantity) {
        if (itemToDelete[quantity + 'Quantity'] && itemToDelete[quantity + 'Id']) {
          var deleteData = {
            id: itemToDelete[quantity + 'Id'],
            storeInstanceId: storeInstance
          };
          $this.itemsToDeleteArray.push(deleteData);
        }
      });

      var itemMatch = lodash.findWhere(itemArray, {
        itemMasterId: itemToDelete.itemMasterId
      });
      if (itemMatch) {
        lodash.remove(itemArray, itemMatch);
      }
    };

    $scope.removeRecord = function(itemToDelete) {
      if (!itemToDelete.isNewItem) {
        $this.removeExistingItemFromArray(itemToDelete);
      } else {
        $this.removeNewItem(itemToDelete);
      }

      $scope.filterPickListItems();
      $scope.filterOffloadListItems();
    };

    this.doChangesExistInItem = function(item) {
      return (item.pickedQuantity || item.ullageQuantity || item.ullageReason || item.inboundQuantity || item.masterItem);
    };

    $scope.showDeleteWarning = function(item) {
      var changesExist = $this.doChangesExistInItem(item);
      if (changesExist) {
        $scope.deleteRecordDialog(item, ['itemDescription']);
      } else {
        $scope.removeRecord(item);
      }
    };

    $scope.setItemDescription = function(item) {
      item.itemDescription = item.masterItem.itemCode + ' - ' + item.masterItem.itemName;
      item.itemName = item.masterItem.itemName;
      item.salesCategoryName = $this.findSalesCategoryName(item.masterItem.versions);
    };

    this.addItemsToArray = function(array, itemNumber, isInOffload) {
      for (var i = 0; i < itemNumber; i++) {
        var newItem = {
          menuQuantity: 0,
          pickedQuantity: '0',
          oldPickedQuantity: -1,
          ullageQuantity: '0',
          oldUllageQuantity: -1,
          inboundQuantity: '0',
          oldInboundQuantity: -1,
          isMenuItem: false,
          isNewItem: true,
          isInOffload: isInOffload,
          itemDescription:''
        };
        array.push(newItem);
      }
    };

    $scope.addOffloadItems = function() {
      $this.addItemsToArray($scope.newOffloadListItems, $scope.addOffloadNum, true);
    };

    $scope.addItems = function() {
      $this.addItemsToArray($scope.newPickListItems, $scope.addPickListNum, false);
    };

    socketIO.on('retailItem', function(dataFromSocket) {
      var rowSelector = sprintf('.item-%s', dataFromSocket.message);
      var inputElementSelector = sprintf('.item-%s .pick-list-picked', dataFromSocket.message);
      if (angular.element(rowSelector).length) {
        angular.element(rowSelector).addClass('alert-info');
        angular.element(inputElementSelector).focus();
      } else {
        $scope.addItems();
        angular.element('.pick-list-picked:last-child').focus();
      }
    });

    $scope.canDeleteItem = function(item) {
      return item.isNewItem || (!item.isMenuItem);
    };

    $scope.shouldDisableUllage = function(item) {
      if (!item.ullageQuantity || parseInt(item.ullageQuantity) <= 0 || !item.inboundQuantity || parseInt(item.inboundQuantity) <= 0) {
        item.ullageReason = null;
        item.ullageQuantity = 0;

        return true;
      }

      return false;
    };

    this.addItemsToDeleteToPayload = function(promiseArray) {
      angular.forEach($this.itemsToDeleteArray, function(item) {
        promiseArray.push($this.deleteStoreInstanceItem(item.storeInstanceId, item.id));
      });
    };

    this.constructPayloadItem = function(item, quantity, countTypeName) {
      var countTypeId = $this.getIdByNameFromArray(countTypeName, $scope.countTypes);
      var payloadItem = {
        countTypeId: countTypeId,
        quantity: parseInt(angular.copy(quantity)),
        sortOrder: parseInt(item.sortOrder)
      };
      payloadItem.itemMasterId = (!item.isNewItem) ? item.itemMasterId : item.masterItem.id;

      if (countTypeName === 'Ullage' && item.ullageReason && parseInt(item.ullageQuantity) > 0) {
        payloadItem.ullageReasonCode = item.ullageReason.id;
      } else if (countTypeName === 'Ullage' && (!item.ullageReason || parseInt(item.ullageQuantity) <= 0)) {
        payloadItem.ullageReasonCode = null;
      }

      return payloadItem;
    };

    function saveStoreInstanceItems(promiseArray, storeId, items) {
      var createPayload = [];
      var updatePayload = [];

      angular.forEach(items, function(item) {
        if (item.id) {
          updatePayload.push(item);
        } else {
          createPayload.push(item);
        }
      });

      promiseArray.push(storeInstancePackingFactory.createStoreInstanceItems(storeId, createPayload));
      promiseArray.push(storeInstancePackingFactory.updateStoreInstanceItems(storeId, updatePayload));
    }

    $scope.getPicklistOrder = function () {
      return ($scope.itemSortOrder) ? $scope.packingListSortOrderTypes[$scope.itemSortOrder] : $scope.packingListSortOrderTypes.itemName;
    };

    this.assignSortOrderForMenuItemsOrder = function () {
      var nextSort = 0;

      var pickListItems = $filter('orderBy')(angular.copy($scope.pickListItems), $scope.getPicklistOrder()).map(function (item) {
        item.sortOrder = nextSort;
        nextSort = nextSort + 1;
        return item;
      });

      var newPickListItems = angular.copy($scope.newPickListItems).map(function (item) {
        item.sortOrder = nextSort;
        nextSort = nextSort + 1;
        return item;
      });

      return pickListItems.concat(newPickListItems);
    };

    this.assignSortOrderForOtherOrders = function () {
      var nextSort = 0;

      var pickListItems = angular.copy($scope.pickListItems);
      var newPickListItems = angular.copy($scope.newPickListItems);

      var mergedItems = pickListItems.concat(newPickListItems);

      return $filter('orderBy')(mergedItems, $scope.getPicklistOrder()).map(function (item) {
        item.sortOrder = nextSort;
        nextSort = nextSort + 1;
        return item;
      });
    };

    this.addPickListItemsToPayload = function(promiseArray) {
      var sortedItems = [];

      if ($scope.itemSortOrder === 'menu_items') {
        sortedItems = $this.assignSortOrderForMenuItemsOrder();
      } else {
        sortedItems = $this.assignSortOrderForOtherOrders();
      }

      var items = [];

      angular.forEach(sortedItems, function(item) {
        var payloadItem = $this.constructPayloadItem(item, item.pickedQuantity, 'Warehouse Open');

        if (item.pickedId) {
          payloadItem.id = item.pickedId;
        }

        items.push(payloadItem);
      });

      saveStoreInstanceItems(promiseArray, $routeParams.storeId, items);
    };

    this.addUllageQuantityToPayload = function(item) {
      var didUllageQuantityChange = (angular.isDefined(item.oldUllageQuantity)) ? parseInt(item.ullageQuantity) !==
      item.oldUllageQuantity : true;
      if (didUllageQuantityChange) {
        var ullagePayloadItem = $this.constructPayloadItem(item, item.ullageQuantity, 'Ullage');
        if (item.ullageId) {
          ullagePayloadItem.id = item.ullageId;
        }

        return ullagePayloadItem;
      }

      return false;
    };

    this.addInboundQuantityToPayload = function(item, isRedispatch) {
      var didInboundQuantityChange = (angular.isDefined(item.inboundQuantity)) ? parseInt(item.inboundQuantity) !==
      item.oldInboundQuantity : true;
      if (didInboundQuantityChange) {
        var countTypeName = (isRedispatch) ? 'Warehouse Close' : 'Offload';
        var offloadPayloadItem = $this.constructPayloadItem(item, item.inboundQuantity, countTypeName);
        if (item.inboundId) {
          offloadPayloadItem.id = item.inboundId;
        }

        return offloadPayloadItem;
      }

      return false;
    };

    this.addOffloadItemsToPayload = function(promiseArray, isRedispatch) {
      var items = [];
      var storeInstanceToUse = ($routeParams.action === 'end-instance') ? $routeParams.storeId : $scope.storeDetails.prevStoreInstanceId;
      var itemsArray = (isRedispatch) ? $scope.pickListItems : ($scope.offloadListItems.concat($scope.newOffloadListItems));
      angular.forEach(itemsArray, function(item) {
        var shouldAddItem = !isRedispatch || (angular.isDefined(item.shouldDisplayOffloadData) && item.shouldDisplayOffloadData);
        if (shouldAddItem) {
          var ullagePayloadItem = $this.addUllageQuantityToPayload(item);
          if (ullagePayloadItem) {
            items.push(ullagePayloadItem);
          }

          var offloadPayloadItem = $this.addInboundQuantityToPayload(item, isRedispatch);
          if (offloadPayloadItem) {
            items.push(offloadPayloadItem);
          }
        }
      });

      saveStoreInstanceItems(promiseArray, storeInstanceToUse, items);
    };

    $scope.calculatePickedQtyFromTotal = function(item) {
      var calculatedQuantity = angular.copy(parseInt(item.pickedQuantity)) || 0;
      calculatedQuantity += parseInt(item.ullageQuantity) || 0;
      calculatedQuantity -= parseInt(item.inboundQuantity) || 0;
      return calculatedQuantity;
    };

    $scope.goToPreviousStep = function() {
      $this.showLoadingModal('Updating Status...');
      var prevStep = $scope.wizardSteps[$scope.wizardStepToIndex] || $this.prevStep;
      $this.updateInstanceStatusAndRedirect(prevStep);
    };

    this.checkUllageReasonValidityInList = function(itemList, fieldName) {
      var isPickList = (itemList === $scope.pickListItems);
      var listToCheck = lodash.sortBy(angular.copy(itemList), 'itemName');
      angular.forEach(listToCheck, function(item, index) {
        var formField = $scope.storeInstancePackingForm[fieldName + index];
        if (angular.isDefined(formField) && (item.shouldDisplayOffloadData || !isPickList)) {
          var isValid = (parseInt(item.ullageQuantity) > 0) ? (!!item.ullageReason) : true;
          formField.$setValidity('required', isValid);
        }
      });
    };

    this.validateUllageReasonFields = function() {
      if ($routeParams.action === 'redispatch') {
        $this.checkUllageReasonValidityInList($scope.pickListItems, 'pickUllageReason');
      }

      if ($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') {
        $this.checkUllageReasonValidityInList($scope.offloadListItems, 'offloadUllageReason');
        $this.checkUllageReasonValidityInList($scope.newOffloadListItems, 'newOffloadUllageReason');
      }
    };

    $scope.submit = function(shouldUpdateStatus) {
      $this.clearErrors();

      $scope.shouldUpdateStatus = shouldUpdateStatus;
      $this.validateUllageReasonFields();
      $this.validatePickedItemQuantities(shouldUpdateStatus);
      const isFormInvalid = $scope.storeInstancePackingForm.$invalid || $scope.areThereSockItemQuantityErrors;
      $scope.displayError = isFormInvalid;

      var isVarianceOk = false;
      if (!isFormInvalid) {
        isVarianceOk = $this.checkVarianceOnAllItems();
      }

      if (isVarianceOk) {
        $scope.save();
      }
    };

    this.clearCustomErrors = function () {
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.clearErrors = function () {
      $this.clearCustomErrors();
      $scope.displayError = false;
      $scope.errorResponse = [];
      $scope.errorCustom = [];
    };

    function handleItemResponseErrors(errorResponseFromAPI) {
      $scope.errorCustom = [{
        field: 'Saved Items',
        value: 'One or more items were not saved correctly. Please try saving again'
      }];

      handleResponseError(errorResponseFromAPI);
    }

    function saveItemsSuccess() {
      $this.hideLoadingModal();
      if ($scope.shouldUpdateStatus) {
        $this.updateInstanceStatusAndRedirect($this.nextStep);
      } else {
        $location.url('/store-instance-dashboard');
      }
    }

    function getSavePromises() {
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

      return promiseArray;
    }

    $scope.save = function() {
      if ($this.isSaveInProgress) {
        return;
      }

      $this.isSaveInProgress = true;
      $this.showLoadingModal();
      var promiseArray = getSavePromises();

      $q.all(promiseArray).then(saveItemsSuccess, handleItemResponseErrors);
    };

    $scope.shouldDisplayQuantityField = function(fieldName) {
      var actionToFieldMap = {
        dispatch: ['template', 'picked'],
        replenish: ['picked'],
        'end-instance': ['ullage', 'inbound'],
        redispatch: ['inbound', 'ullage', 'template', 'dispatch', 'calcPicked']
      };
      return (actionToFieldMap[$routeParams.action].indexOf(fieldName) >= 0);
    };

    $scope.isActionState = function(actionState) {
      return $routeParams.action === actionState;
    };

    this.setInstanceReadOnly = function() {
      var currentStatus = $scope.storeDetails.currentStatus.name;
      if ($this.currentStep.stepName === currentStatus) {
        $scope.readOnly = false;
        $scope.saveButtonName = 'Save & Exit';
      } else {
        $scope.readOnly = true;
        $scope.saveButtonName = 'Exit';
        var error = {
          data: [{
            field: 'Wrong Status',
            value: ': Packing is not allowed'
          }]
        };
        handleResponseError(error);
      }
    };

    this.createFreshItem = function(itemFromAPI, isFromMenu) {
      var shoudlCopyPickedQuantityToMenu = isFromMenu && ($routeParams.action === 'dispatch' || $routeParams.action ===
        'redispatch');
      return {
        itemDescription: itemFromAPI.itemCode + ' - ' + itemFromAPI.itemName,
        itemName: itemFromAPI.itemName,
        menuQuantity: (isFromMenu) ? itemFromAPI.menuQuantity : 0,
        pickedQuantity: (shoudlCopyPickedQuantityToMenu) ? itemFromAPI.menuQuantity : 0,
        oldPickedQuantity: -1, // so that 0 quantities will be saved
        inboundQuantity: '0',
        oldInboundQuantity: -1,
        ullageQuantity: '0',
        oldUllageQuantity: -1,
        itemMasterId: itemFromAPI.itemMasterId,
        isMenuItem: isFromMenu,
        isNewItem: false,
        isInOffload: ($routeParams.action === 'end-instance'),
        salesCategoryName: itemFromAPI.salesCategoryName,
        menuVersionId: itemFromAPI.menuVersionId,
        sortOrder: itemFromAPI.sortOrder ? parseInt(itemFromAPI.sortOrder) : 0
      };
    };

    this.getItemQuantityType = function(item) {
      var countType = $this.getNameByIdFromArray(item.countTypeId, $scope.countTypes);
      var countTypeToQuantityTypeMap = {
        'Warehouse Open': 'picked',
        Offload: 'inbound',
        'Warehouse Close': 'inbound',
        Ullage: 'ullage'
      };

      if (countTypeToQuantityTypeMap[countType]) {
        return countTypeToQuantityTypeMap[countType];
      }

      return '';
    };

    this.setQuantityByTypeConditionals = function(itemFromAPI, itemToSet, isFromRedispatchInstance) {
      var quantityType = $this.getItemQuantityType(itemFromAPI);
      if (quantityType === 'picked' && !isFromRedispatchInstance) {
        itemToSet.pickedQuantity = itemFromAPI.quantity.toString();
        itemToSet.oldPickedQuantity = itemFromAPI.quantity;
        itemToSet.pickedId = itemFromAPI.id;
      } else if (quantityType === 'inbound') {
        itemToSet.inboundQuantity = itemFromAPI.quantity.toString();
        itemToSet.oldInboundQuantity = itemFromAPI.quantity;
        itemToSet.inboundId = itemFromAPI.id;
      } else if (quantityType === 'ullage') {
        itemToSet.ullageQuantity = itemFromAPI.quantity.toString();
        itemToSet.oldUllageQuantity = itemFromAPI.quantity;
        var ullageReason = lodash.findWhere($scope.ullageReasonCodes, {
          id: itemFromAPI.ullageReasonCode
        });
        itemToSet.ullageReason = ullageReason || null;
        itemToSet.oldUllageReason = itemFromAPI.ullageReasonCode;
        itemToSet.ullageId = itemFromAPI.id;
      }
    };

    this.setQuantityByType = function(itemFromAPI, itemToSet, isFromRedispatchInstance, isInboundQuantityOverwritten) {
      if (!itemToSet) {
        return;
      }

      $this.setQuantityByTypeConditionals(itemFromAPI, itemToSet, isFromRedispatchInstance);

      itemToSet.countTypeId = itemFromAPI.countTypeId;
      itemToSet.isEposDataOverwritten = isInboundQuantityOverwritten;
    };

    this.findItemMatch = function(itemFromAPI) {
      var itemMatch;
      if ($routeParams.action === 'redispatch') {
        // offloadList match should be returned before pickList match. match in pickList and offloadList should not be merged
        itemMatch = lodash.findWhere($scope.offloadListItems, {
            itemMasterId: itemFromAPI.itemMasterId
          }) || lodash.findWhere($scope.pickListItems, {
            itemMasterId: itemFromAPI.itemMasterId
          });
      } else if ($routeParams.action === 'end-instance') {
        itemMatch = lodash.findWhere($scope.offloadListItems, {
          itemMasterId: itemFromAPI.itemMasterId
        });
      } else {
        itemMatch = lodash.findWhere($scope.pickListItems, {
          itemMasterId: itemFromAPI.itemMasterId
        });
      }

      return itemMatch;
    };

    this.mergeStoreInstanceMenuItems = function(items) {
      angular.forEach(items, function(item) {
        var itemMatch = $this.findItemMatch(item);
        if (itemMatch) {
          itemMatch.menuQuantity += item.menuQuantity;
          itemMatch.pickedQuantity += item.menuQuantity;
        } else {
          var newItem = $this.createFreshItem(item, true);
          if ($routeParams.action === 'end-instance') {
            $scope.offloadListItems.push(newItem);
          } else {
            $scope.pickListItems.push(newItem);
          }
        }
      });
    };

    function findItemOnEposList(items, item) {
      return lodash.findWhere(items, {
        itemMasterId: item.itemMasterId,
        countTypeName: 'FAClose'
      });
    }

    function setCountTypeNameAndCheckEpos(items) {
      var ignoreEposData = false;

      angular.forEach(items, function(item) {
        item.countTypeName = $this.getNameByIdFromArray(item.countTypeId, $scope.countTypes);
        ignoreEposData = ignoreEposData || item.countTypeName === 'Offload' || item.countTypeName ===
          'Warehouse Close';
      });

      return ignoreEposData;
    }

    this.handleWastageItems = function(item, newItem) {
      if (!(($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') && $scope.defaultUllageCountsToIboundCountsForWastage)) {
        return;
      }

      if (item.wastage) {
        newItem.ullageQuantity = newItem.inboundQuantity;
        if ($scope.defaultUllageReasonCodes && newItem.ullageQuantity > 0) {
          newItem.ullageReason = $scope.defaultUllageReasonCodes[0];
        }
      }
    };

    this.handleWastageItemsForEposInbounded = function(itemsOldList, itemsNewList, offLoadItem) {
      if (!(($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') && $scope.defaultUllageCountsToIboundCountsForWastage)) {
        return;
      }

      var itemMatch = lodash.findWhere(itemsOldList, { itemMasterId: offLoadItem.itemMasterId, countTypeId: 1 });
      if (itemsNewList) {
        var itemsList = angular.copy(itemsNewList.response);
        itemMatch = lodash.findWhere(itemsList, { itemMasterId: offLoadItem.itemMasterId, countTypeId: 1 });
      }

      if (itemMatch && itemMatch.wastage) {
        offLoadItem.ullageQuantity = offLoadItem.inboundQuantity;
        if ($scope.defaultUllageReasonCodes && offLoadItem.ullageQuantity > 0) {
          offLoadItem.ullageReason = $scope.defaultUllageReasonCodes[0];
        }
      }
    };

    this.mergeStoreInstanceItems = function(items) {
      var ignoreEposData = setCountTypeNameAndCheckEpos(items);
      angular.forEach(items, function(item) {
        var ePosItem = findItemOnEposList(items, item);
        var itemMatch = $this.findItemMatch(item);
        var isEposItem = item.countTypeName === 'FAClose' || item.countTypeName === 'FAOpen';
        if (!itemMatch && !isEposItem) {
          var newItem = $this.createFreshItem(item, false);
          if ($routeParams.action === 'end-instance') {
            $scope.offloadListItems.push(newItem);
          } else {
            $scope.pickListItems.push(newItem);
          }

          itemMatch = newItem;
        }

        $this.setQuantityByType(item, itemMatch, false, ignoreEposData);
        if (itemMatch && !ignoreEposData && ePosItem) {
          itemMatch.inboundQuantity = ePosItem.quantity;
        }
      });
    };

    this.getSalesCategoryName = function(itemMasterId) {
      var menuMatches = lodash.findWhere($scope.allowedMenuItemsForOffloadSection, { itemMasterId: itemMasterId });
      if (menuMatches) {
        return menuMatches.salesCategoryName;
      } else {
        var menuMatchesNew = lodash.findWhere($scope.allItemForGettingSalesCategory, { itemMasterId: itemMasterId });
        if (menuMatchesNew) {
          return menuMatchesNew.salesCategoryName;
        } else {
          return '';
        }
      }
    };

    this.mergeRedispatchItemsLoopConditional = function(item, pickListMatch, offloadListMatch) {
      var isMenuItemInOfAllowedMenuItemsForOffloadSection = $this.isMenuItemInOfAllowedMenuItemsForOffloadSection(item);
      var isItemValidForOffloadSection = (!pickListMatch && !offloadListMatch && item.countTypeName !== 'FAClose') ||
        (!offloadListMatch && item.countTypeName === 'Offload');

      return (isMenuItemInOfAllowedMenuItemsForOffloadSection && isItemValidForOffloadSection) ||
        ($routeParams.action === 'redispatch' && isItemValidForOffloadSection);
    };

    this.mergeRedispatchItemsLoop = function(items, ignoreEposData) {
      angular.forEach(items, function(item) {
        item.salesCategoryName = $this.getSalesCategoryName(item.itemMasterId);
        var pickListMatch = lodash.findWhere($scope.pickListItems, {
          itemMasterId: item.itemMasterId
        });
        var offloadListMatch = lodash.findWhere($scope.offloadListItems, {
          itemMasterId: item.itemMasterId
        });
        var ePosItem = findItemOnEposList(items, item);
        var itemMatch;

        if ($this.mergeRedispatchItemsLoopConditional(item, pickListMatch, offloadListMatch)) {
          var newItem = $this.createFreshItem(item, true);
          newItem.isInOffload = true;
          newItem.salesCategoryName = item.salesCategoryName;
          $scope.offloadListItems.push(newItem);
          itemMatch = newItem;
        } else if (offloadListMatch) {
          itemMatch = offloadListMatch;
        } else if (pickListMatch) {
          pickListMatch.shouldDisplayOffloadData = true;
          itemMatch = pickListMatch;
        }

        $this.setQuantityByType(item, itemMatch, true, ignoreEposData);
        if (itemMatch && !ignoreEposData && ePosItem) {
          itemMatch.inboundQuantity = ePosItem.quantity;
        }

        $this.handleWastageItems(item, itemMatch);
      });
    };

    this.mergeRedispatchItems = function(items) {
      var ignoreEposData = setCountTypeNameAndCheckEpos(items);
      items = lodash.sortBy(items, 'countTypeName');
      $this.mergeRedispatchItemsLoop(items, ignoreEposData);
    };

    this.mergeEposInboundQuantities = function(inboundQuantities, eposNewItems, eposOldItems) {
      angular.forEach(inboundQuantities, function (eposInboundQuantity) {
        var offloadItemMatch = lodash.findWhere($scope.offloadListItems, { itemMasterId: eposInboundQuantity.id });
        var picklistMatch = lodash.findWhere($scope.pickListItems, { itemMasterId: eposInboundQuantity.id });

        if ($routeParams.action === 'redispatch' && picklistMatch && !picklistMatch.isEposDataOverwritten) {
          picklistMatch.inboundQuantity = eposInboundQuantity.quantity;
          $this.handleWastageItemsForEposInbounded(eposNewItems, eposOldItems, picklistMatch);
        } else if (offloadItemMatch && !offloadItemMatch.isEposDataOverwritten) {
          offloadItemMatch.inboundQuantity = eposInboundQuantity.quantity;
          $this.handleWastageItemsForEposInbounded(eposNewItems, eposOldItems, offloadItemMatch);
        }
      });

    };

    this.findSalesCategoryName = function (versions) {
      var activeVersion = lodash.findLast(versions, function (version) {
        var startDate = dateUtility.formatDateForApp(version.startDate);
        var endDate = dateUtility.formatDateForApp(version.endDate);

        return dateUtility.isAfterOrEqualDatePicker(endDate, $scope.storeDetails.scheduleDate) &&
          dateUtility.isBeforeOrEqualDatePicker(startDate, $scope.storeDetails.scheduleDate);
      });

      if (activeVersion && activeVersion.category) {
        return activeVersion.category.name;
      } else {
        return null;
      }
    };

    this.mergeAllItems = function(responseCollection) {
      $scope.masterItemsList = angular.copy(responseCollection[0].masterItems).map(function (item) {
          item.salesCategoryName = $this.findSalesCategoryName(item.versions);
          return item;
        });

      $this.mergeAllowedMenuItemsForOffloadSection(responseCollection);

      $this.mergeStoreInstanceMenuItems(angular.copy(responseCollection[1].response));
      $this.mergeStoreInstanceItems(angular.copy(responseCollection[2].response));
      if (responseCollection[4]) {
        $scope.allItemForGettingSalesCategory = angular.copy(responseCollection[4].response);
        $this.mergeRedispatchItems(angular.copy(responseCollection[4].response));
      }

      if ($scope.shouldDefaultInboundToEpos && ($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance')) {
        $this.mergeEposInboundQuantities(angular.copy(responseCollection[3].response), angular.copy(responseCollection[2].response), responseCollection[4]);
      }

      $scope.filterOffloadListItems();
      $scope.filterPickListItems();
      $this.hideLoadingModal();
    };

    this.mergeAllowedMenuItemsForOffloadSection = function(responseCollection) {
      if (responseCollection[1]) {
        $this.mergeAllUniqueMenuItems(angular.copy(responseCollection[1].response));
      }

      if (responseCollection[5]) {
        $this.mergeAllUniqueMenuItems(angular.copy(responseCollection[5].response));
      }
    };

    this.mergeAllUniqueMenuItems = function(menuItemsCollections) {
      lodash.forEach(menuItemsCollections, function(menuItem) {
        if (!$this.isMenuItemInOfAllowedMenuItemsForOffloadSection(menuItem)) {
          $scope.allowedMenuItemsForOffloadSection.push(menuItem);
        }
      });
    };

    this.isMenuItemInOfAllowedMenuItemsForOffloadSection = function(menuItemToCheck) {
      var itemsGroupedById = lodash.indexBy($scope.allowedMenuItemsForOffloadSection, 'itemMasterId');

      return menuItemToCheck.itemMasterId in itemsGroupedById;
    };

    this.finalizeAllInitialization = function(responseCollection) {
      $this.setInstanceReadOnly();
      $this.mergeAllItems(responseCollection);
    };

    this.getAllItems = function() {
      var storeInstanceForMenuItems = ($routeParams.action === 'replenish') ? $scope.storeDetails.replenishStoreInstanceId :
        $routeParams.storeId;

      var storeInstanceForCalculatedInbounds = ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) ?
        $scope.storeDetails.prevStoreInstanceId : $routeParams.storeId;

      var getItemsPromises = [
        $this.getMasterItemsList(),
        $this.getStoreInstanceMenuItems(storeInstanceForMenuItems),
        $this.getStoreInstanceItems($routeParams.storeId),
        $this.getEposInboundQuantities(storeInstanceForCalculatedInbounds)
      ];

      if ($routeParams.action === 'redispatch' && $scope.storeDetails.prevStoreInstanceId) {
        getItemsPromises.push($this.getStoreInstanceItems($scope.storeDetails.prevStoreInstanceId));
        getItemsPromises.push($this.getStoreInstanceMenuItems($scope.storeDetails.prevStoreInstanceId));
      }

      $q.all(getItemsPromises).then($this.finalizeAllInitialization, handleResponseError);
    };

    this.makeInitializePromises = function() {
      var characteristicName = ($routeParams.action === 'replenish') ? 'Upliftable' : 'Inventory';
      var promises = [
        this.getStoreDetails(),
        this.getRegularItemTypeId(),
        this.getThresholdVariance(),
        this.getCountTypes(),
        this.getCharacteristicIdForName(characteristicName),
        this.getActiveCompanyPreferences()
      ];
      if ($routeParams.action === 'end-instance' || $routeParams.action === 'redispatch') {
        promises.push($this.getUllageReasonCodes());
      }

      return promises;
    };

    this.initWizardSteps = function(replenishStoreInstanceId) {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId, replenishStoreInstanceId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: 'Packing'
      });
      $this.currentStep = angular.copy($scope.wizardSteps[currentStepIndex]);
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
      $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);

      $scope.areWizardStepsInitialized = true;
    };

    this.initControllerVars = function() {
      $this.itemsToDeleteArray = [];
      $scope.pickListItems = [];
      $scope.newPickListItems = [];
      $scope.addPickListNum = 1;
      $scope.filteredItemsList = [];
      $scope.allowedMenuItemsForOffloadSection = [];
      $scope.allItemForGettingSalesCategory = [];

      if ($routeParams.action === 'redispatch' || $routeParams.action === 'end-instance') {
        $scope.offloadListItems = [];
        $scope.newOffloadListItems = [];
        $scope.addOffloadNum = 1;
        $scope.filteredOffloadItemsList = [];
      }
    };

    this.completeInitializeAfterDependencies = function() {
      $this.getAllItems();
    };

    this.showWarningModal = function () {
      angular.element('#warning').modal('show');
    };

    this.init = function() {
      $scope.readOnly = true;
      if ($routeParams.undispatch) {
        $scope.undispatch = true;
      }

      if ($routeParams.action === 'replenish') {
        $localStorage.replenishUpdateStep = {
          storeId: $routeParams.storeId ? $routeParams.storeId : $scope.storeDetails.id
        };

      }

      $this.showLoadingModal('Loading Store Detail for Packing...');
      $this.initControllerVars();
      var promises = $this.makeInitializePromises();
      $q.all(promises).then($this.completeInitializeAfterDependencies, handleResponseError);
    };

    $this.init();
  });
