'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeCtrl
 * @description
 * # StockTakeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockTakeCtrl', function($scope, $routeParams, $location, $q, $filter, stockTakeFactory, dateUtility,
    messageService, lodash) {

    $scope.viewName = 'Stock Take';
    $scope.itemQuantities = [];
    $scope.cateringStationItems = [];
    $scope.newMasterItems = [];
    $scope.numberOfItems = 1;
    $scope.stockTake = {
      catererStationId: null
    };

    // private vars
    var _initPromises = [];
    var _cateringStationItems = [];
    var _prevViewName = null;
    var _payload = null;
    var _formSaveSuccessText = '';
    var _path = '/stock-take/';
    var stateActions = {};

    function showMessage(message, messageType) {
      messageService.display(messageType, '<strong>Stock Take</strong>: ' + message);
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response) {
      $scope.errorResponse = angular.copy(response);
      $scope.displayError = true;
      hideLoadingModal();
    }

    // constructor
    function init() {
      // scope vars
      $scope.state = $routeParams.state;
      $scope.prevState = null;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      _cateringStationItems = [];
      _prevViewName = null;
      _payload = null;
      _formSaveSuccessText = '';

      var initStateAction = $routeParams.state + 'Init';
      if (stateActions[initStateAction]) {
        stateActions[initStateAction]();
      } else {
        $location.path('/');
      }
    }

    function setCatererStationListFromResponse(response) {
      $scope.catererStationList = response.response;
    }

    function getCatererStationList() {
      return stockTakeFactory.getCatererStationList().then(setCatererStationListFromResponse);
    }

    function setCateringStationItems(items) {
      if (angular.isUndefined(_cateringStationItems[$scope.stockTake.catererStationId])) {
        _cateringStationItems[$scope.stockTake.catererStationId] = items;
      }

      if (!items) {
        $scope.cateringStationItems = [];
        if (angular.isUndefined($scope.disabledCatererStationIds)) {
          $scope.disabledCatererStationIds = [];
        }

        $scope.disabledCatererStationIds[$scope.stockTake.catererStationId] = true;
        $scope.stockTake.catererStationId = null;
        showMessage('No items exist for that LMP Station, please try another.', 'info');
        return;
      }

      $scope.cateringStationItems = items;
      hideLoadingModal();
    }

    function diffItems(itemList) {
      var items = [];
      var existingItems = [];
      angular.forEach(itemList, function(item) {
        items.push(item.id);
      });

      angular.forEach($scope.cateringStationItems, function(item) {
        existingItems.push(item.masterItemId);
      });

      return lodash.difference(items, existingItems);
    }

    function filterAvailableItems(response) {
      $scope.filteredItems = [];
      var itemList = angular.copy(response.masterItems);
      var filteredItemId = diffItems(itemList);
      angular.forEach(itemList, function(item) {
        var match = filteredItemId.filter(function(id) {
          return id === item.id;
        });

        if (match[0]) {
          $scope.filteredItems.push(item);
        }
      });

      $scope.uiSelectReady = true;
    }

    function addSelectedItemToMasterList(item, responseFromAPI) {
      var masterItem = angular.copy(responseFromAPI);

      var newItem = {
        id: item.id,
        masterItemId: item.masterItemId,
        quantity: item.quantity,
        stockTakeId: item.stockTakeId,
        itemName: masterItem.itemName,
        itemCode: masterItem.itemCode
      };

      $scope.cateringStationItems.push(newItem);
      $scope.cateringStationItems = $filter('unique')($scope.cateringStationItems, 'masterItemId');
      $scope.cateringStationItems = $filter('orderBy')($scope.cateringStationItems, 'itemName');
    }

    function addSelectedItemsToMasterList() {
      angular.forEach($scope.stockTake.items, function(item) {
        stockTakeFactory.getMasterItem(item.masterItemId).then(function(responseFromAPI) {
          addSelectedItemToMasterList(item, responseFromAPI);
        });
      });
    }

    function setMasterItemsList(response) {
      $scope.masterItemsList = angular.copy(response.masterItems);
      if ($scope.stockTake.items && $scope.stockTake.items.length) {
        addSelectedItemsToMasterList();
      }
    }

    function setItemTypes(dataFromAPI) {
      $scope.itemTypes = dataFromAPI;
    }

    function getItemTypes() {
      if (!$scope.itemTypes) {
        displayLoadingModal();
        stockTakeFactory.getItemTypes().then(setItemTypes);
      }

      return false;
    }

    function regularItemType() {
      getItemTypes();
      if (angular.isDefined($scope.itemTypes)) {
        return lodash.findWhere($scope.itemTypes, {
          name: 'Regular'
        });
      }
    }

    function setCharacteristics(dataFromAPI) {
      $scope.characteristics = dataFromAPI;
    }

    function getCharacteristics() {
      if (!$scope.characteristics) {
        displayLoadingModal();
        stockTakeFactory.getCharacteristics().then(setCharacteristics);
      }

      return false;
    }

    function findInventoryInCharacteristics() {
      getCharacteristics();
      if (angular.isDefined($scope.characteristics)) {
        return lodash.findWhere($scope.characteristics, {
          name: 'Inventory'
        });
      }
    }

    function getItemsListByCompanyId() {
      var companyId = stockTakeFactory.getCompanyId();
      var regularItemTypeObj = regularItemType();
      var inventoryCharacteristicObj = findInventoryInCharacteristics();
      if (angular.isNumber(companyId) && angular.isDefined(regularItemTypeObj)) {
        var payload = {
          companyId: companyId,
          itemTypeId: regularItemTypeObj.id,
          characteristicId: inventoryCharacteristicObj.id
        };
        stockTakeFactory.getItemsMasterList(payload).then(function(response) {
          if (angular.isObject(response)) {
            filterAvailableItems(response);
            if (response.masterItems) {
              setMasterItemsList(response);
            }

            hideLoadingModal();
          }
        });
      }
    }

    function setCateringStationItemsFromResponse(response) {
      var items = $filter('unique')(response.response, 'masterItemId');
      items = $filter('orderBy')(items, 'itemName');
      setCateringStationItems(items);
    }

    function getItemsByCatererStationId(catererStationId) {
      if (!catererStationId) {
        return;
      }

      displayLoadingModal();

      $scope.stockTake.catererStationId = catererStationId;

      if (angular.isDefined($scope.addedItems) && $scope.addedItems.length) {
        $scope.addedItems = [];
      }

      getItemsListByCompanyId();

      // used cached results instead of hitting API again
      if (angular.isDefined(_cateringStationItems[catererStationId])) {
        var response = _cateringStationItems[catererStationId];
        setCateringStationItems(response);
        return;
      }

      stockTakeFactory.getItemsByCateringStationId(catererStationId).then(
        setCateringStationItemsFromResponse, showResponseErrors);
    }

    function catererStationIdWatcher(newValue) {
      if (!newValue) {
        return newValue;
      }

      getItemsByCatererStationId(newValue);
      return newValue;
    }

    function setStationIdOnCreate() {
      if ($routeParams.state !== 'create') {
        return;
      }

      if ($routeParams.id) {
        $scope.stockTake.catererStationId = $routeParams.id;
      } else if ($scope.catererStationList.length === 1) {
        $scope.stockTake.catererStationId = $scope.catererStationList[0].id;
      }
    }

    function watchForAddItems() {
      var items = [];
      angular.forEach($scope.addedItems, function(item) {
        if (item.itemQuantity && item.itemObject) {
          items.push(item);
          item.itemCode = item.itemObject.itemCode;
          item.itemName = item.itemObject.itemName;
        }
      });

      if (items.length) {
        return true;
      }

      return false;
    }

    function checkItemQuantities() {
      var items = [];
      angular.forEach($scope.itemQuantities, function(item) {
        if (item) {
          items.push(item);
        }
      });

      if (items.length) {
        return true;
      }

      return false;
    }

    function canReview() {
      if (!checkItemQuantities() && !watchForAddItems()) {
        return false;
      }

      if (!$scope.displayError && $scope.stockTake.isSubmitted) {
        return false;
      }

      return true;
    }

    function itemQuantitiesWatcher(newValue) {
      $scope.canReview = canReview();
      return newValue;
    }

    function initPromisesResolved() {
      hideLoadingModal();
      var initPromisesResolvedStateAction = $routeParams.state + 'InitPromisesResolved';
      if (stateActions[initPromisesResolvedStateAction]) {
        stateActions[initPromisesResolvedStateAction]();
      }
    }

    function resolveInitPromises() {
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function generateAddedPayloadItems() {
      var items = [];
      angular.forEach($scope.addedItems, function(item) {
        if (angular.isDefined(item.itemObject && item.itemQuantity)) {
          items.push({
            masterItemId: parseInt(item.itemObject.id),
            quantity: parseInt(item.itemQuantity)
          });
        }
      });

      return items;
    }

    function generatePayloadItems() {
      var items = [];
      if (angular.isDefined($scope.addedItems)) {
        items = generateAddedPayloadItems();
      }

      for (var masterItemId in $scope.itemQuantities) {
        if ($scope.itemQuantities[masterItemId]) {
          items.push({
            masterItemId: parseInt(masterItemId),
            quantity: parseInt($scope.itemQuantities[masterItemId])
          });
        }
      }

      return items;
    }

    function generateSavePayload() {
      _payload = $scope.stockTake;
      _payload.items = generatePayloadItems();
    }

    function saveStockTakeFailed(response) {
      $scope.displayError = true;
      $scope.toggleReview();
      showResponseErrors(response);
    }

    function saveStockTakeResolution(response) {
      showMessage(_formSaveSuccessText, 'success');
      hideLoadingModal();
      if (angular.isDefined(response.id)) {
        $location.path('/stock-take-report');
        return;
      }

      init();
    }

    function saveStockTake() {
      var loadingModalText = 'Saving';
      if (_payload.isSubmitted) {
        loadingModalText = 'Submitting';
      }

      displayLoadingModal(loadingModalText);
      if ($routeParams.state === 'create') {
        _formSaveSuccessText = 'Created';
        stockTakeFactory.createStockTake(_payload).then(
          saveStockTakeResolution, saveStockTakeFailed);
        return;
      }

      if ($routeParams.state !== 'edit') {
        return;
      }

      _formSaveSuccessText = 'Saved';
      if (_payload.isSubmitted) {
        _formSaveSuccessText = 'Submitted';
      }

      stockTakeFactory.updateStockTake($scope.stockTake.id, _payload).then(
        saveStockTakeResolution, saveStockTakeFailed);
    }

    function setStockTakeFromResponse(response) {
      $scope.stockTake = response;
      if ($scope.stockTake.createdOn) {
        $scope.stockTake.createdOn = dateUtility.removeMilliseconds($scope.stockTake.createdOn);
      }

      if ($scope.stockTake.updatedOn) {
        $scope.stockTake.updatedOn = dateUtility.removeMilliseconds($scope.stockTake.updatedOn);
      }
    }

    function getStockTake() {
      return stockTakeFactory.getStockTake($routeParams.id).then(setStockTakeFromResponse);
    }

    function setItemQuantitiesFromStockTake() {
      $scope.itemQuantities = [];
      lodash.forIn($scope.stockTake.items, function(item) {
        $scope.itemQuantities[item.masterItemId] = item.quantity;
      });
    }

    // Scope functions
    $scope.quantityDisabled = function() {
      if ($scope.state !== 'create' && $scope.state !== 'edit') {
        return true;
      }

      if ($scope.stockTake.isSubmitted) {
        return true;
      }

      return false;
    };

    $scope.clearFilter = function() {
      if (angular.isUndefined($scope.filterInput)) {
        return;
      }

      if (angular.isDefined($scope.filterInput.itemCode)) {
        delete $scope.filterInput.itemCode;
      }

      if (angular.isDefined($scope.filterInput.itemName)) {
        delete $scope.filterInput.itemName;
      }
    };

    $scope.cancel = function() {
      if ($scope.prevState) {
        $scope.toggleReview();
        return;
      }

      $location.path('/stock-take-report');
    };

    $scope.toggleReview = function() {
      if (!$scope.prevState) {
        $scope.clearFilter();
        $scope.prevState = $scope.state;
        $scope.state = 'review';
        $scope.canReview = false;
        $scope.readOnly = true;
        _prevViewName = $scope.viewName;
        $scope.viewName = 'Review Stock Take';
      } else {
        $scope.state = $scope.prevState;
        $scope.prevState = null;
        $scope.canReview = canReview();
        $scope.readOnly = false;
        $scope.viewName = _prevViewName;
        _prevViewName = null;
      }
    };

    $scope.save = function(_submit) {
      if ($scope.stockTake.isSubmitted) {
        return;
      }

      $scope.displayError = false;
      $scope.stockTake.isSubmitted = _submit;
      generateSavePayload();
      saveStockTake();
    };

    $scope.addItems = function() {
      if (!$scope.addedItems) {
        $scope.newItemId = 0;
        $scope.addedItems = [];
      }

      for (var i = 0; i < $scope.numberOfItems; i++) {
        $scope.newItemId++;
        var item = {
          id: $scope.newItemId
        };
        $scope.addedItems.push(item);
      }
    };

    $scope.removeAddedItem = function(key) {
      $scope.addedItems.splice(key, 1);
    };

    $scope.showAddedItem = function(item, state) {
      if (state !== 'review' && $scope.addedItems) {
        return true;
      }

      if (state === 'review' && (item.itemQuantity > 0) && item.itemObject.itemName) {
        return true;
      }

      return false;
    };

    $scope.omitSelectedItems = function(item) {
      var selectedItem = $scope.addedItems.filter(function(addedItem) {
        if (addedItem.itemObject) {
          return (addedItem.itemObject.id === item.id);
        }
      });

      return (selectedItem.length === 0);
    };

    // create state actions
    stateActions.createInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Create Stock Take';
      displayLoadingModal();
      _initPromises.push(
        getItemsListByCompanyId(),
        getCatererStationList()

      );
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      $scope.$watch('itemQuantities', itemQuantitiesWatcher, true);
      $scope.$watch('addedItems', itemQuantitiesWatcher, true);
      resolveInitPromises();
    };

    stateActions.createInitPromisesResolved = function() {
      setStationIdOnCreate();
    };

    // edit state actions
    stateActions.editInit = function() {
      $scope.viewName = 'Edit Stock Take';
      displayLoadingModal();
      _initPromises.push(
        getItemsListByCompanyId(),
        getCatererStationList(),
        getStockTake()
      );
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      $scope.$watch('itemQuantities', itemQuantitiesWatcher, true);
      $scope.$watch('addedItems', itemQuantitiesWatcher, true);
      resolveInitPromises();
    };

    stateActions.editInitPromisesResolved = function() {
      if ($scope.stockTake.isSubmitted) {
        $location.path(_path + 'view/' + $scope.stockTake.id);
        return;
      }

      setItemQuantitiesFromStockTake();
    };

    // view state actions
    stateActions.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Stock Take';
      displayLoadingModal();
      _initPromises.push(
        getItemsListByCompanyId(),
        getCatererStationList(),
        getStockTake()

      );
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };

    stateActions.viewInitPromisesResolved = function() {
      setItemQuantitiesFromStockTake();
      $scope.readOnly = true;
    };

    init();

  });
