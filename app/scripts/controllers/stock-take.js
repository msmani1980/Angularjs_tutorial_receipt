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
    $scope.itemQuantities = [];
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

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Stock Take</strong>: ' + message });
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
        setCateringStationItemsFromResponse, showResponseErrors);
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

    function itemQuantitiesWatcher(newValue){
      $scope.canReview = canReview();
      return newValue;
    }

    function setCateringStationItemsFromResponse(response){
      hideLoadingModal();
      var items = $filter('unique')(response.response, 'masterItemId');
      items = $filter('orderBy')(items, 'itemName');
      setCateringStationItems(items);
    }

    function setCateringStationItems(items){
      if(angular.isUndefined(_cateringStationItems[$scope.stockTake.catererStationId])){
        _cateringStationItems[$scope.stockTake.catererStationId] = items;
      }
      if(!items){
        $scope.cateringStationItems = [];
        if(angular.isUndefined($scope.disabledCatererStationIds)){
          $scope.disabledCatererStationIds = [];
        }
        $scope.disabledCatererStationIds[$scope.stockTake.catererStationId] = true;
        $scope.stockTake.catererStationId = null;
        showMessage('No items exist for that LMP Station, please try another.', 'warning');
        return;
      }
      $scope.cateringStationItems = items;
    }

    function canReview(){
      if($scope.state === 'create' && !$scope.itemQuantities.length){
        return false;
      }
      if (!$scope.displayError && $scope.stockTake.isSubmitted) {
        return false;
      }
      return true;
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

    function generateSavePayload(){
      _payload = $scope.stockTake;
      _payload.items = generatePayloadItems();
    }

    function generatePayloadItems(){
      var items = [];
      for(var masterItemId in $scope.itemQuantities){
        if($scope.itemQuantities[masterItemId]){
          items.push({
            masterItemId: masterItemId,
            quantity: $scope.itemQuantities[masterItemId]
          });
        }
      }
      return items;
    }

    function saveStockTakeFailed(response){
      $scope.displayError = true;
      $scope.toggleReview();
      showResponseErrors(response);
    }

    function saveStockTakeResolution(response){
      showMessage(_formSaveSuccessText, 'success');
      hideLoadingModal();
      if($scope.stockTake.isSubmitted){
        $location.path('/stock-take-report');
        return;
      }
      if($routeParams.state === 'create' && angular.isDefined(response.id)){
        $location.path(_path+'edit/'+response.id);
        return;
      }
      init();
    }

    function saveStockTake(){
      displayLoadingModal('Saving');
      if($routeParams.state === 'create'){
        _formSaveSuccessText = 'Created';
        stockTakeFactory.createStockTake(_payload).then(
          saveStockTakeResolution, saveStockTakeFailed);
        return;
      }
      if($routeParams.state !== 'edit'){
        return;
      }
      _formSaveSuccessText = 'Saved';
      if(_payload.isSubmitted){
        _formSaveSuccessText = 'Submitted';
      }
      stockTakeFactory.updateStockTake($scope.stockTake.id, _payload).then(
        saveStockTakeResolution, saveStockTakeFailed);
    }

    function setStockTakeFromResponse(response){
      $scope.stockTake = response;
      $scope.stockTake.createdOn = dateUtility.removeMilliseconds($scope.stockTake.createdOn);
      $scope.stockTake.updatedOn = dateUtility.removeMilliseconds($scope.stockTake.updatedOn);
    }

    function getStockTake(){
      return stockTakeFactory.getStockTake($routeParams.id).then(setStockTakeFromResponse);
    }

    function setItemQuantitiesFromStockTake(){
      $scope.itemQuantities = [];
      for(var i in $scope.stockTake.items){
        $scope.itemQuantities[$scope.stockTake.items[i].masterItemId] = $scope.stockTake.items[i].quantity;
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

    $scope.cancel = function(){
      if($scope.prevState) { // there is a test for this, not showing up though
        $scope.toggleReview();
        return;
      }
      $location.path('/');
    };

    $scope.toggleReview = function(){
      if(!$scope.prevState) {
        $scope.clearFilter();
        $scope.prevState = $scope.state;
        $scope.state = 'review';
        $scope.canReview = false;
        $scope.readOnly = true;
        _prevViewName = $scope.viewName;
        $scope.viewName = 'Review Stock Take';
      }
      else{
        $scope.state = $scope.prevState;
        $scope.prevState = null;
        $scope.canReview = canReview();
        $scope.readOnly = false;
        $scope.viewName = _prevViewName;
        _prevViewName = null;
      }
    };

    $scope.save = function(_submit){
      if($scope.stockTake.isSubmitted){
        return;
      }
      $scope.displayError = false;
      $scope.stockTake.isSubmitted = _submit;
      generateSavePayload();
      saveStockTake();
    };

    var stateActions = {};
    // create state actions
    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Stock Take';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      $scope.$watch('itemQuantities', itemQuantitiesWatcher, true);
      resolveInitPromises();
    };
    stateActions.createInitPromisesResolved = function() {
      setStationIdOnCreate();
    };

    // edit state actions
    stateActions.editInit = function(){
      $scope.viewName = 'Edit Stock Take';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getStockTake());
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      $scope.$watch('itemQuantities', itemQuantitiesWatcher, true);
      resolveInitPromises();
    };
    stateActions.editInitPromisesResolved = function(){
      if($scope.stockTake.isSubmitted){
        $location.path(_path+'view/'+$scope.stockTake.id);
        return;
      }
      setItemQuantitiesFromStockTake();
    };

    // view state actions
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      $scope.viewName = 'View Stock Take';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getStockTake());
      $scope.$watch('stockTake.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };
    stateActions.viewInitPromisesResolved = function(){
      setItemQuantitiesFromStockTake();
      $scope.readOnly = true;
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
      _prevViewName = null;
      _payload = null;
      _formSaveSuccessText = '';

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
