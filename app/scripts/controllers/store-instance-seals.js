'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function ($scope, storeInstanceDispatchWizardConfig, $routeParams, storeInstanceFactory) {

    var $this = this;

    this.setStoreDetails = function(storeDetailsJSON){
      $scope.storeDetails = storeDetailsJSON;
    };

    this.getStoreDetails = function(){
      storeInstanceFactory.getStoreDetails($scope.storeId).then($this.setStoreDetails);
    };

    this.init = function() {
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps();
      $scope.storeId = $routeParams.storeId;
      if($scope.storeId){
        this.getStoreDetails();
      }
    };

    this.init();

  });
