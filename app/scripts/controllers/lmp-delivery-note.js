'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, $routeParams, $location, $q, $filter, deliveryNoteFactory, dateUtility, ngToast) {

    // static scope vars
    $scope.viewName = 'Delivery note';
    $scope.deliveryNote = {
      deliveryNoteNumber:null,
      items:[]
    };

    // private vars
    var _initPromises = [];
    var _companyId = deliveryNoteFactory.getCompanyId();
    var _companyMenuCatererStations = [];
    var _formSaveSuccessText = null;
    var _cateringStationItems = [];
    var _reasonCodeTypeUllage = 'Ullage';
    var _payload = null;
    var _path = '/lmp-delivery-note/';

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Delivery Note</strong>: ' + message });
    }

    function getCatererStationList(){
      return deliveryNoteFactory.getCatererStationList(_companyId).then(setCatererStationListFromResponse);
    }

    function getDeliveryNote(){
      return deliveryNoteFactory.getDeliveryNote($routeParams.id).then(setDeliveryNoteFromResponse);
    }

    function getCompanyMenuCatererStations(){
      return deliveryNoteFactory.getCompanyMenuCatererStations().then(setCompanyMenuCatererStationsFromResponse);
    }

    function setCatererStationListFromResponse(response){
      var catererStationList = response.response;
      $scope.catererStationList = catererStationList;
      // Next - if create and only 1 caterer station, lets set it and get the items
      if($routeParams.state !== 'create'){
        return;
      }
      if(catererStationList.length !== 1){
        return;
      }
      $scope.deliveryNote.catererStationId = catererStationList[0].id;
    }

    function setDeliveryNoteFromResponse(response){
      $scope.deliveryNote = angular.copy(response);
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
    }

    function setCompanyMenuCatererStationsFromResponse(response){
      _companyMenuCatererStations = response.companyMenuCatererStations;
    }

    function deliveryNoteFormErrorWatcher(){
      $scope.canReview = canReview();
    }

    function catererStationIdWatcher(newValue, oldValue){
      if(angular.isUndefined(newValue)){
        return newValue;
      }
      // Don't do anything if it didn't change
      if(oldValue === newValue){
        return newValue;
      }
      // If not first time loaded, it changed, so lets get the items
      if($scope.deliveryNote.catererStationId !== newValue){
        return newValue;
      }
      if(angular.isUndefined(oldValue) && $routeParams.state !== 'create'){
        return newValue;
      }
      getMasterRetailItemsByCatererStationId(newValue);
      return newValue;
    }

    function getMasterRetailItemsByCatererStationId(catererStationId){
      displayLoadingModal('Loading');
      // used cached results instead of hitting API again
      if(angular.isDefined(_cateringStationItems[catererStationId])){
        var response = _cateringStationItems[catererStationId];
        addNewMasterItemsFromCatererStationMasterItemsResponse(response);
        return;
      }
      deliveryNoteFactory.getItemsByCateringStationId(catererStationId).then(
        addNewMasterItemsFromCatererStationMasterItemsResponse, showResponseErrors);
    }

    function addNewMasterItemsFromCatererStationMasterItemsResponse(response){
      hideLoadingModal();
      // Set cached results instead of hitting API again
      if(angular.isUndefined(_cateringStationItems[$scope.deliveryNote.catererStationId])){
        _cateringStationItems[$scope.deliveryNote.catererStationId] = response;
      }
      if(!response.response){
        return;
      }
      var devlieryNoteItemIds = $scope.deliveryNote.items.map(function(item){
        return item.masterItemId;
      });
      var filteredResponseMasterItems = response.response.filter(function(item){
        return devlieryNoteItemIds.indexOf(item.itemMasterId) === -1;
      });

      var newMasterItems = filteredResponseMasterItems.map(function(item){
        return {
          masterItemId: item.itemMasterId,
          itemName: item.itemName,
          itemCode: item.itemCode
        };
      });
      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems);
    }

    function setUllageReasonsFromResponse(response){
      $scope.ullageReasons = response.companyReasonCodes.filter(function(reasonCode){
        return reasonCode.reasonTypeName === _reasonCodeTypeUllage;
      });
    }

    function getUllageCompanyReasonCodes(){
      return deliveryNoteFactory.getCompanyReasonCodes().then(setUllageReasonsFromResponse);
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response){
      if ('data' in response) {
        angular.forEach(response.data,function(error){
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function initPromisesResolved(){
      hideLoadingModal();
      var initPromisesResolvedStateAction = $routeParams.state + 'InitPromisesResolved';
      if(stateActions[initPromisesResolvedStateAction]){
        stateActions[initPromisesResolvedStateAction]();
      }
    }

    function removeNullDeliveredItems(){
      $scope.deliveryNote.items = $scope.deliveryNote.items.filter(function(item){
        return item.deliveredQuantity || item.expectedQuantity;
      });
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function saveDeliveryNoteResolution(response){
      showMessage(_formSaveSuccessText, 'success');
      if($routeParams.state === 'create' && angular.isDefined(response.id)){
        $location.path(_path+'edit/'+response.id);
        return;
      }
      init();
    }

    function getSelectedUllageReason(masterItemId){
      if(angular.isUndefined($scope.selectedUllageReason)){
        return null;
      }
      if(!$scope.selectedUllageReason[masterItemId]){
        return null;
      }
      if(angular.isUndefined($scope.selectedUllageReason[masterItemId].selected)){
        return null;
      }
      if(angular.isUndefined($scope.selectedUllageReason[masterItemId].selected.companyReasonCodeName)){
        return null;
      }
      return $scope.selectedUllageReason[masterItemId].selected.companyReasonCodeName;
    }

    function generateSavePayload(){
      $scope.clearFilter();
      removeNullDeliveredItems();
      _payload = {
        catererStationId: $scope.deliveryNote.catererStationId,
        purchaseOrderNumber: $scope.deliveryNote.purchaseOrderNumber,
        deliveryNoteNumber: $scope.deliveryNote.deliveryNoteNumber,
        deliveryDate: dateUtility.formatDateForAPI($scope.deliveryNote.deliveryDate),
        isAccepted: $scope.deliveryNote.isAccepted,
        items: $scope.deliveryNote.items.map(function(item){
          return {
            masterItemId: item.masterItemId,
            expectedQuantity: item.expectedQuantity,
            deliveredQuantity: item.deliveredQuantity,
            ullageQuantity: item.ullageQuantity,
            ullageReason: getSelectedUllageReason(item.masterItemId)
          };
        })
      };
      if($scope.deliveryNote.id){
        _payload.id = $scope.deliveryNote.id;
      }
    }

    $scope.removeItemByIndex = function(index){
      $scope.deliveryNote.items.splice(index, true);
    };

    $scope.cancel = function(){
      if($scope.prevState) { // there is a test for this, not showing up though
        $scope.toggleReview();
        return;
      }
      $location.path('/');
    };

    $scope.toggleReview = function(){
      if(!$scope.prevState) {
        $scope.prevState = $scope.state;
        $scope.state = 'review';
        $scope.canReview = false;
        $scope.readOnly = true;
        removeNullDeliveredItems();
      }
      else{
        $scope.state = $scope.prevState;
        $scope.prevState = null;
        $scope.canReview = canReview();
        $scope.readOnly = false;
      }
    };

    $scope.clearFilter = function(){
      if(angular.isUndefined($scope.filterInput)){
        return;
      }
      $scope.filterInput.itemCode = '';
      $scope.filterInput.itemName = '';
    };

    function saveDeliveryNoteFailed(response){
      $scope.toggleReview();
      showResponseErrors(response);
    }

    function saveDeliveryNote(){
      displayLoadingModal('Saving');
      if($routeParams.state === 'create'){
        _formSaveSuccessText = 'Created';
        deliveryNoteFactory.createDeliveryNote(_payload).then(saveDeliveryNoteResolution, saveDeliveryNoteFailed);
        return;
      }
      if($routeParams.state !== 'edit'){
        return;
      }
      _formSaveSuccessText = 'Saved';
      if(_payload.isAccepted){
        _formSaveSuccessText = 'Submitted';
      }
      deliveryNoteFactory.saveDeliveryNote(_payload).then(saveDeliveryNoteResolution, saveDeliveryNoteFailed);
    }

    $scope.save = function(_isAccepted){
      $scope.displayError = false;
      $scope.deliveryNote.isAccepted = _isAccepted;
      generateSavePayload();
      saveDeliveryNote();
    };

    function setSelectedUllageReasonByItemMasterId(item){
      $scope.selectedUllageReason[item.masterItemId] = {selected:{companyReasonCodeName: item.ullageReason}};
    }

    function setSelectedUllageReasons(){
      $scope.selectedUllageReason = [];
      for(var i in $scope.deliveryNote.items){
        setSelectedUllageReasonByItemMasterId($scope.deliveryNote.items[i]);
      }
    }

    function canReview(){
      if($scope.state !== 'create' && $scope.state !== 'edit'){
        return false;
      }
      if($scope.deliveryNote.isAccepted){
        return false;
      }
      if(!deliveryNoteHasItems()){
        return false;
      }
      if(angular.isDefined($scope.deliveryNoteForm)) {
        return $scope.deliveryNoteForm.$valid;
      }
      return true;
    }

    function deliveryNoteHasItems(){
      if(angular.isUndefined($scope.deliveryNote)){
        return false;
      }
      if(!$scope.deliveryNote.items){
        return false;
      }
      if(!$scope.deliveryNote.items.length){
        return false;
      }
      var itemsSet = $scope.deliveryNote.items.filter(function(retailItem){
        return retailItem.expectedQuantity && retailItem.deliveredQuantity;
      });
      if(!itemsSet){
        return false;
      }
      return true;
    }

    function setMasterItemsFromResponse(response){
      $scope.masterItems = response.masterItems;
    }

    function getAllMasterItems(){
      if(!$scope.masterItems){
        displayLoadingModal('Loading');
        return deliveryNoteFactory.getAllMasterItems().then(setMasterItemsFromResponse, showResponseErrors);
      }
      return false;
    }

    function setAllowedMasterItems(){
      var devlieryNoteItemIds = $scope.deliveryNote.items.map(function(item){
        return item.masterItemId;
      });
      $scope.masterItemsAllowedInSelect = $scope.masterItems.filter(function(masterItem){
        return devlieryNoteItemIds.indexOf(masterItem.id) === -1;
      });
    }

    function addRows(){
      setAllowedMasterItems();
      var totalDeliveryNoteToAdd = $scope.addItemsNumber || 1;
      $scope.addItemsNumber = null;
      console.log(totalDeliveryNoteToAdd);
      for (var i = 0; i < totalDeliveryNoteToAdd; i++) {
        $scope.deliveryNote.items.push({});
      }
    }

    $scope.addItems = function(){
      var masterItemsPromise = getAllMasterItems();
      if(!masterItemsPromise){
        addRows();
        return;
      }
      $q.all([masterItemsPromise]).then(addRows, showResponseErrors);
      hideLoadingModal();
    };

    $scope.addItem = function(selectedMasterItem, $index){
      if(!selectedMasterItem){
        return;
      }
      var inArray = $scope.deliveryNote.items.filter(function(item){
        return item.masterItemId === selectedMasterItem.id;
      });
      if(inArray.length){
        return;
      }
      if(!$scope.deliveryNote.items[$index]){
        return;
      }
      $scope.deliveryNote.items[$index] = {
        masterItemId: selectedMasterItem.id,
        itemCode: selectedMasterItem.itemCode,
        itemName: selectedMasterItem.itemName
      };
      setAllowedMasterItems();
    };

    var stateActions = {};
    // view state actions
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      displayLoadingModal('Loading');
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function(){
      this.editInitPromisesResolved();
      $scope.readOnly = true;
    };

    // create state actions
    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal('Loading');
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      _initPromises.push(getUllageCompanyReasonCodes());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('deliveryNoteForm.$error', deliveryNoteFormErrorWatcher, true);
      resolveInitPromises();
    };

    // edit state actions
    stateActions.editInit = function(){
      displayLoadingModal('Loading');
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      _initPromises.push(getUllageCompanyReasonCodes());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('deliveryNoteForm.$error', deliveryNoteFormErrorWatcher, true);
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function(){
      if(angular.isDefined($scope.deliveryNote) && angular.isDefined($scope.ullageReasons)){
        setSelectedUllageReasons();
      }
      $scope.canReview = canReview();
      $scope.readOnly = $scope.deliveryNote.isAccepted;
    };

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
      $scope.routeParamState = $routeParams.state;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      $scope.prevState = null;
      var initStateAction = $routeParams.state + 'Init';
      if(stateActions[initStateAction]){
        stateActions[initStateAction]();
      }
      else{
        $location.path('/');
      }
    }
    init();
  });
