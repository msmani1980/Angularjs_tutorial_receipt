'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeCtrl
 * @description
 * # StockTakeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockTakeCtrl', function ($scope, $routeParams, $location, $q, $filter, stockTakeFactory, dateUtility, ngToast) {

    $scope.viewName = 'Stock Take';
    $scope.stockTake = {
      catererStationId: null
    };

    // private vars
    var _initPromises = [];
    var _cateringStationItems = [];

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Delivery Note</strong>: ' + message });
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
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

    function getCatererStationList(){
      return stockTakeFactory.getCatererStationList().then(setCatererStationListFromResponse);
    }

    function setCatererStationListFromResponse(response){
      $scope.catererStationList = response.response;
    }

    function catererStationIdWatcher(newValue){
      if($routeParams.state === 'view'){
        return newValue;
      }
      if(!newValue){
        return newValue;
      }
      getItemsByCatererStationId(newValue);
      return newValue;
    }

    function getItemsByCatererStationId(catererStationId){
      if(!catererStationId){
        return;
      }
      displayLoadingModal();
      $scope.stockTake.catererStationId = catererStationId;
      // used cached results instead of hitting API again
      if(angular.isDefined(_cateringStationItems[catererStationId])){
        var response = _cateringStationItems[catererStationId];
        setCateringStationItems(response);
        return;
      }
      stockTakeFactory.getItemsByCateringStationId(catererStationId).then(
        setCateringStationItems, showResponseErrors);
    }

    function setStationIdOnCreate() {
      if($routeParams.state !== 'create'){
        return;
      }
      if($routeParams.id) {
        $scope.stockTake.catererStationId = $routeParams.id;
      } else if($scope.catererStationList.length === 1){
        $scope.stockTake.catererStationId = $scope.catererStationList[0].id;
      }
    }

    function setCateringStationItems(response){
      hideLoadingModal();
      // Set cached results instead of hitting API again
      if(angular.isUndefined(_cateringStationItems[$scope.stockTake.catererStationId])){
        _cateringStationItems[$scope.stockTake.catererStationId] = response;
      }
      if(!response.response){
        $scope.cateringStationItems = [];
        showMessage('No items exist in this LMP Station, try another.', 'warning');
        return;
      }
      $scope.cateringStationItems = response.response;
      console.log('items in station', response.response);
      /*
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
      newMasterItems = $filter('orderBy')(newMasterItems, 'itemName');
      $scope.deliveryNote.items = angular.copy($scope.deliveryNote.items).concat(newMasterItems); */
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function initPromisesResolved(){
      hideLoadingModal();
      var initPromisesResolvedStateAction = $routeParams.state + 'InitPromisesResolved';
      if(stateActions[initPromisesResolvedStateAction]){
        stateActions[initPromisesResolvedStateAction]();
      }
    }

    // Scope functions
    $scope.clearFilter = function(){
      if(angular.isUndefined($scope.filterInput)){
        return;
      }
      if(angular.isDefined($scope.filterInput.itemCode)){
        delete $scope.filterInput.itemCode;
      }
      if(angular.isDefined($scope.filterInput.itemName)){
        delete $scope.filterInput.itemName;
      }
    };

    var stateActions = {};
    // view state actions
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      $scope.viewName = 'View Delivery Note';
      displayLoadingModal();
      // _initPromises.push();
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function(){
      this.editInitPromisesResolved();
      $scope.readOnly = true;
    };

    // create state actions
    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Stock Take';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };
    stateActions.createInitPromisesResolved = function() {
      setStationIdOnCreate();
    };

    // edit state actions
    stateActions.editInit = function(){
      $scope.viewName = 'Edit Stock Take';
      displayLoadingModal();
      // initPromises.push();
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function(){
      $scope.viewName = 'View Stock Take';
    };

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
      $scope.prevState = null;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      _cateringStationItems = [];

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
