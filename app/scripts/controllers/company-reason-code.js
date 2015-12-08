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

    var globalReasonCodeTypesJSON = {
      'reasonTypes': [
        {
          'id': 1,
          'reasonTypeName': 'Aircraft Related',
          'description': 'Any Aircraft Related Reasons ',
          'createdBy': 2,
          'createdOn': '2014-11-12 04:03:40.945451',
          'updatedBy': 2,
          'updatedOn': '2014-11-12 04:16:20.300704'
        },
        {
          'id': 2,
          'reasonTypeName': 'Passenger Related',
          'description': 'Any Passenger Related Reasons ',
          'createdBy': 2,
          'createdOn': '2014-11-12 04:04:46.502925',
          'updatedBy': 2,
          'updatedOn': '2014-11-12 04:16:35.371034'
        },
        {
          'id': 5,
          'reasonTypeName': 'Weather Related',
          'description': 'Any Weather Related Reasons ',
          'createdBy': 2,
          'createdOn': '2014-11-12 04:09:59.386483',
          'updatedBy': 2,
          'updatedOn': '2014-11-12 04:17:21.66572'
        },
        {
          'id': 6,
          'reasonTypeName': 'Crew Related',
          'description': 'Any Crew Related Reasons ',
          'createdBy': 2,
          'createdOn': '2014-11-12 04:17:47.97459',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 9,
          'reasonTypeName': 'Inventory',
          'description': 'Inventory Management Reasons',
          'createdBy': 2,
          'createdOn': '2015-01-27 03:24:26.287074',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 10,
          'reasonTypeName': 'Complimentary',
          'description': 'Complimentary Management Reasons',
          'createdBy': 2,
          'createdOn': '2015-01-27 03:24:51.558555',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 11,
          'reasonTypeName': 'Refund',
          'description': 'Refund Related Reasons ',
          'createdBy': 2,
          'createdOn': '2015-02-19 19:40:39.821906',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 12,
          'reasonTypeName': 'Opening Inventory',
          'description': 'Opening Inventory',
          'createdBy': 2,
          'createdOn': '2015-05-04 04:19:23.693811',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 13,
          'reasonTypeName': 'Closing Inventory',
          'description': 'Closing Inventory',
          'createdBy': 2,
          'createdOn': '2015-05-04 04:19:58.230215',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 15,
          'reasonTypeName': 'Ullage',
          'description': 'Ullage',
          'createdBy': 2,
          'createdOn': '2015-05-04 04:20:41.347751',
          'updatedBy': null,
          'updatedOn': null
        },
        {
          'id': 16,
          'reasonTypeName': 'LMP Stock Adjustment',
          'description': 'LMP Stock Adjustment',
          'createdBy': 2,
          'createdOn': '2015-08-20 16:43:46.277741',
          'updatedBy': null,
          'updatedOn': null
        }
      ],
      'meta': {
        'count': 11,
        'limit': 11,
        'start': 0
      }
    };

   var companyReasonCodeTypesJSON =  {
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

    this.setGlobalReasonCodeTypes = function(dataFromAPI) {
      $scope.globalReasonCodeTypesList = dataFromAPI.reasonTypes;
      console.log($scope.globalReasonCodeTypesList);
    };

    this.getGlobalReasonCodeTypes = function() {
      // Factory call here
      return this.setGlobalReasonCodeTypes(globalReasonCodeTypesJSON);
    };

    this.setCompanyReasonCodeTypes = function(dataFromAPI) {
      $scope.companyReasonCodeTypesList = dataFromAPI.companyReasonTypes;
    };

    this.getCompanyReasonCodeTypes = function() {
      // Factory call here
      return this.setCompanyReasonCodeTypes(companyReasonCodeTypesJSON);
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
      $scope.selectedGlobalReasonCodeTypes = [

      ];
      this.setViewLabels();
      this.getCompanyReasonCodeTypes();
      this.getGlobalReasonCodeTypes();
    };

    this.init();

    /* Scope Declarations */

    $scope.submitForm = function() {
      return $this.submitForm();
    };

    $scope.addReasonCode = function() {
      return $this.addReasonCode();
    };

    $scope.filterByGlobalReason = function(reason) {
      if( Array.isArray($scope.selectedGlobalReasonCodeTypes) ) {
        var globalReason = $scope.selectedGlobalReasonCodeTypes.filter(function(reasonType) {
          return parseInt(reasonType.id) === parseInt(reason.id);
        });
        return globalReason;
      }
      return true;
    };

  });
