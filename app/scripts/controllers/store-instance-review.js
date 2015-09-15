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
          bgColor: $filter('filter')(_sealColors, {type: sealType.id}, true)[0].color,
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

    function getSetStoreStatusByNamePromise(name){
      $scope.formErrors = [];
      var statusNameInt = getStatusNameIntByName(name);
      if(!statusNameInt){
        var error = {
          data: [{
            field: 'statusId',
            value: 'Fatal Error. Unable to find statusId of statusName "'+name+'"'
          }]
        };
        showResponseErrors(error);
        return false;
      }
      displayLoadingModal();
      return storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameInt).then(resolveSetStoreInstanceStatus);
    }

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      if($scope.storeDetails.currentStatus.statusName !== STATUS_READY_FOR_DISPATCH){
        var error = {
          data: [{
            field: 'statusId',
            value: 'Action not allowed because current status it: "'+$scope.storeDetails.currentStatus.statusName+'"'
          }]
        };
        showResponseErrors(error);
        $scope.actionNotAllowed = true;
        return;
      }
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(_initPromises).then(initLoadComplete, showResponseErrors);
    }

    function updatedStoreStatusSubmitted(){
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
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);

      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($routeParams.storeId).then(resolveGetStoreDetails, showResponseErrors);
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
      var promise = getSetStoreStatusByNamePromise(STATUS_DISPATCHED);
      if(!promise){
        return;
      }
      $q.all([promise]).then(updatedStoreStatusSubmitted, showResponseErrors);
    };

  });
