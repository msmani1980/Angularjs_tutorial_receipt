'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReasonCodeCtrl', function ($scope,$routeParams,ngToast) {

    /* MOCK DATA - TO BE REMOVED */

   var companyReasonTypesJSON =  {
      'companyReasonTypes': [
        {
          'id': 17,
          'companyId': 403,
          'reasonTypeId': 13,
          'isActive': true,
          'description': 'Closing Inventory',
          'reasonTypeName': 'Closing Inventory'
        },
        {
          'id': 18,
          'companyId': 403,
          'reasonTypeId': 10,
          'isActive': true,
          'description': 'Complimentary Management Reasons',
          'reasonTypeName': 'Complimentary'
        },
        {
          'id': 26,
          'companyId': 403,
          'reasonTypeId': 16,
          'isActive': true,
          'description': 'LMP Stock Adjustment',
          'reasonTypeName': 'LMP Stock Adjustment'
        },
        {
          'id': 16,
          'companyId': 403,
          'reasonTypeId': 12,
          'isActive': true,
          'description': 'Opening Inventory',
          'reasonTypeName': 'Opening Inventory'
        },
        {
          'id': 20,
          'companyId': 403,
          'reasonTypeId': 11,
          'isActive': true,
          'description': 'Refund Related Reasons ',
          'reasonTypeName': 'Refund'
        },
        {
          'id': 19,
          'companyId': 403,
          'reasonTypeId': 15,
          'isActive': true,
          'description': 'Ullage',
          'reasonTypeName': 'Ullage'
        }
      ],
      'meta': {
        'count': 6,
        'limit': 6,
        'start': 0
      }
    };

    // TODO: Add mock company reason code data and add getter / setter

    var $this = this;

    this.getReasonTypeInFormData = function(reasonTypeId) {
      return $scope.formData.companyReasonTypes.filter(function(reasonType) {
        return parseInt(reasonType.id) === parseInt(reasonTypeId);
      })[0];
    };

    this.filterByReasonType = function(reason) {
      if( !Array.isArray($scope.reasonFilter.selectedReasonTypes) ||
        $scope.reasonFilter.selectedReasonTypes.length === 0 ) {
        return true;
      }
      return $scope.reasonFilter.selectedReasonTypes.filter(function(reasonType) {
        return parseInt(reasonType.id) === parseInt(reason.id);
      })[0];
    };

    this.isActionState = function(actionState) {
      return actionState === $routeParams.action;
    };

    this.validateForm = function(formObject) {
      $scope.displayError = formObject.$invalid;
      return formObject.$valid;
    };

    this.showSuccessMessage = function(message) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Success</strong> - ' + message
      });
    };

    this.generatePayload = function() {
      return angular.copy($scope.formData);
    };

    this.errorHandler = function(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.createCompanyReasonSuccess = function() {
      this.showSuccessMessage('The selected Reasons were saved!');
    };

    this.createCompanyReason = function() {
      var payload = this.generatePayload();
      // make service call here
      this.createCompanyReasonSuccess(payload);
    };

    this.submitForm = function(formObject) {
      if( $this.validateForm(formObject) ) {
        $this.createCompanyReason();
      }
    };

    this.setViewLabels = function() {
      $scope.buttonText = 'Save';
    };

    this.setSubscribedReasonTypes = function() {
      var reasons = [];
      $scope.companyReasonTypes.forEach(function(reasonType){
        reasons.push(reasonType);
      });
      return reasons;
    };

    this.setUpFormDataObject = function() {
      $scope.formData = {
        companyReasonTypes: this.setSubscribedReasonTypes()
      };
      angular.forEach($scope.formData.companyReasonTypes, function(reasonType) {
        reasonType.companyReasonCodes = [
          {reasonCode: 'Example reason 1',isActive:true},
          {reasonCode: 'Example reason 2',isActive:true}
        ];
      });
    };

    this.setCompanyReasonTypes = function(dataFromAPI) {
      $scope.companyReasonTypes = dataFromAPI.companyReasonTypes;
      this.setUpFormDataObject();
    };

    this.getCompanyReasonTypes = function() {
      // Factory call here
      return this.setCompanyReasonTypes(companyReasonTypesJSON);
    };

    this.addReasonCode = function(reasonTypeId) {
      var reasonType = this.getReasonTypeInFormData(reasonTypeId);
      if(reasonType) {
        reasonType.companyReasonCodes.push({
          reasonCode:'',
          isActive: null
        });
      }
    };

    this.removeReason = function(reasonTypeId,$index) {
      var reasonType = this.getReasonTypeInFormData(reasonTypeId);
      if(reasonType) {
        reasonType.companyReasonCodes.splice($index,1);
      }
    };

    this.init = function() {
      $scope.displayError = false;
      $scope.reasonFilter = {
        selectedGlobalReasons:[]
      };
      this.setViewLabels();
      // TODO: add $q and init success
      this.getCompanyReasonTypes();
    };

    this.init();

    /* Scope Declarations */

    $scope.submitForm = function(formObject) {
      return $this.submitForm(formObject);
    };

    $scope.addReasonCode = function(reasonTypeId) {
      return $this.addReasonCode(reasonTypeId);
    };

    $scope.removeReason = function(reasonTypeId,$index) {
      return $this.removeReason(reasonTypeId,$index);
    };

    $scope.whenReasonIsNotFiltered = function(reason) {
      return $this.filterByReasonType(reason);
    };

    $scope.addReasonCodeWithEnter = function(keyEvent,reasonTypeId) {
      if (keyEvent.which === 13) {
        $this.addReasonCode(reasonTypeId);
      }
    };

  });
