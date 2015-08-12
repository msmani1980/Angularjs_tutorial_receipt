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
    var _prevState = null;
    var _formSaveSuccessText = null;

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
      // TODO - Blocker - https://jira.egate-solutions.com/browse/TSVPORTAL-2710
      // api/retail-items/master needs to accept catererStationId argument filter
      // and return id(master), Item Name, Item Code and NO versions
      displayLoadingModal();
      deliveryNoteFactory.getMasterItemsByCatererStationId(catererStationId).then(
        addNewMasterItemsFromCatererStationMasterItemsResponse, showResponseErrors);
    }

    function addNewMasterItemsFromCatererStationMasterItemsResponse(response){

      var devlieryNoteItemIds = $scope.deliveryNote.items.map(function(item){
        return item.masterItemId;
      });

      var filteredResponseMasterItems = response.masterItems.filter(function(item){
        return devlieryNoteItemIds.indexOf(item.id) === -1;
      });

      var newMasterItems = filteredResponseMasterItems.map(function(item){
        // TODO - once new API is done, if API returns itemName and itemCode, add to object below
          return getMasterItemById(item.id);
      });

      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems);
      // TODO TODO TODO TODO - now test the above
      hideLoadingModal();
    }

    function setUllageReasonsFromResponse(response){
      $scope.ullageReasons = response.companyReasonCodes.filter(function(reasonCode){
        return reasonCode.reasonTypeName === 'Ullage';
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

    function setAllMasterItemsFromResponse(response){
      $scope.masterItems = response.masterItems;
    }

    function getMasterItemsList(){
      return deliveryNoteFactory.getAllMasterItems().then(setAllMasterItemsFromResponse);
    }

    function getMasterItemById(masterItemId){
      var masterItem = $filter('filter')($scope.masterItems, {id:masterItemId}, true)[0];
      return {
        masterItemId: masterItemId,
        itemName: masterItem.itemName,
        itemCode: masterItem.itemCode
      };
    }

    function setItemMetaFromMasterItems(items){
      var masterItem;
      for(var i in items){
        masterItem = getMasterItemById(items[i].masterItemId);
        items[i].itemName = masterItem.itemName;
        items[i].itemCode = masterItem.itemCode;
      }
      return items;
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
      hideLoadingModal();
      showMessage(_formSaveSuccessText, 'success');
      $scope.toggleReview();
      var saveStateAction = $routeParams.state + 'Save';
      if(stateActions[saveStateAction]){
        stateActions[saveStateAction](response);
      }
    }

    function generateSavePayload(){
      $scope.clearFilter();
      removeNullDeliveredItems();
      var payload = {
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
            ullageReason: item.ullageReason
          };
        })
      };
      if($scope.deliveryNote.id){
        payload.id = $scope.deliveryNote.id;
      }
      // TODO if ullage quantity is is null or 0, clear ullage reason
      // TODO if ullage reason is does not exist, create a new one
      console.log(payload);
      return payload;
    }

    $scope.removeItemByIndex = function(index){
      $scope.deliveryNote.items.splice(index, true);
    };

    $scope.cancel = function(){
      if(_prevState) { // there is a test for this, not showing up though
        $scope.toggleReview();
        return;
      }
      $location.path('/');
    };

    $scope.toggleReview = function(){
      if(!_prevState) {
        _prevState = $scope.state;
        $scope.state = 'review';
        $scope.canReview = false;
        $scope.readOnly = true;
        console.log($scope.deliveryNote);
        removeNullDeliveredItems();
      }
      else{
        $scope.state = _prevState;
        _prevState = null;
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

    $scope.save = function(submit){
      var payload = generateSavePayload();
      displayLoadingModal('Saving');
      if($routeParams.state === 'create'){
        _formSaveSuccessText = 'Created';
        deliveryNoteFactory.createDeliveryNote(payload).then(saveDeliveryNoteResolution, showResponseErrors);
        return;
      }
      if($routeParams.state !== 'edit'){
        return;
      }
      _formSaveSuccessText = 'Saved';
      if(submit){
        _formSaveSuccessText = 'Submitted';
        payload.isAccepted = true;
      }
      deliveryNoteFactory.saveDeliveryNote(payload).then(saveDeliveryNoteResolution, showResponseErrors);
    };

    $scope.ullageReasonOnSelect = function($select,$item,masterItemId){
      if(angular.isString($item)) {
        var newReasontext = angular.copy($item);
        var newReason = {selected: {companyReasonCodeName: newReasontext}};
        var newOne = $filter('filter')($scope.selectedUllageReason, newReason, true);
        if (!newOne.length) {
          //Create a new entry since one does not exist
          $scope.selectedUllageReason[masterItemId] = newReason;
          $scope.ullageReasons.push({companyReasonCodeName: newReasontext});
        }
      }
      $select = $item;
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

    var stateActions = {};
    // view state actions
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItemsList());
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function(){
      this.editInitPromisesResolved();
    };

    // create state actions
    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItemsList());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('deliveryNoteForm.$error', deliveryNoteFormErrorWatcher, true);
      resolveInitPromises();
    };
    stateActions.createSave = function(response){
      console.log('stateActions.createSave', response);
    };

    // edit state actions
    stateActions.editInit = function(){
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItemsList());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      $scope.$watch('deliveryNoteForm.$error', deliveryNoteFormErrorWatcher, true);
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function(){
      if(angular.isDefined($scope.deliveryNote)) {
        setItemMetaFromMasterItems($scope.deliveryNote.items);
      }
      if(angular.isDefined($scope.deliveryNote) && angular.isDefined($scope.ullageReasons)){
        setSelectedUllageReasons();
      }
      $scope.canReview = canReview();
      $scope.readOnly = $scope.deliveryNote.isAccepted;
    };
    stateActions.editSave = function(response){
      console.log('stateActions.editSave', response);
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
