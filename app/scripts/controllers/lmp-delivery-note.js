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
    dateUtility, ngToast) {

    // static scope vars
    $scope.viewName = 'Delivery note';
    $scope.addItemsNumber = 1;
    $scope.deliveryNote = {
      catererStationId: null,
      deliveryNoteNumber: null,
      items: []
    };

    // private vars
    var _initPromises = [];
    var _formSaveSuccessText = null;
    var _cateringStationItems = [];
    var _reasonCodeTypeUllage = 'Ullage';
    var _payload = null;
    var _path = '/lmp-delivery-note/';
    var _prevViewName = null;
    var _firstTime = true;
    var stateActions = {};


    function showMessage(message, messageType) {
      ngToast.create({
        className: messageType,
        dismissButton: true,
        content: '<strong>Delivery Note</strong>: ' + message
      });
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response) {
      if ('data' in response) {
        angular.forEach(response.data, function(error) {
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function setCatererStationListFromResponse(response) {
      var catererStationList = response.response;
      $scope.catererStationList = catererStationList;
    }

    function getCatererStationList() {
      return deliveryNoteFactory.getCatererStationList().then(setCatererStationListFromResponse);
    }

    function setDeliveryNoteFromResponse(response) {
      $scope.deliveryNote = angular.copy(response);
      $scope.deliveryNote.items = $filter('orderBy')($scope.deliveryNote.items, 'itemName');
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
      $scope.deliveryNote.createdOn = dateUtility.removeMilliseconds($scope.deliveryNote.createdOn);
      $scope.deliveryNote.updatedOn = dateUtility.removeMilliseconds($scope.deliveryNote.updatedOn);
    }

    function getDeliveryNote() {
      return deliveryNoteFactory.getDeliveryNote($routeParams.id).then(setDeliveryNoteFromResponse);
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
      var itemsSet = $scope.deliveryNote.items.filter(function(retailItem) {
        return retailItem.deliveredQuantity;
      });
      if (!itemsSet.length) {
        return false;
      }
      return true;
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

    function setStationIdOnCreate() {
      if ($routeParams.state !== 'create') {
        return;
      }
      if ($routeParams.id) {
        $scope.deliveryNote.catererStationId = $routeParams.id;
      } else if ($scope.catererStationList.length === 1) {
        $scope.deliveryNote.catererStationId = $scope.catererStationList[0].id;
      }
    }

    function removeNullDeliveredItems() {
      $scope.deliveryNote.items = $scope.deliveryNote.items.filter(function(item) {
        return item.deliveredQuantity;
      });
    }

    function addNewMasterItemsFromCatererStationMasterItemsResponse(response) {
      hideLoadingModal();
      // Set cached results instead of hitting API again
      if (angular.isUndefined(_cateringStationItems[$scope.deliveryNote.catererStationId])) {
        _cateringStationItems[$scope.deliveryNote.catererStationId] = response;
      }
      if (!response.response) {
        if ($scope.routeParamState === 'edit' && _firstTime) {
          _firstTime = false;
          return;
        }
        showMessage(
          'No items can be auto-loaded for this LMP Station because none exist. You must add them manually with the "+Add Items" button below.',
          'warning');
        return;
      }
      var items = $filter('unique')(response.response, 'itemId');
      var devlieryNoteItemIds = $scope.deliveryNote.items.map(function(item) {
        return item.masterItemId;
      });
      var filteredResponseMasterItems = items.filter(function(item) {
        return devlieryNoteItemIds.indexOf(item.itemId) === -1;
      });

      var newMasterItems = filteredResponseMasterItems.map(function(item) {
        return {
          masterItemId: item.itemId,
          itemName: item.itemName,
          itemCode: item.itemCode
        };
      });
      newMasterItems = $filter('orderBy')(newMasterItems, 'itemName');
      removeNullDeliveredItems();
      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems);
    }

    function getMasterRetailItemsByCatererStationId(catererStationId) {
      if (!catererStationId) {
        return;
      }
      displayLoadingModal();
      // used cached results instead of hitting API again
      if (angular.isDefined(_cateringStationItems[catererStationId])) {
        var response = _cateringStationItems[catererStationId];
        addNewMasterItemsFromCatererStationMasterItemsResponse(response);
        return;
      }
      deliveryNoteFactory.getItemsByCateringStationId(catererStationId).then(
        addNewMasterItemsFromCatererStationMasterItemsResponse, showResponseErrors);
    }

    function catererStationIdWatcher(newValue, oldValue) {
      if ($routeParams.state === 'view') {
        return newValue;
      }
      if ($routeParams.state === 'edit' && !oldValue) {
        return newValue;
      }
      // If not first time loaded, it changed, so lets get the items
      if ($scope.deliveryNote.catererStationId !== newValue) {
        return newValue;
      }
      if ($routeParams.state !== 'create' && !oldValue) {
        return newValue;
      }
      getMasterRetailItemsByCatererStationId(newValue);
      return newValue;
    }

    function setUllageReasonsFromResponse(response) {
      $scope.ullageReasons = response.companyReasonCodes.filter(function(reasonCode) {
        return reasonCode.reasonTypeName === _reasonCodeTypeUllage;
      });
    }

    function getUllageCompanyReasonCodes() {
      return deliveryNoteFactory.getCompanyReasonCodes().then(setUllageReasonsFromResponse);
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

    function showFormErrors() {
      $scope.displayError = true;
      if ($scope.form && $scope.form.$valid && !deliveryNoteHasItems()) {
        var error = {
          data: [{
            field: 'Items',
            value: 'At least one item must have a "Delivered" amount.'
          }]
        };
        showResponseErrors(error);
      }
    }

    // constructor
    function init() {
      // scope vars
      $scope.state = $routeParams.state;
      $scope.routeParamState = $routeParams.state;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      $scope.prevState = null;
      var initStateAction = $routeParams.state + 'Init';
      if (stateActions[initStateAction]) {
        stateActions[initStateAction]();
      } else {
        $location.path('/');
      }
    }

    function saveDeliveryNoteResolution(response) {
      hideLoadingModal();
      showMessage(_formSaveSuccessText, 'success');
      if ($scope.deliveryNote.isAccepted) {
        $location.path('/manage-goods-received');
        return;
      }
      if ($routeParams.state === 'create' && angular.isDefined(response.id)) {
        $location.path(_path + 'edit/' + response.id);
        return;
      }
      init();
    }

    function createPayloadItems() {
      return $scope.deliveryNote.items.map(function(item) {
        return {
          masterItemId: parseInt(item.masterItemId),
          expectedQuantity: item.expectedQuantity ? parseInt(item.expectedQuantity) : null,
          deliveredQuantity: item.deliveredQuantity ? parseInt(item.deliveredQuantity) : null,
          ullageQuantity: item.ullageQuantity ? parseInt(item.ullageQuantity) : null,
          ullageReason: item.ullageReason ? parseInt(item.ullageReason) : null
        };
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

    $scope.toggleReview = function() {
      $scope.canReview = canReview();
      $scope.hideReview = false;
      if ($scope.prevState) {
        $scope.state = $scope.prevState;
        $scope.prevState = null;
        $scope.readOnly = false;
        $scope.viewName = _prevViewName;
        _prevViewName = null;
        return;
      }
      if (!$scope.canReview) {
        showFormErrors();
        return;
      }
      if ($scope.form && !$scope.form.$valid) {
        showFormErrors();
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
      removeNullDeliveredItems();
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

    function saveDeliveryNoteFailed(response) {
      $scope.displayError = true;
      $scope.toggleReview();
      showResponseErrors(response);
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
      if ($scope.deliveryNote.isAccepted) {
        return;
      }
      generateSavePayload(_isAccepted);
      saveDeliveryNote();
    };

    function setMasterItemsFromResponse(response) {
      $scope.masterItems = $filter('orderBy')(response.masterItems, 'itemName');
    }

    function getAllMasterItems() {
      if (!$scope.masterItems) {
        displayLoadingModal();
        return deliveryNoteFactory.getAllMasterItems().then(setMasterItemsFromResponse, showResponseErrors);
      }
      return false;
    }

    function setAllowedMasterItems() {
      var devlieryNoteItemIds = $scope.deliveryNote.items.map(function(item) {
        return item.masterItemId;
      });
      $scope.masterItemsAllowedInSelect = $scope.masterItems.filter(function(masterItem) {
        return devlieryNoteItemIds.indexOf(masterItem.id) === -1;
      });
    }

    function setChangedItem(newItem, $index) {
      var oldItem = angular.copy($scope.deliveryNote.items[$index]);
      newItem.expectedQuantity = oldItem.expectedQuantity;
      newItem.deliveredQuantity = oldItem.deliveredQuantity;
      newItem.ullageQuantity = oldItem.ullageQuantity;
      newItem.ullageReason = oldItem.ullageReason;
      newItem.bookedQuantity = oldItem.bookedQuantity;
      newItem.canEdit = true;
      $scope.deliveryNote.items[$index] = newItem;
    }

    $scope.changeItem = function(selectedMasterItem, $index) {
      $scope.canReview = canReview();
      setChangedItem(selectedMasterItem, $index);
      setAllowedMasterItems();
    };

    function addRows() {
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
      var masterItemsPromise = getAllMasterItems();
      if (!masterItemsPromise) {
        addRows();
        return;
      }
      $q.all([masterItemsPromise]).then(addRows, showResponseErrors);
    };

    $scope.addItem = function(selectedMasterItem, $index) {
      if (!selectedMasterItem) {
        return;
      }
      var inArray = $scope.deliveryNote.items.filter(function(item) {
        return item.masterItemId === selectedMasterItem.id;
      });
      if (inArray.length) {
        return;
      }
      $scope.clearFilter();
      var newItem = {
        canEdit: true,
        masterItemId: selectedMasterItem.id,
        itemCode: selectedMasterItem.itemCode,
        itemName: selectedMasterItem.itemName
      };
      $scope.deliveryNote.items.push(newItem);
      setAllowedMasterItems();
      $scope.removeNewItemRow($index, newItem);
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
      return item.canEdit && $scope.state !== 'review';
    };

    $scope.ullageReasonDisabled = function(item) {
      return $scope.readOnly || !item.ullageQuantity;
    };

    $scope.isLMPStationIsDisabled = function() {
      if ($scope.readOnly ||
        Array.isArray($scope.catererStationList) && $scope.catererStationList.length === 1) {
        return true;
      }
      return false;
    };

    // view state actions
    stateActions.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Delivery Note';
      $scope.hideReview = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function() {
      this.editInitPromisesResolved();
      $scope.readOnly = true;
    };

    // create state actions
    stateActions.createInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('form.$error', formErrorWatcher, true);
      resolveInitPromises();
    };
    stateActions.createInitPromisesResolved = function() {
      setStationIdOnCreate();
    };

    // edit state actions
    stateActions.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Delivery Note';
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('form.$error', formErrorWatcher, true);
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function() {
      if ($scope.deliveryNote.isAccepted) {
        $location.path(_path + 'view/' + $scope.deliveryNote.id);
      }
    };

    init();

  });
