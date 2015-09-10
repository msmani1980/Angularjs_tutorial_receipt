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
                                                   $q, ngToast) {

    var storeInstancePromises = [];

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

    $scope.stepWizardPrevTrigger = function(){
      $scope.showLooseDataAlert = true;
      return false;
    };

    $scope.goToWizardStep = function($index){
      $scope.wizardStepToIndex = $index;
      $scope.stepWizardPrevTrigger();
    };

    $scope.looseDataAlertConfirmTrigger = function(){
      var uri = $scope.wizardSteps[$scope.wizardStepToIndex].uri;
      $location.url(uri);
    };

    function getItemsSuccessHandler(dataFromAPI) {
      $scope.menuItems = dataFromAPI.response;
      $scope.menuItems.map(function(item){
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
        item.disabled = true;
      });
    }

    function getStoreInstanceMenuItems() {
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      storeInstancePromises.push(
        storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload)
          .then(getItemsSuccessHandler)
      );
    }

    function setStoreInstanceSeals(dataFromAPI){
      $scope.storeInstanceSeals = dataFromAPI;
      // TODO parse this: console.log(dataFromAPI);
    }

    function setSealColors(dataFromAPI){
      $scope.sealColors = dataFromAPI;
      // TODO parse this: console.log(dataFromAPI);
    }

    function setSealTypes(dataFromAPI){
      $scope.sealTypes = dataFromAPI;
      // TODO parse this: console.log(dataFromAPI);
    }

    function allStoreInstancePromisesResolved(){
      // TODO console.log('all store instance promises resolved');
      showMessage('Loaded', 'info'); // TODO FPO
      hideLoadingModal();
    }

    function getStoreInstanceSeals() {
      storeInstancePromises.push(
        storeInstanceReviewFactory.getStoreInstanceSeals($scope.storeId)
          .then(setStoreInstanceSeals)
      );
      storeInstancePromises.push(
        storeInstanceReviewFactory.getSealColors()
          .then(setSealColors)
      );
      storeInstancePromises.push(
        storeInstanceReviewFactory.getSealTypes()
          .then(setSealTypes)
      );
    }

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(storeInstancePromises).then(allStoreInstancePromisesResolved, showResponseErrors);
    }

    function init() {
      storeInstancePromises = [];

      $scope.displayError = false;
      $scope.formErrors = [];
      $scope.storeId = $routeParams.storeId;
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($scope.storeId);

      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($scope.storeId).then(resolveGetStoreDetails, showResponseErrors);
    }
    init();

  });
