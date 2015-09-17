'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceReviewCtrl
 * @description
 * # StoreInstanceReviewCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceReviewCtrl', function ($scope, $routeParams, storeInstanceDispatchWizardConfig,
                                                   storeInstanceFactory, $location, storeInstanceReviewFactory,
                                                   $q, ngToast, $filter) {

    var _initPromises = [];
    var _sealTypes = [];
    var _sealColors = [];
    var _storeInstanceSeals = [];
    var _nextStatusId = null;
    var STATUS_READY_FOR_DISPATCH = 'Ready for Dispatch';
    var STATUS_DISPATCHED = 'Dispatched';
    var MESSAGE_ACTION_NOT_ALLOWED = 'Action not allowed';

    function showMessage(message, messageType) {
      ngToast.create({className: messageType, dismissButton: true, content: '<strong>Store Instance Review</strong>: ' + message});
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response) {
      if ('data' in response) {
        angular.forEach(response.data, function (error) {
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function getItemsSuccessHandler(dataFromAPI) {
      $scope.menuItems = dataFromAPI.response;
    }

    function getStoreInstanceMenuItems() {
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceMenuItems($routeParams.storeId, payload)
          .then(getItemsSuccessHandler)
      );
    }

    function setStoreInstanceSeals(dataFromAPI){
      _storeInstanceSeals = dataFromAPI.response;
    }

    function setSealColors(dataFromAPI){
      _sealColors = dataFromAPI.response;
    }

    function setSealTypes(dataFromAPI){
      _sealTypes = dataFromAPI;
    }

    function getSealNumbersByTypeId(sealTypeId){
      var seals = $filter('filter')(_storeInstanceSeals, {type: sealTypeId}, true);
      var sealNumbers = [];
      for(var sealKey in seals){
        var seal = seals[sealKey];
        for(var sealNumberKey in seal.sealNumbers){
          var sealNumber = seal.sealNumbers[sealNumberKey];
          sealNumbers.push(sealNumber);
        }
      }
      return sealNumbers;
    }

    function getSealColorByTypeId(sealTypeId){
        var sealColor = $filter('filter')(_sealColors, {type: sealTypeId}, true);
      if(!sealColor || !sealColor.length){
        return null;
      }
      return sealColor[0].color;
    }

    function initLoadComplete(){


      hideLoadingModal();

      if($scope.menuItems) {
        $scope.menuItems.map(function (item) {
          item.itemDescription = item.itemCode + ' -  ' + item.itemName;
          item.disabled = true;
        });
      }

      $scope.seals = [];
      _sealTypes.map(function(sealType){
        $scope.seals.push({
          name: sealType.name,
          bgColor: getSealColorByTypeId(sealType.id),
          sealNumbers: getSealNumbersByTypeId(sealType.id)
        });
        return _sealTypes;
      });
    }

    function showUserCurrentStatus(messageAction) {
      hideLoadingModal();
      if (!messageAction) {
        messageAction = 'is set';
      }
      showMessage('Status ' + messageAction + ' to "' + $scope.storeDetails.currentStatus.statusName + '"', 'info');
    }

    function getStoreInstanceSeals() {
      _initPromises.push(
        storeInstanceReviewFactory.getStoreInstanceSeals($routeParams.storeId)
          .then(setStoreInstanceSeals)
      );
      _initPromises.push(
        storeInstanceReviewFactory.getSealColors()
          .then(setSealColors)
      );
      _initPromises.push(
        storeInstanceReviewFactory.getSealTypes()
          .then(setSealTypes)
      );
    }

    function resolveSetStoreInstanceStatus(response){
      $scope.storeDetails.currentStatus = $filter('filter')($scope.storeDetails.statusList, {id: response.statusId}, true)[0];
      showUserCurrentStatus('updated');
    }

    function getStatusNameIntByName(name){
      var status = $filter('filter')($scope.storeDetails.statusList, {statusName: name}, true);
      if(!status || !status.length){
        return false;
      }
      return status[0].name;
    }

    function throwError(field, message){
      if(!message){
        message = MESSAGE_ACTION_NOT_ALLOWED;
      }
      var error = {
        data: [{
          field: field,
          value: message
        }]
      };
      showResponseErrors(error);
    }

    function getSetStoreStatusByNamePromise(name){
      $scope.formErrors = [];
      var statusNameInt = getStatusNameIntByName(name);
      if(!statusNameInt){
        throwError('statusId', 'Unable to find statusId by name: ' + name);
        return false;
      }
      displayLoadingModal();
      return storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameInt).then(resolveSetStoreInstanceStatus);
    }

    function storeInstanceStatusDispatched(){
      showMessage('Now what? Redirect user where?', 'info');
      // TODO redirect user somewhere?
    }

    function isReadyForDispatch(){
      if($scope.storeDetails.currentStatus.statusName === STATUS_READY_FOR_DISPATCH) {
        return true;
      }
      throwError('statusId');
      $scope.actionNotAllowed = true;
      return false;
    }

    function getStoreInstanceReviewData(){
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(_initPromises).then(initLoadComplete, showResponseErrors);
    }

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      if(!isReadyForDispatch()){
        return;
      }
      var storeDetailValid = true;
      var storeInstanceValid = $routeParams.action + 'StoreInstanceValid';
      if (actions[storeInstanceValid]) {
        storeDetailValid = actions[storeInstanceValid]();
      }
      if(!storeDetailValid){
        return;
      }
      getStoreInstanceReviewData();
    }

    function saveStoreInstanceStatus(status){
      var promise = getSetStoreStatusByNamePromise(status);
      if(!promise){
        return;
      }
      $q.resolve(promise, storeInstanceStatusDispatched, showResponseErrors);
    }

    var actions = {};
    // Dispatch
    actions.dispatchInit = function(){
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);
      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($routeParams.storeId).then(resolveGetStoreDetails, showResponseErrors);
    };
    actions.dispatchSubmit = function(){
      saveStoreInstanceStatus(STATUS_DISPATCHED);
    };

    // Replenish
    actions.replenishInit = function(){
      $scope.wizardSteps = storeInstanceReplenishWizardConfig.getSteps($routeParams.storeId);
      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($routeParams.storeId).then(resolveGetStoreDetails, showResponseErrors);
    };
    actions.replenishStoreInstanceValid = function(){
      if($scope.storeDetails.replenishStoreInstanceId){
        return true;
      }
      // TODO check more stuff here for replenish?
      throwError('replenishStoreInstanceId');
      $scope.actionNotAllowed = true;
      return false;
    };
    actions.replenishSubmit = function(){
      saveStoreInstanceStatus(STATUS_DISPATCHED);
    };

    function storeInstanceStatusDispatched(){
      showMessage('Now what? Redirect user where?', 'info');
      // TODO redirect user somewhere?
    }

    function init() {
      _initPromises = [];
      _sealTypes = [];
      _sealColors = [];
      _storeInstanceSeals = [];
      _nextStatusId = null;

      $scope.displayError = false;
      $scope.formErrors = [];

      var initAction = $routeParams.action + 'Init';
      if (actions[initAction]) {
        actions[initAction]();
      } else {
        throwError('routeParams.action');
      }
    }
    init();

    $scope.stepWizardPrevTrigger = function(){
      $scope.showLoseDataAlert = true;
      return false;
    };

    $scope.goToWizardStep = function($index){
      $scope.wizardStepToIndex = $index;
      $scope.stepWizardPrevTrigger();
    };

    $scope.loseDataAlertConfirmTrigger = function(){
      var uri = $scope.wizardSteps[$scope.wizardStepToIndex].uri;
      $location.url(uri);
    };

    $scope.submit = function(){
      var initAction = $routeParams.action + 'Submit';
      if (actions[initAction]) {
        actions[initAction]();
      }
    };

  });
