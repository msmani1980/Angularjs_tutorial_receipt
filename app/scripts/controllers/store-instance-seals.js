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
      $scope.sealTypes = sealTypesJSON;
    };

    this.setWizardSteps = function(storeId) {
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps(storeId);
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
      $scope.storeId = $routeParams.storeId;
      if ($scope.storeId) {
        // TODO: Make a $q
        this.getStoreDetails();
        this.getSealColors();
        this.getSealTypes();
        this.setWizardSteps($scope.storeId);
      }
    };

    this.init();

    $scope.copySeals = function(copyFrom,copyTo) {
       var sealTypeFrom = $scope.sealTypesList.filter(function(sealType) { return sealType.name === copyFrom; })[0];
       var sealTypeTo = $scope.sealTypesList.filter(function(sealType) { return sealType.name === copyTo; })[0];
       sealTypeTo.seals.numbers = angular.copy(sealTypeFrom.seals.numbers);
    };

    // TODO: Set with controller method after APIs all resolve
    $scope.sealTypesList = [
      {
        name:'Outbound',
        code: 'OB',
        color:'#00B200',
        seals: {
            numbers:[]
        }
      },
      {
        name:'Handover',
        code: 'HO',
        color:'#E5E500',
        seals: {
            numbers:[]
        },
        actions: [
          {
            label: 'Copy From Outbound',
            trigger: function() {
              return $scope.copySeals('Outbound','Handover');
            }
          }
        ]
      },
      {
        name:'Inbound',
        code: 'IB',
        color:'#0000FF',
        seals: {
            numbers:[]
        },
        actions: [
          {
            label: 'Copy From Outbound',
            trigger: function() {
              return $scope.copySeals('Outbound','Inbound');
            }
          },
          {
            label: 'Copy From Handover',
            trigger: function() {
              return $scope.copySeals('Handover','Inbound');
            }
          },
        ]
      },
      {
        name:'High Security',
        code: 'HS',
        color:'#B70024',
        seals: {
            numbers:[]
        }
      },
    ];

  });
