'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, $routeParams, $location, $q, $filter, deliveryNoteFactory, dateUtility) {

    // static scope vars
    $scope.viewName = 'Delivery note';

    // private vars
    var _initPromises = [];
    var _companyId = deliveryNoteFactory.getCompanyId();
    var _companyMenuCatererStations = [];

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
      $scope.catererStationList = response.response;
    }

    function setDeliveryNoteFromResponse(response){
      $scope.deliveryNote = angular.copy(response);
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
    }

    function setCompanyMenuCatererStationsFromResponse(response){
      _companyMenuCatererStations = response.companyMenuCatererStations;
    }

    function catererStationIdWatcher(newValue, oldValue){
      if(!angular.isDefined(newValue)){
        return;
      }
      // If not first time loaded, it changed, so lets get the items
      if(angular.isDefined(oldValue) && $scope.deliveryNote.catererStationId === newValue){
        var catererStationId = parseInt(newValue);
        getMasterRetailItemsByCatererStationId(catererStationId);
      }
    }

    function getMasterRetailItemsByCatererStationId(catererStationId){
      // TODO - Blocker - https://jira.egate-solutions.com/browse/TSVPORTAL-2710
      // api/retail-items/master needs to accept catererStationId argument filter
      // and return id(master), Item Name, Item Code and NO versions
      deliveryNoteFactory.getMasterItemsByCatererStationId(catererStationId).then(setMasterItemsByCatererStationId, showResponseErrors);
    }

    function setMasterItemsByCatererStationId(response){
      $scope.catererStationMasterItems = response.masterItems;
      // TODO - On successful switch, will need to to filter out same, and only allow unique items to be appeneded to list
    }

    function setUllageReasonsFromResponse(response){
      $scope.ullageReasons = $filter('filter')(response.companyReasonCodes, {reasonTypeName:'Ullage'}, true);
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

    function getMasterItem(masterItemId){
      return $filter('filter')($scope.masterItems, {id:masterItemId}, true)[0];
    }

    function setItemMetaFromMasterItems(items){
      var masterItem;
      for(var i in items){
        masterItem = getMasterItem(items[i].masterItemId);
        items[i].itemName = masterItem.itemName;
        items[i].itemCode = masterItem.itemCode;
      }
    }

    function initPromisesResolved(){
      hideLoadingModal();
      var initPromisesResolvedStateAction = $routeParams.state + 'InitPromisesResolved';
      if(stateActions[initPromisesResolvedStateAction]){
        stateActions[initPromisesResolvedStateAction]();
      }
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    $scope.removeItemByIndex = function(index){
      $scope.deliveryNote.items.splice(index, true);
    };

    /*
    $scope.ullageReasonOnSelect = function($select){
      // TODO - add ability to allow user to enter free text, must create new ullage reason on save
      // http://stackoverflow.com/questions/29489821/allow-manually-entered-text-in-ui-select
      console.log($select);
    };*/

    function setSelectedUllageReasonByItemMasterId(item){
      $scope.selectedUllageReason[item.masterItemId] = {selected:{companyReasonCodeName: item.ullageReason}};
    }

    function setSelectedUllageReasons(){
      $scope.selectedUllageReason = [];
      for(var i in $scope.deliveryNote.items){
        setSelectedUllageReasonByItemMasterId($scope.deliveryNote.items[i]);
      }
    }

    var stateActions = {};
    // view state actions
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getMasterItemsList());
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function(){
      if(angular.isDefined($scope.deliveryNote)) {
        setItemMetaFromMasterItems($scope.deliveryNote.items);
      }
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
      resolveInitPromises();
    };

    // edit state actions
    stateActions.editInit = function(){
      $scope.readOnly = false;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      _initPromises.push(getUllageCompanyReasonCodes());
      _initPromises.push(getMasterItemsList());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function(){
      if(angular.isDefined($scope.deliveryNote)) {
        setItemMetaFromMasterItems($scope.deliveryNote.items);
      }
      if(angular.isDefined($scope.deliveryNote) && angular.isDefined($scope.ullageReasons)){
        setSelectedUllageReasons();
      }
    };

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
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
