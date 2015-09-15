'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function($scope, $routeParams, $q,storeInstanceDispatchWizardConfig,
    storeInstanceFactory, sealTypesService, sealColorsService) {

    // TODO:
    // Validate the Seals and make sure that the required seals have atleast one seal
    // Allow a user to submit the form and save the Seals
    // For each seal type, the app must make a call and resolve each seal type in a $q
    // On submission mark status as Ready to Be Dispatched
    // Allow a user to Save & Exit
    // Allow a user to press Next, which submits the form
    // Allow a user to press Prev, which sends them back to step 2
    // Allow a user to edit existing seals in each seal type

    var $this = this;

    this.setSealColors = function(dataFromAPI) {
      $scope.sealColorsList = dataFromAPI.response;
    };

    this.setStoreDetails = function(storeDetailsJSON) {
      $scope.storeDetails = storeDetailsJSON;
    };

    this.setSealTypes = function(sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.setWizardSteps = function() {
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);
    };

    this.getSealColors = function() {
      return sealColorsService.getSealColors().then($this.setSealColors);
    };

    this.getStoreDetails = function() {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getSealTypes = function() {
      return sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.makePromises = function(){
      return [
        this.getStoreDetails(),
        this.getSealColors(),
        this.getSealTypes()
      ];
    };

    this.getSealTypesDependencies = function(){
      var promises = this.makePromises();
      $q.all(promises).then($this.generateSealTypesList);
    };

    this.generateSealTypeObject = function(sealType,sealColor){
      return {
        type: sealType.id,
        name: sealType.name,
        color: sealColor,
        seals: {
            numbers:[]
        },
        actions: $this.addSealTypeActions(sealType)
      };
    };

    this.createHandoverActions = function() {
      return [
        {
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound','Handover');
          }
        }
      ];
    };

    this.createInboundActions = function() {
      return [
        {
          label: 'Copy From Handover',
          trigger: function() {
            return $scope.copySeals('Handover','Inbound');
          }
        },
        {
          label: 'Copy From Outbound',
          trigger: function() {
            return $scope.copySeals('Outbound','Inbound');
          }
        }
      ];
    };

    this.addSealTypeActions = function(sealTypeObject) {
      // TODO: Naming conventions need to be set on BE to make this work correctly
      if(sealTypeObject.name === 'Handover') {
        return $this.createHandoverActions();
      }
      if(sealTypeObject.name === 'Inbound') {
        return this.createInboundActions();
      }
    };

    this.getSealColor = function(typeId) {
      return $scope.sealColorsList.filter(function(sealColor) { return sealColor.type === typeId; })[0];
    };

    this.generateSealTypesList = function() {
      $scope.sealTypesList = [];
      angular.forEach($scope.sealTypes, function(sealType) {
        var sealColor = $this.getSealColor(sealType.id);
        var sealTypeObject = $this.generateSealTypeObject(sealType,sealColor);
        $scope.sealTypesList.push(sealTypeObject);
      });
    };

    this.init = function() {
      if ($routeParams.storeId) {
        this.getSealTypesDependencies();
        this.setWizardSteps();
      }
    };

    this.init();

    $scope.copySeals = function(copyFrom,copyTo) {
       var sealTypeFrom = $scope.sealTypesList.filter(function(sealType) { return sealType.name === copyFrom; })[0];
       var sealTypeTo = $scope.sealTypesList.filter(function(sealType) { return sealType.name === copyTo; })[0];
       sealTypeTo.seals.numbers = angular.copy(sealTypeFrom.seals.numbers);
    };

  });
