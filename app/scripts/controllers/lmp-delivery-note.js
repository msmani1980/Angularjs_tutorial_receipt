 /*jshint maxcomplexity:7 */
'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function($scope, $routeParams, $location, $q, $filter, deliveryNoteFactory,
    dateUtility, messageService, lodash, categoryFactory) {

    var $this = this;

    // static scope vars
    $scope.viewName = 'Delivery note';
    $scope.addItemsNumber = 1;
    $scope.deliveryNote = {
      catererStationId: null,
      deliveryNoteNumber: null,
      items: []
    };

    // private vars
    var savedCatererStationList = [];
    var _formSaveSuccessText = null;
    var _cateringStationItems = [];
    var _reasonCodeTypeUllage = 'Ullage';
    var _payload = null;
    var _path = '/lmp-delivery-note/';
    var _prevViewName = null;
    var _firstTime = true;

    function isNumberGreaterThanOrEqualTo0(value) {
      return angular.isDefined(value) && value !== null && parseInt(value) >= 0;
    }

    $scope.isNumberGreaterThanOrEqualToZero = function(value) {
      return angular.isDefined(value) && value !== null && parseInt(value) >= 0;
    };

    $scope.isNumberGreaterThanZero = function(value) {
      return angular.isDefined(value) && value !== null && parseInt(value) > 0;
    };

    function showMessage(message, messageType) {
      messageService.display(messageType, '<strong>Delivery Note</strong>: ' + message);
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response) {
      $scope.errorResponse = response;
      $scope.displayError = true;
      hideLoadingModal();
    }

    function deliveryNoteHasItems() {
      if (angular.isUndefined($scope.deliveryNote)) {
        return false;
      }

      if (!$scope.deliveryNote.items) {
        return false;
      }

      if (!$scope.deliveryNote.items.length) {
        return false;
      }

      var itemsSet = $scope.deliveryNote.items.filter(function(item) {
        return isNumberGreaterThanOrEqualTo0(item.deliveredQuantity);
      });

      return !!(itemsSet.length);
    }

    function deliveryNoteHasAllValidItems() {
      var result = false;
      if (angular.isUndefined($scope.deliveryNote)) {
        return result;
      }

      if (!$scope.deliveryNote.items) {
        return result;
      }

      if (!$scope.deliveryNote.items.length) {
        return result;
      }

      var itemsSet = $scope.deliveryNote.items.filter(function(item) {
        return isNumberGreaterThanOrEqualTo0(item.deliveredQuantity);
      });

      result =  !!(itemsSet.length);
      if (result) {
        var ullageItemsSet = $scope.deliveryNote.items.filter(function(item) {
          return $scope.isNumberGreaterThanZero(item.ullageQuantity);
        });

        angular.forEach(ullageItemsSet, function (item) {
          if (!isFieldEmpty(item.ullageQuantity) && (angular.isUndefined(item.ullageReason) || isFieldEmpty(item.ullageReason))) {
            result = false;
            return result;
          }
        });
      }
  
      if (result) {
        var itemsExpQtySet = $scope.deliveryNote.items.filter(function(item) {
          return $scope.isNumberGreaterThanZero(item.expectedQuantity);
        });

        angular.forEach(itemsExpQtySet, function (item) {
          if (!isFieldEmpty(item.expectedQuantity) && (angular.isUndefined(item.deliveredQuantity) || isFieldEmpty(item.deliveredQuantity))) {
            result = false;
            return result;
          }
        });

      }  

      return result;
    }

    function isFieldEmpty (value) {
      return (value === undefined || value === null || value.length === 0 || value === 'Invalid date');
    }

    function canReview() {
      if ($scope.state !== 'create' && $scope.state !== 'edit') {
        return false;
      }

      if (!deliveryNoteHasItems()) {
        return false;
      }

      if (!$scope.displayError && $scope.deliveryNote.isAccepted) {
        return false;
      }

      if (!$scope.displayError && angular.isDefined($scope.form)) {
        return $scope.form.$valid;
      }

      return true;
    }

    function formErrorWatcher() {
      $scope.canReview = canReview();
    }

    $scope.shouldShowItemOnReview = function(item) {
      return ($scope.hideReview) ? isNumberGreaterThanOrEqualTo0(item.deliveredQuantity) : true;
    };

    function removeNullDeliveredItems() {
      $scope.deliveryNote.items = $scope.deliveryNote.items.filter(function(item) {
        return isNumberGreaterThanOrEqualTo0(item.deliveredQuantity);
      });
    }

    function setAllowedMasterItems() {
      var deliveryNoteItemIds = $scope.deliveryNote.items.map(function(item) {
        return item.itemMasterId;
      });

      $scope.masterItemsAllowedInSelect = $scope.masterItems.filter(function(masterItem) {
        return deliveryNoteItemIds.indexOf(masterItem.id) === -1;
      });
    }

    function setNoItemsError () {
      if ($scope.routeParamState === 'edit' && _firstTime) {
        _firstTime = false;
        return;
      }

      $scope.errorCustom = [{
        field: 'Items cannot be prepopulated',
        value: 'for this LMP Station because none exist. You must add them manually with the Add Items button below.'
      }];
      showResponseErrors();
    }

    function getItemsFromCatererStationMenus (menuCatererStationsList) {
      var menuIds = lodash.uniq(lodash.map(menuCatererStationsList, 'menuId'));

      var menuItems = [];
      angular.forEach($scope.menuList, function (menu) {
        if (menuIds.indexOf(menu.menuId) >= 0) {
          menuItems = menuItems.concat(menu.menuItems);
        }
      });

      var uniqueMenuItems = lodash.uniq(menuItems, 'itemId');
      angular.forEach(uniqueMenuItems, function (newItems) {
        newItems.itemMasterId = newItems.itemId;
        delete newItems.itemId;
      });

      return uniqueMenuItems;
    }

    function appendCategoryInformationToMasterItem(masterItem) {
      var lastCategoryId = lodash.findLast(masterItem.versions).categoryId;
      var category = $scope.categoryDictionary[lastCategoryId];

      masterItem.salesCategoryId = category.id;
      masterItem.orderBy = category.orderBy;
      masterItem.categoryName = category.name;
    }

    function formatItemForDeliveryNoteList (masterItem) {
      appendCategoryInformationToMasterItem(masterItem);

      var newItem = {
        itemName: masterItem.itemName,
        itemCode: masterItem.itemCode,
        itemMasterId: masterItem.id,
        ullageQuantity: 0,
        salesCategoryId: masterItem.salesCategoryId,
        orderBy: masterItem.orderBy,
        categoryName: masterItem.categoryName
      };

      return newItem;
    }

    function addNewDeliveryNoteItemsFromArray(newItemsArray) {
      var deliveryNoteItemIds = lodash.map($scope.deliveryNote.items, 'itemMasterId');
      deliveryNoteItemIds = deliveryNoteItemIds.concat(lodash.map($scope.deliveryNote.items, 'masterItemId'));

      var newMasterItems = [];
      angular.forEach(newItemsArray, function (item) {
        var masterItemMatch = lodash.findWhere($scope.masterItems, { id: item.itemMasterId });
        if (deliveryNoteItemIds.indexOf(item.itemMasterId) < 0 && !!masterItemMatch) {
          newMasterItems.push(formatItemForDeliveryNoteList(masterItemMatch));
        }
      });

      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems);
      setAllowedMasterItems();
    }

    function setStationItemsFromAPI (responseCollection, catererStationId) {
      var catererStationItems = !!responseCollection[1] ? responseCollection[1].response : _cateringStationItems[catererStationId].response;
      var menuItems = getItemsFromCatererStationMenus(responseCollection[0].companyMenuCatererStations);

      if ((!menuItems || !menuItems.length) && (!catererStationItems || !catererStationItems.length)) {
        setNoItemsError();
        return;
      }

      addNewDeliveryNoteItemsFromArray(catererStationItems);
      addNewDeliveryNoteItemsFromArray(menuItems);
      $scope.sortItemsByCategory();

      hideLoadingModal();
    }

    $scope.sortItemsByCategory = function() {
      // Sort by category
      var lastCategoryId = null;

      $scope.deliveryNote.items = $filter('orderBy')($scope.deliveryNote.items, ['orderBy', 'itemName']);

      var shouldShowCategoryHeader = [];
      $filter('filter')($scope.deliveryNote.items, $scope.filterInput).forEach(function (item) {
        var category = $scope.categoryDictionary[item.salesCategoryId];

        if (lastCategoryId !== category.id) {
          shouldShowCategoryHeader[item.itemMasterId] = true;
        }

        lastCategoryId = category.id;
      });

      $scope.deliveryNote.items.map(function (item) {
        if (shouldShowCategoryHeader[item.itemMasterId] === true) {
          item.showCategoryHeader = true;
        } else {
          item.showCategoryHeader = false;
        }
      });
    };

    function getStationItemPromises (catererStationId) {
      var menuPayload = {
        catererStationId: catererStationId,
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };

      var updateStationPromises = [
        deliveryNoteFactory.getMenuCatererStationList(menuPayload)
      ];

      if (!angular.isDefined(_cateringStationItems[catererStationId])) {
        updateStationPromises.push(deliveryNoteFactory.getItemsByCateringStationId(catererStationId));
      }

      return updateStationPromises;
    }

    function getMasterRetailItemsByCatererStationId(catererStationId) {
      if (!catererStationId) {
        return;
      }

      displayLoadingModal();
      var updateStationPromises = getStationItemPromises(catererStationId);

      $q.all(updateStationPromises).then(function (responseCollection) {
        setStationItemsFromAPI(responseCollection, catererStationId);
      }, showResponseErrors);
    }

    function catererStationIdWatcher(newValue, oldValue) {
      if ($routeParams.state === 'edit' && !oldValue) {
        if (newValue) {
          getMasterRetailItemsByCatererStationId(newValue);
        }

        return newValue;
      }

      // If not first time loaded, it changed, so lets get the items
      if ($scope.deliveryNote.catererStationId !== newValue) {
        return newValue;
      }

      if ($routeParams.state !== 'create' && !oldValue) {
        return newValue;
      }

      if (newValue !== oldValue) {
        $scope.deliveryNote.items = [];
      }

      getMasterRetailItemsByCatererStationId(newValue);
      return newValue;
    }

    function saveDeliveryNoteResolution(response) {
      hideLoadingModal();
      showMessage(_formSaveSuccessText, 'success');
      if ($scope.deliveryNote.isAccepted || $routeParams.state === 'create' && angular.isDefined(response.id)) {
        $location.path('/manage-goods-received');
        return;
      }

      init();

      if (savedCatererStationList !== null && savedCatererStationList.length && ($scope.deliveryNote.catererStationId === null || !$scope.deliveryNote.catererStationId.length)) {
        $scope.catererStationList = savedCatererStationList;
      }      
    }

    function getMasterItemIdFromItem(item) {
      return parseInt(item.itemMasterId || item.masterItemId);
    }

    function getQuantity(quantity) {
      return isNumberGreaterThanOrEqualTo0(quantity) ? parseInt(quantity) : 0;
    }

    function createPayloadItems() {
      return $scope.deliveryNote.items.map(function(item) {
        var newItem = {
          masterItemId: getMasterItemIdFromItem(item),
          expectedQuantity: getQuantity(item.expectedQuantity),
          deliveredQuantity: getQuantity(item.deliveredQuantity),
          ullageQuantity: getQuantity(item.ullageQuantity),
          ullageReason: isNumberGreaterThanOrEqualTo0(item.ullageReason) ? parseInt(item.ullageReason) : null
        };

        var isNewItem = item.id === item.itemMasterId;
        if (item.id && !isNewItem) {
          newItem.id = item.id;
        }

        return newItem;
      });
    }

    function createPayload(_isAccepted) {
      _payload = {
        catererStationId: $scope.deliveryNote.catererStationId,
        purchaseOrderNumber: $scope.deliveryNote.purchaseOrderNumber,
        deliveryNoteNumber: $scope.deliveryNote.deliveryNoteNumber,
        deliveryDate: dateUtility.formatDateForAPI($scope.deliveryNote.deliveryDate),
        isAccepted: _isAccepted,
        items: createPayloadItems()
      };
      if ($scope.deliveryNote.id) {
        _payload.id = $scope.deliveryNote.id;
      }
    }

    $scope.isDeliveryDateSelected = function () {
      return $scope.deliveryNote !== 'undefined' && $scope.deliveryNote !== null && $scope.deliveryNote.deliveryDate !== undefined && $scope.deliveryNote.deliveryDate !== null && $scope.deliveryNote.deliveryDate !== '';
    };

    $scope.$watch('deliveryNote.deliveryDate', function () {
      if ($scope.isDeliveryDateSelected()) {
        getCatererStationsForDeliveryDate();
      } else {
        $scope.catererStationList = [];
      }
    }, true);

    function generateSavePayload(_isAccepted) {
      $scope.clearFilter();
      removeNullDeliveredItems();
      createPayload(_isAccepted);
    }

    $scope.removeItemByIndex = function(index, item) {
      if (!$scope.canRemoveItem(item)) {
        return;
      }

      $scope.canReview = canReview();
      $scope.deliveryNote.items.splice(index, true);
    };

    $scope.cancel = function() {
      if ($scope.prevState) {
        $scope.toggleReview();
        return;
      }

      $location.path('/');
    };

    $scope.canRemoveItem = function(item) {
      return item.canEdit && !$scope.readOnly;
    };

    $scope.formErrorClass = function(elementId, isName) {
      var fieldName = angular.element('#' + elementId).attr('name');
      if (isName) {
        fieldName = elementId;
      }

      if (!$scope.form[fieldName]) {
        return '';
      }

      if ($scope.form[fieldName].$dirty && !$scope.form[fieldName].$valid) {
        return 'has-error';
      }

      if ($scope.displayError && !$scope.form[fieldName].$valid) {
        return 'has-error';
      }

      return '';
    };

    /*jshint maxcomplexity:7 */
    $scope.toggleReview = function() {
      $scope.clearFilter();

      savedCatererStationList = $scope.catererStationList;
      var isFormValid = validateForm();
      if (!isFormValid) {
        hideLoadingModal();
        return;
      }

      var isItemsValid = deliveryNoteHasAllValidItems();
      if (!isItemsValid) {
        $scope.displayError = true;
        if ($scope.form && $scope.form.$valid && !deliveryNoteHasItems()) {
          $scope.errorCustom = [{
            field: 'Items Required',
            value: 'There must be at least one Item attached to this Delivery Note'
          }];
        } 

        return;
      }

      $scope.canReview = canReview();
      $scope.hideReview = false;
      $scope.form.$setSubmitted(true);

      if ($scope.prevState) {
        $scope.state = $scope.prevState;
        $scope.prevState = null;
        $scope.readOnly = false;
        $scope.viewName = _prevViewName;
        _prevViewName = null;
        return;
      }

      if ($scope.form && !$scope.form.$valid) {
        $scope.displayError = true;
        return;
      }

      if ($scope.form && $scope.form.$valid && !deliveryNoteHasItems()) {
        $scope.errorCustom = [{
          field: 'Items Required',
          value: 'There must be at least one Item attached to this Delivery Note'
        }];
        $scope.displayError = true;
        return;
      }

      $scope.displayError = false;
      $scope.prevState = $scope.state;
      $scope.state = 'review';
      $scope.canReview = false;
      $scope.readOnly = true;
      $scope.hideReview = true;
      _prevViewName = $scope.viewName;
      $scope.viewName = 'Review Delivery Note';
    };

    $scope.clearFilter = function() {
      $scope.errorCustom = [];
      $scope.displayError = false;

      if (angular.isUndefined($scope.filterInput)) {
        return;
      }

      if (angular.isDefined($scope.filterInput.itemCode)) {
        delete $scope.filterInput.itemCode;
      }

      if (angular.isDefined($scope.filterInput.itemName)) {
        delete $scope.filterInput.itemName;
      }

      $scope.sortItemsByCategory();
    };

    $scope.calculateBooked = function(item) {
      var deliveredQuantity = 0;
      if (item.deliveredQuantity) {
        deliveredQuantity = item.deliveredQuantity;
      }

      var ullageQuantity = 0;
      if (item.ullageQuantity) {
        ullageQuantity = item.ullageQuantity;
      }

      return deliveredQuantity - ullageQuantity;
    };

    function saveDeliveryNoteFailedReset(response) {
      $scope.toggleReview();
      showResponseErrors(response);
    }

    function saveDeliveryNoteFailed(failureResponse) {
      var promises = getStationItemPromises($scope.deliveryNote.catererStationId);

      $q.all(promises).then(function(stationsResponse) {
        setStationItemsFromAPI(stationsResponse, $scope.deliveryNote.catererStationId);
        saveDeliveryNoteFailedReset(failureResponse);
      });

    }

    function saveDeliveryNote() {
      $scope.displayError = false;
      var saveModalText = 'Saving';
      if (_payload.isAccepted) {
        saveModalText = 'Submitting';
      }

      displayLoadingModal(saveModalText);
      if ($routeParams.state === 'create') {
        _formSaveSuccessText = 'Created';
        deliveryNoteFactory.createDeliveryNote(_payload).then(saveDeliveryNoteResolution, saveDeliveryNoteFailed);
        return;
      }

      if ($routeParams.state !== 'edit') {
        return;
      }

      _formSaveSuccessText = 'Saved';
      if (_payload.isAccepted) {
        _formSaveSuccessText = 'Submitted';
      }

      deliveryNoteFactory.saveDeliveryNote(_payload).then(saveDeliveryNoteResolution, saveDeliveryNoteFailed);
    }

    $scope.save = function(_isAccepted) {
      savedCatererStationList = $scope.catererStationList;
      var isFormValid = validateForm();
      if (!isFormValid) {
        hideLoadingModal();
        return;
      }
      
      if ($scope.deliveryNote.isAccepted) {
        return;
      }

      generateSavePayload(_isAccepted);
      saveDeliveryNote();
    };

    function validateForm () {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    }

    $scope.changeItem = function(newItem, index) {
      newItem.canEdit = $scope.deliveryNote.items[index].canEdit;
      newItem.itemMasterId = newItem.itemMasterId || newItem.id;
      $scope.deliveryNote.items[index] = newItem;
      $scope.canReview = canReview();
      setAllowedMasterItems();
    };

    function addRows() {
      $scope.errorCustom = [];
      $scope.displayError = false;
      setAllowedMasterItems();
      var totalDeliveryNoteToAdd = $scope.addItemsNumber || 1;
      for (var i = 0; i < totalDeliveryNoteToAdd; i++) {
        $scope.newItems.push({});
      }

      hideLoadingModal();
    }

    $scope.addItems = function() {
      if (angular.isUndefined($scope.newItems)) {
        $scope.newItems = [];
      }

      addRows();
    };

    $scope.addItem = function(newItem, index) {
      if (!newItem) {
        return;
      }

      var inArray = $scope.deliveryNote.items.filter(function(item) {
        return (item.itemMasterId === newItem.id);
      });

      if (inArray.length) {
        return;
      }

      appendCategoryInformationToMasterItem(newItem);

      $scope.clearFilter();
      newItem.canEdit = true;
      newItem.itemMasterId = newItem.id;
      $scope.deliveryNote.items.push(newItem);
      setAllowedMasterItems();
      $scope.removeNewItemRow(index, newItem);

      $scope.sortItemsByCategory();
    };

    $scope.removeNewItemRow = function($index) {
      $scope.newItems.splice($index, true);
    };

    $scope.ullageQuantityChanged = function(item) {
      if (item.ullageQuantity) {
        return;
      }

      item.ullageReason = null;
    };

    $scope.showSaveButton = function() {
      return $scope.state === 'review';
    };

    $scope.hideCreatedByMeta = function() {
      return $scope.state === 'review' || $scope.state === 'create';
    };

    $scope.showFilterByForm = function() {
      if ($scope.state === 'review') {
        return false;
      }

      if (angular.isUndefined($scope.deliveryNote)) {
        return false;
      }

      if (!$scope.deliveryNote.items) {
        return false;
      }

      if (!$scope.deliveryNote.items.length) {
        return false;
      }

      return true;
    };

    $scope.canEditItem = function(item) {
      return !!item.canEdit && $scope.state !== 'review';
    };

    $scope.ullageReasonDisabled = function(item) {
      return $scope.readOnly || !item.ullageQuantity;
    };

    $scope.ullageReasonRequired = function(item) {
      return !$scope.readOnly && item.ullageQuantity;
    };

    $scope.isLMPStationIsDisabled = function() {
      if ($scope.readOnly ||
        Array.isArray($scope.catererStationList) && $scope.catererStationList.length === 0) {
        return true;
      }

      return false;
    };

    $scope.shouldShowCategoryHeader = function (item) {
      if ($scope.state !== 'review' && item.showCategoryHeader) {
        return true;
      } else if ($scope.state === 'review') {
        var itemsWithinCategory = lodash.filter($scope.deliveryNote.items, { salesCategoryId: item.salesCategoryId });
        var shouldShowCategoryHeader = lodash.filter(itemsWithinCategory, function (item) {
          return $scope.shouldShowItemOnReview(item);
        }).length > 0;

        return shouldShowCategoryHeader && item.showCategoryHeader;
      } else {
        return false;
      }
    };

    function setStationIdOnCreate() {
      if ($scope.state !== 'create') {
        return;
      }

      if ($routeParams.id) {
        $scope.deliveryNote.catererStationId = parseInt($routeParams.id);
      } else if ($scope.catererStationList.length === 1) {
        $scope.deliveryNote.catererStationId = $scope.catererStationList[0].id;
      }
    }

    function setWatchers() {
      if ($scope.state === 'edit' || $scope.state === 'create') {
        $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
        $scope.$watch('form.$error', formErrorWatcher, true);
      }
    }

    function appendCategoryInformationToDeliveryNoteItem(deliveryNoteItem) {
      var masterItem = lodash.find($scope.masterItems, { id: deliveryNoteItem.masterItemId });

      var lastCategoryId = lodash.findLast(masterItem.versions).categoryId;
      var category = $scope.categoryDictionary[lastCategoryId];

      deliveryNoteItem.salesCategoryId = category.id;
      deliveryNoteItem.orderBy = category.orderBy;
      deliveryNoteItem.categoryName = category.name;
    }

    function resolveAndCompleteLastInit(responseFromAPI) {
      $scope.masterItems = $filter('orderBy')(responseFromAPI.masterItems, 'itemName');

      $scope.deliveryNote.items.forEach(function (deliveryNoteItem) {
        appendCategoryInformationToDeliveryNoteItem(deliveryNoteItem);
      });

      setWatchers();
      setStationIdOnCreate();
      $scope.deliveryNote.deliveryDate = $scope.deliveryDateStore; 
      hideLoadingModal();
    }

    function completeInitCalls() {
      var payload = {
        itemTypeId: $scope.regularItemType.id,
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };

      if (!!$scope.inventoryCharacteristicType) {
        payload.characteristicId = $scope.inventoryCharacteristicType.id;
      }

      return deliveryNoteFactory.getMasterItems(payload).then(resolveAndCompleteLastInit, showResponseErrors);
    }

    function getCatererStationsForDeliveryDate() {
      if ($scope.isDeliveryDateSelected()) {
        $scope.catererStationListIsBeingLoaded = true;

        var catererStationsPayload = {
          startDate: dateUtility.formatDateForAPI($scope.deliveryNote.deliveryDate),
          endDate: dateUtility.formatDateForAPI($scope.deliveryNote.deliveryDate),
          limit: null
        };

        deliveryNoteFactory.getCatererStationList(catererStationsPayload).then(setCatererStationsList, showResponseErrors);
      }
    }

    function setCatererStationsList(apiResponse) {
      $scope.catererStationList = angular.copy(apiResponse.response);
      $scope.catererStationListIsBeingLoaded = false;

      if ($scope.catererStationList.length === 0) {
        $scope.catererStationListIsEmpty = true;
      } else {
        $scope.catererStationListIsEmpty = false;
      }
    }

    function setDeliveryNoteFromResponse(response) {
      $scope.deliveryNote = angular.copy(response);

      $scope.deliveryNote.items = $scope.deliveryNote.items;
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
      $scope.deliveryDateStore = $scope.deliveryNote.deliveryDate;
      $scope.deliveryNote.createdOn = dateUtility.formatTimestampForApp($scope.deliveryNote.createdOn);
      $scope.deliveryNote.updatedOn = dateUtility.formatTimestampForApp($scope.deliveryNote.updatedOn);

      if ($scope.deliveryNote.isAccepted) {
        $location.path(_path + 'view/' + $scope.deliveryNote.id);
      }
    }

    this.setCategoryList = function (dataFromAPI) {
      $scope.categories = [];
      $scope.categoryDictionary = [];

      // Flat out category list
      dataFromAPI.salesCategories.forEach(function (category) {
        $this.flatCategoryList(category, $scope.categories);
      });

      // Assign order for flatten category list and create helper dictionary
      var count = 1;
      $scope.categories.forEach(function (category) {
        category.orderBy = count++;
        $scope.categoryDictionary[category.id] = category;
      });
    };

    this.flatCategoryList = function (category, categories) {
      categories.push(category);

      category.children.forEach(function (category) {
        $this.flatCategoryList(category, categories);
      });
    };

    function resolveInitPromises(responseCollection) {
      $scope.regularItemType = lodash.findWhere(angular.copy(responseCollection[0]), { name: 'Regular' });
      $scope.inventoryCharacteristicType = lodash.findWhere(angular.copy(responseCollection[1]), { name: 'Inventory' });
      $scope.ullageReasons = lodash.filter(responseCollection[2].companyReasonCodes, { reasonTypeName: _reasonCodeTypeUllage });
      $scope.menuList = angular.copy(responseCollection[3].menus);

      $this.setCategoryList(responseCollection[4]);

      if (responseCollection[5]) {
        setDeliveryNoteFromResponse(responseCollection[5]);
      }

      completeInitCalls();
    }

    function setInitPromises () {
      var initPromises = [];
      initPromises.push(deliveryNoteFactory.getItemTypes());
      initPromises.push(deliveryNoteFactory.getCharacteristics());
      initPromises.push(deliveryNoteFactory.getCompanyReasonCodes());

      var payloadForMenu = { startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()) };
      initPromises.push(deliveryNoteFactory.getMenuList(payloadForMenu));

      initPromises.push(categoryFactory.getCategoryList({
        expand: true,
        sortBy: 'ASC',
        sortOn: 'orderBy',
        parentId: 0
      }));

      if ($scope.state === 'edit' || $scope.state === 'view') {
        initPromises.push(deliveryNoteFactory.getDeliveryNote($routeParams.id));
      }

      $scope.catererStationList = [];

      return initPromises;
    }

    function setScopeVars () {
      $scope.state = $routeParams.state;
      $scope.prevState = null;
      $scope.routeParamState = $routeParams.state;
      $scope.displayError = false;
      $scope.errorCustom = [];
      $scope.readOnly = $scope.state === 'view';
      $scope.disableActions = $scope.state === 'view';
      $scope.hideReview = $scope.state === 'view';
      $scope.catererStationListIsBeingLoaded = false;
      $scope.catererStationListIsEmpty = false;

      var viewNameForAction = {
        view: 'View Delivery Note',
        create: 'Create Delivery Note',
        edit: 'Edit Delivery Note'
      };

      $scope.viewName = viewNameForAction[$scope.state] || '';
    }

    // constructor
    function init() {
      var acceptedStates = ['view', 'edit', 'create'];
      if (acceptedStates.indexOf($routeParams.state) < 0) {
        $location.path('/');
      }

      displayLoadingModal();
      setScopeVars();
      var initPromises = setInitPromises();
      $q.all(initPromises).then(resolveInitPromises, showResponseErrors);
    }

    init();
  });
