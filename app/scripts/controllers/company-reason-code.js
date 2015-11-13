'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReasonCodeCtrl', function ($scope) {

    var $this = this;

    this.validateForm = function() {
      $scope.displayError = $scope.companyReasonCodeFrom.$invalid;
      return $scope.companyReasonCodeFrom.$valid;
    };

    this.createCompanyReasonCode = function() {
      // make service call here
    };

    this.submitForm = function() {
      if( $this.validateForm() ) {
        $this.createCompanyReasonCode();
      }
    };

    $scope.displayError = false;

    $scope.submitForm = function() {
      return $this.submitForm();
    };

  });
