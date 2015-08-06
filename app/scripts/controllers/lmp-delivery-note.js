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
    $scope.ullageReasons = ['FPO jus cause', 'Some reason'];

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
      return deliveryNoteFactory.getCompanyMenuCatererStations().then(setCompanyMenuCatererStations);
    }

    function setCatererStationListFromResponse(response){
      $scope.catererStationList = response.response;
    }

    function setDeliveryNoteFromResponse(response){
      $scope.deliveryNote = angular.copy(response);
      // console.log($scope.deliveryNote);
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
    }

    function setCompanyMenuCatererStations(response){
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
      deliveryNoteFactory.getMasterRetailItems(catererStationId).then(setMasterRetailItemsFromResponse, showResponseErrors);
      setCatererStationMenuIds(catererStationId);
    }

    function setMasterRetailItemsFromResponse(response){
      $scope.masterRetailItems = response.masterItems;
      // TODO - On successful switch, will need to to filter out same, and only allow unique items to be appeneded to list
    }

    function setCatererStationMenuIds(catererStationId){
      $scope.catererStationMenuIds = [];
      for(var i in _companyMenuCatererStations){
        if(_companyMenuCatererStations[i].catererStationIds.indexOf(catererStationId) === -1){
          continue;
        }
        if($scope.catererStationMenuIds.indexOf(_companyMenuCatererStations[i].menuId) !== -1){
          continue;
        }
        $scope.catererStationMenuIds.push(_companyMenuCatererStations[i].menuId);
      }
      getMenuItems();
    }

    function getMenuItems(){
      if(!$scope.catererStationMenuIds.length){
        return;
      }
      // TODO - We now have a list of menuIds, to get all the items based on those menuIds
      // For each menu ID, loop and call API - api/menus/#menu ID#
      // Returned menu has menuItems array, each item has itemId which is master ID
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
      // TODO switch on state?
      hideLoadingModal();
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    var stateActions = {};

    stateActions.viewInit = function(){
      $scope.readOnly = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      resolveInitPromises();
    };

    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };

    stateActions.editInit = function(){
      $scope.readOnly = false;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
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
