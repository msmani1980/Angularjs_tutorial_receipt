'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, $routeParams, $location, $q, $filter, deliveryNoteFactory,
                                               dateUtility, ngToast, lodash) {

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

    function isNumberGreaterThanOrEqualTo0(value) {
      return angular.isDefined(value) && value !== null && parseInt(value) >= 0;
    }

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
      $scope.errorResponse = response;
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

      var itemsSet = $scope.deliveryNote.items.filter(function (item) {
        return isNumberGreaterThanOrEqualTo0(item.deliveredQuantity);
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

    $scope.shouldShowItemOnReview = function (item) {
      return ($scope.hideReview) ? isNumberGreaterThanOrEqualTo0(item.deliveredQuantity) : true;
    };

    function removeNullDeliveredItems() {
      $scope.deliveryNote.items = $scope.deliveryNote.items.filter(function (item) {
        return isNumberGreaterThanOrEqualTo0(item.deliveredQuantity);
      });
    }

    function setAllowedMasterItems() {
      var deliveryNoteItemIds = $scope.deliveryNote.items.map(function (item) {
        return item.itemMasterId;
      });

      $scope.masterItemsAllowedInSelect = $scope.masterItems.filter(function (masterItem) {
        return deliveryNoteItemIds.indexOf(masterItem.id) === -1;
      });
    }

    function addNewMasterItemsFromCatererStationMasterItemsResponse(responseFromAPI) {
      var response = angular.copy(responseFromAPI);
      $scope.deliveryNote.items = [];
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

        $scope.errorCustom = [{
          field: 'Items cannot be prepopulated',
          value: 'for this LMP Station because none exist. You must add them manually with the Add Items button below.'
        }];
        showResponseErrors();
        return;
      }

      var items = $filter('unique')(response.response, 'itemMasterId');
      var deliveryNoteItemIds = $scope.deliveryNote.items.map(function (item) {
        return item.itemMasterId;
      });

      var filteredResponseMasterItems = items.filter(function (item) {
        item.ullageQuantity = 0;
        return deliveryNoteItemIds.indexOf(item.itemMasterId) === -1;
      });

      var newMasterItems = $filter('orderBy')(filteredResponseMasterItems, 'itemName');
      removeNullDeliveredItems();
      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems);
      setAllowedMasterItems();
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
      $scope.ullageReasons = response.companyReasonCodes.filter(function (reasonCode) {
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
      if ($scope.form && $scope.form.$valid && !deliveryNoteHasItems()) {
        $scope.errorCustom = [{
          field: 'Items Required',
          value: 'There must be at least one Item attached to this Delivery Note'
        }];
        showResponseErrors();
      }
    }

    // constructor
    function init() {
      // scope vars
      $scope.state = $routeParams.state;
      $scope.routeParamState = $routeParams.state;
      $scope.displayError = false;
      $scope.errorCustom = [];

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
      if ($scope.deliveryNote.isAccepted || $routeParams.state === 'create' && angular.isDefined(response.id)) {
        $location.path('/manage-goods-received');
        return;
      }

      init();
    }

    function getMasterItemIdFromItem(item) {
      return parseInt(item.itemMasterId || item.masterItemId);
    }

    function getQuantity(quantity) {
      return isNumberGreaterThanOrEqualTo0(quantity) ? parseInt(quantity) : 0;
    }

    function createPayloadItems() {
      return $scope.deliveryNote.items.map(function (item) {
        return {
          masterItemId: getMasterItemIdFromItem(item),
          expectedQuantity: getQuantity(item.expectedQuantity),
          deliveredQuantity: getQuantity(item.deliveredQuantity),
          ullageQuantity: getQuantity(item.ullageQuantity),
          ullageReason: isNumberGreaterThanOrEqualTo0(item.ullageReason) ? parseInt(item.ullageReason) : null
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

    $scope.removeItemByIndex = function (index, item) {
      if (!$scope.canRemoveItem(item)) {
        return;
      }

      $scope.canReview = canReview();
      $scope.deliveryNote.items.splice(index, true);
    };

    $scope.cancel = function () {
      if ($scope.prevState) {
        $scope.toggleReview();
        return;
      }

      $location.path('/');
    };

    $scope.canRemoveItem = function (item) {
      return item.canEdit && !$scope.readOnly;
    };

    $scope.formErrorClass = function (elementId, isName) {
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

    $scope.toggleReview = function () {
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

      if ($scope.form && !$scope.form.$valid || !$scope.canReview) {
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
    };

    $scope.clearFilter = function () {
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

    $scope.calculateBooked = function (item) {
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

    $scope.save = function (_isAccepted) {
      if ($scope.deliveryNote.isAccepted) {
        return;
      }

      generateSavePayload(_isAccepted);
      saveDeliveryNote();
    };

    function setMasterItemsFromResponse(response) {
      $scope.masterItems = $filter('orderBy')(response.masterItems, 'itemName');
    }

    function getRegularItems(itemTypesFromAPI) {
      var regularItemType = lodash.findWhere(angular.copy(itemTypesFromAPI), { name: 'Regular' });
      if (regularItemType) {
        var startDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        return deliveryNoteFactory.getMasterItems({ itemTypeId: regularItemType.id, startDate: startDate }).then(setMasterItemsFromResponse, showResponseErrors);
      }

      return [];
    }

    function getMasterItems() {
      if (!$scope.masterItems) {
        displayLoadingModal();
        deliveryNoteFactory.getItemTypes().then(getRegularItems, showResponseErrors);
      }

      return false;
    }

    $scope.changeItem = function (newItem, index) {
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

    $scope.addItems = function () {
      if (angular.isUndefined($scope.newItems)) {
        $scope.newItems = [];
      }

      addRows();
    };

    $scope.addItem = function (newItem, index) {
      if (!newItem) {
        return;
      }

      var inArray = $scope.deliveryNote.items.filter(function (item) {
        return (item.itemMasterId === newItem.id);
      });

      if (inArray.length) {
        return;
      }

      $scope.clearFilter();
      newItem.canEdit = true;
      newItem.itemMasterId = newItem.id;
      $scope.deliveryNote.items.push(newItem);
      setAllowedMasterItems();
      $scope.removeNewItemRow(index, newItem);
    };

    $scope.removeNewItemRow = function ($index) {
      $scope.newItems.splice($index, true);
    };

    $scope.ullageQuantityChanged = function (item) {
      if (item.ullageQuantity) {
        return;
      }

      item.ullageReason = null;
    };

    $scope.showSaveButton = function () {
      return $scope.state === 'review';
    };

    $scope.hideCreatedByMeta = function () {
      return $scope.state === 'review' || $scope.state === 'create';
    };

    $scope.showFilterByForm = function () {
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

    $scope.canEditItem = function (item) {
      return !!item.canEdit && $scope.state !== 'review';
    };

    $scope.ullageReasonDisabled = function (item) {
      return $scope.readOnly || !item.ullageQuantity;
    };

    $scope.ullageReasonRequired = function (item) {
      return !$scope.readOnly && item.ullageQuantity;
    };

    $scope.isLMPStationIsDisabled = function () {
      if ($scope.readOnly ||
        Array.isArray($scope.catererStationList) && $scope.catererStationList.length === 1) {
        return true;
      }

      return false;
    };

    // view state actions
    stateActions.viewInit = function () {
      $scope.readOnly = true;
      $scope.viewName = 'View Delivery Note';
      $scope.hideReview = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItems());
      resolveInitPromises();
    };

    stateActions.viewInitPromisesResolved = function () {
      this.editInitPromisesResolved();
      $scope.readOnly = true;
    };

    // create state actions
    stateActions.createInit = function () {
      $scope.readOnly = false;
      $scope.hideReview = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItems());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('form.$error', formErrorWatcher, true);
      resolveInitPromises();
    };

    stateActions.createInitPromisesResolved = function () {
      setStationIdOnCreate();
    };

    // edit state actions
    stateActions.editInit = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Delivery Note';
      $scope.hideReview = false;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItems());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('form.$error', formErrorWatcher, true);
      resolveInitPromises();
    };

    stateActions.editInitPromisesResolved = function () {
      if ($scope.deliveryNote.isAccepted) {
        $location.path(_path + 'view/' + $scope.deliveryNote.id);
      }
    };

    init();

  });
