'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function($scope, $routeParams, storeInstanceDispatchWizardConfig,
    storeInstanceFactory, sealTypesService, sealColorsService) {

    var $this = this;

    this.setSealColors = function(sealColorsJSON) {
      $scope.sealColorsList = sealColorsJSON;
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypesList = sealTypesJSON;
    };

    this.getSealColors = function() {
      sealColorsService.getSealColors().then($this.setSealColors);
    };

    this.getStoreDetails = function() {
      storeInstanceFactory.getStoreDetails($scope.storeId).then($this.setStoreDetails);
    };

    this.getSealTypes = function() {
      sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.init = function() {
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);
      $scope.storeId = $routeParams.storeId;
      if ($scope.storeId) {
        this.getStoreDetails();
        this.getSealColors();
        this.getSealTypes();
      }
    };

    this.init();

  });
