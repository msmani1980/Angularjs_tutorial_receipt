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

    var companyReasonCodesJSON = {
      'companyReasonCodes': [
        {
          'id': 34,
          'companyId': 403,
          'companyReasonCodeName': 'Damaged',
          'companyReasonTypeId': 16,
          'description': 'Opening Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 12,
          'reasonTypeName': 'Opening Inventory'
        },
        {
          'id': 35,
          'companyId': 403,
          'companyReasonCodeName': 'Product Missing',
          'companyReasonTypeId': 16,
          'description': 'Opening Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 12,
          'reasonTypeName': 'Opening Inventory'
        },
        {
          'id': 36,
          'companyId': 403,
          'companyReasonCodeName': 'Extra Product',
          'companyReasonTypeId': 16,
          'description': 'Opening Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 12,
          'reasonTypeName': 'Opening Inventory'
        },
        {
          'id': 37,
          'companyId': 403,
          'companyReasonCodeName': 'Foreign Object',
          'companyReasonTypeId': 16,
          'description': 'Opening Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 12,
          'reasonTypeName': 'Opening Inventory'
        },
        {
          'id': 38,
          'companyId': 403,
          'companyReasonCodeName': 'Damaged',
          'companyReasonTypeId': 17,
          'description': 'Closing Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 13,
          'reasonTypeName': 'Closing Inventory'
        },
        {
          'id': 39,
          'companyId': 403,
          'companyReasonCodeName': 'Product Missing',
          'companyReasonTypeId': 17,
          'description': 'Closing Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 13,
          'reasonTypeName': 'Closing Inventory'
        },
        {
          'id': 40,
          'companyId': 403,
          'companyReasonCodeName': 'Extra Product',
          'companyReasonTypeId': 17,
          'description': 'Closing Inventory',
          'endDate': '2050-01-01',
          'startDate': '2015-05-05',
          'isActive': 'true',
          'reasonTypeId': 13,
          'reasonTypeName': 'Closing Inventory'
        },
      ],
      'meta': {
        'count': 20,
        'limit': 20,
        'start': 0
      }
    };

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

    var $this = this;

    this.isActionState = function(actionState) {
      return actionState === $routeParams.action;
    };

    this.validateForm = function() {
      $scope.displayError = $scope.companyReasonCodeFrom.$invalid;
      return $scope.companyReasonCodeFrom.$valid;
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

    this.createCompanyReasonCodeSuccess = function() {
      this.showSuccessMessage('Company Reason Code was created!');
    };

    this.createCompanyReasonCode = function() {
      var payload = this.generatePayload();
      // make service call here
      this.createCompanyReasonCodeSuccess(payload);
    };

    this.submitForm = function() {
      if( $this.validateForm() ) {
        $this.createCompanyReasonCode();
      }
    };

    this.setViewLabels = function() {
      $scope.buttonText = 'Save';
    };

    this.setCompanyReasonTypes = function(dataFromAPI) {
      $scope.companyReasonTypes = dataFromAPI.companyReasonTypes;
    };

    this.getCompanyReasonTypes = function() {
      // Factory call here
      return this.setCompanyReasonTypes(companyReasonTypesJSON);
    };

    this.setCompanyReasonCodes = function(dataFromAPI) {
      $scope.companyReasonCodes = dataFromAPI.companyReasonCodes;
    };

    this.getCompanyReasonCodes = function() {
      // Factory call here
      return this.setCompanyReasonCodes(companyReasonCodesJSON);
    };

    this.addReasonCode = function() {
      $scope.reasonCodeList.push({
        id: null,
        description: ''
      });
    };

    this.init = function() {
      $scope.displayError = false;
      $scope.reasonCodeList = [{
        id: 19,
        description: 'This is an ullage description'
      }];
      this.setViewLabels();
      this.getCompanyReasonCodes();
      this.getCompanyReasonTypes();
    };

    this.init();

    /* Scope Declarations */

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.addReasonCode = function() {
      return $this.addReasonCode();
    };

  });
