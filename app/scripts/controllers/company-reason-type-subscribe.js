'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyReasonTypeSubscribeCtrl
 * @description
 * # CompanyReasonTypeSubscribeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
   .controller('CompanyReasonTypeSubscribeCtrl', function ($scope, $routeParams, ngToast, $q) {

     /* MOCK DATA - TO BE REMOVED */

     var globalReasonTypesJSON = {
      reasonTypes: [
        {
          id: 1,
          reasonTypeName: 'Aircraft Related',
          description: 'Any Aircraft Related Reasons ',
          createdBy: 2,
          createdOn: '2014-11-12 04:03:40.945451',
          updatedBy: 2,
          updatedOn: '2014-11-12 04:16:20.300704'
        },
        {
          id: 2,
          reasonTypeName: 'Passenger Related',
          description: 'Any Passenger Related Reasons ',
          createdBy: 2,
          createdOn: '2014-11-12 04:04:46.502925',
          updatedBy: 2,
          updatedOn: '2014-11-12 04:16:35.371034'
        },
        {
          id: 5,
          reasonTypeName: 'Weather Related',
          description: 'Any Weather Related Reasons ',
          createdBy: 2,
          createdOn: '2014-11-12 04:09:59.386483',
          updatedBy: 2,
          updatedOn: '2014-11-12 04:17:21.66572'
        },
        {
          id: 6,
          reasonTypeName: 'Crew Related',
          description: 'Any Crew Related Reasons ',
          createdBy: 2,
          createdOn: '2014-11-12 04:17:47.97459',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 9,
          reasonTypeName: 'Inventory',
          description: 'Inventory Management Reasons',
          createdBy: 2,
          createdOn: '2015-01-27 03:24:26.287074',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 10,
          reasonTypeName: 'Complimentary',
          description: 'Complimentary Management Reasons',
          createdBy: 2,
          createdOn: '2015-01-27 03:24:51.558555',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 11,
          reasonTypeName: 'Refund',
          description: 'Refund Related Reasons ',
          createdBy: 2,
          createdOn: '2015-02-19 19:40:39.821906',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 12,
          reasonTypeName: 'Opening Inventory',
          description: 'Opening Inventory',
          createdBy: 2,
          createdOn: '2015-05-04 04:19:23.693811',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 13,
          reasonTypeName: 'Closing Inventory',
          description: 'Closing Inventory',
          createdBy: 2,
          createdOn: '2015-05-04 04:19:58.230215',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 15,
          reasonTypeName: 'Ullage',
          description: 'Ullage',
          createdBy: 2,
          createdOn: '2015-05-04 04:20:41.347751',
          updatedBy: null,
          updatedOn: null
        },
        {
          id: 16,
          reasonTypeName: 'LMP Stock Adjustment',
          description: 'LMP Stock Adjustment',
          createdBy: 2,
          createdOn: '2015-08-20 16:43:46.277741',
          updatedBy: null,
          updatedOn: null
        }
      ],
      meta: {
        count: 11,
        limit: 11,
        start: 0
      }
    };

     var companyReasonCodeTypesJSON =  {
      companyReasonTypes: [
        {
          id: 17,
          companyId: 403,
          reasonTypeId: 13,
          isActive: true,
          description: 'Closing Inventory',
          reasonTypeName: 'Closing Inventory'
        },
        {
          id: 18,
          companyId: 403,
          reasonTypeId: 10,
          isActive: true,
          description: 'Complimentary Management Reasons',
          reasonTypeName: 'Complimentary'
        },
        {
          id: 26,
          companyId: 403,
          reasonTypeId: 16,
          isActive: true,
          description: 'LMP Stock Adjustment',
          reasonTypeName: 'LMP Stock Adjustment'
        },
        {
          id: 16,
          companyId: 403,
          reasonTypeId: 12,
          isActive: true,
          description: 'Opening Inventory',
          reasonTypeName: 'Opening Inventory'
        },
        {
          id: 20,
          companyId: 403,
          reasonTypeId: 11,
          isActive: true,
          description: 'Refund Related Reasons ',
          reasonTypeName: 'Refund'
        },
        {
          id: 19,
          companyId: 403,
          reasonTypeId: 15,
          isActive: true,
          description: 'Ullage',
          reasonTypeName: 'Ullage'
        }
      ],
      meta: {
        count: 6,
        limit: 6,
        start: 0
      }
    };

     var $this = this;

     this.displayUnsubscribeError = function(diff) {
      $scope.errorCustom = [];
      angular.forEach(diff, function(reasonType) {
        $scope.errorCustom.push({
          field: reasonType.reasonTypeName,
          value: 'You can\'t unsubscribe from this  Reason Type because there are Reasons associated with it'
        });
      });

      $scope.subscribeReasonTypesForm.$valid = false;
      $scope.subscribeReasonTypesForm.$invalid = true;
    };

     this.checkFormSubscribedTypes = function() {
      var diff = [];
      angular.forEach($scope.companyReasonTypes, function(existingReasonType) {
        var matchingReasonTypes = $scope.formData.companyReasonTypes.filter(function(reasonTypeInForm) {
          return (reasonTypeInForm.id === existingReasonType.reasonTypeId);
        });

        if (matchingReasonTypes.length === 0) {
          diff.push(existingReasonType);
        }
      });

      if (diff.length > 0) {
        return this.displayUnsubscribeError(diff);
      }

      $scope.subscribeReasonTypesForm.$valid = true;
      $scope.subscribeReasonTypesForm.$invalid = false;
    };

     this.validateForm = function() {
      this.checkFormSubscribedTypes();
      $scope.displayError = $scope.subscribeReasonTypesForm.$invalid;
      return $scope.subscribeReasonTypesForm.$valid;
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

     this.subscribeToReasonTypesSuccess = function() {
      this.showSuccessMessage('The selected Reason Types were updated!');
    };

     this.subscribeToReasonTypes = function() {
      var payload = this.generatePayload();

      // make service call here
      this.subscribeToReasonTypesSuccess(payload);
    };

     this.submitForm = function() {
      if ($this.validateForm()) {
        $this.subscribeToReasonTypes();
      }
    };

     this.setUpFormDataObject = function() {
      angular.forEach($scope.companyReasonTypes, function(reasonType) {
        $scope.formData.companyReasonTypes.push({
          id: reasonType.reasonTypeId,
          reasonTypeName: reasonType.reasonTypeName
        });
      });
    };

     this.setGlobalReasonTypes = function(dataFromAPI) {
      $scope.globalReasonTypes = [];
      angular.forEach(dataFromAPI.reasonTypes, function(reasonType) {
        $scope.globalReasonTypes.push({
          id: reasonType.id,
          reasonTypeName: reasonType.reasonTypeName
        });
      });
    };

     this.getGlobalReasonTypes = function() {
      // Factory call here
      return this.setGlobalReasonTypes(globalReasonTypesJSON);
    };

     this.setCompanyReasonTypes = function(dataFromAPI) {
      $scope.companyReasonTypes = [];
      angular.forEach(dataFromAPI.companyReasonTypes, function(reasonType) {
        $scope.companyReasonTypes.push({
          id: reasonType.id,
          reasonTypeId: reasonType.reasonTypeId,
          reasonTypeName: reasonType.reasonTypeName
        });
      });
    };

     this.getCompanyReasonTypes = function() {
      // Factory call here
      return this.setCompanyReasonTypes(companyReasonCodeTypesJSON);
    };

     this.makeInitPromises = function() {
      return [
        $this.getGlobalReasonTypes(),
        $this.getCompanyReasonTypes()
      ];
    };

     this.initSuccess = function() {
      $this.setUpFormDataObject();
      $scope.viewReady = true;
    };

     this.init = function() {
      $scope.displayError = false;
      $scope.errorCustom = [];
      $scope.formData = {
        companyReasonTypes:[]
      };
      var promises = this.makeInitPromises();
      $q.all(promises).then($this.initSuccess);
    };

     this.init();

     /* Scope Declarations */

     $scope.submitForm = function() {
      return $this.submitForm();
    };

   });
