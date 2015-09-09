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
                                                   storeInstanceFactory) {

    $scope.stepWizardPrevTrigger = function(){
      $scope.showLooseDataAlert = true;
      return false;
    };

    $scope.looseDataAlertConfirmTrigger = function(){
      console.log('confirm triggered in controller');
    };

    $scope.looseDataAlertCancelTrigger = function(){
      console.log('cancel triggered in controller');
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
      storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId,
        payload).then(getItemsSuccessHandler);
    }

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      getStoreInstanceMenuItems();
    }

    function init() {
      $scope.storeId = $routeParams.storeId;
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($scope.storeId);
      storeInstanceFactory.getStoreDetails($scope.storeId).then(resolveGetStoreDetails);
    }
    init();

  });
