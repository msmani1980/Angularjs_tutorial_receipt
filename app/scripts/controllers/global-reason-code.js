'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('GlobalReasonCodeCtrl', function ($scope) {

    var $this = this;

    this.validateForm = function() {
      $scope.displayError = $scope.globalReasonCodeForm.$invalid;
      return $scope.globalReasonCodeForm.$valid;
    };

    this.createGlobalReasonCode = function() {
      // make service call here
    };

    this.submitForm = function() {
      if( $this.validateForm() ) {
        $this.createGlobalReasonCode();
      }
    };

    $scope.displayError = false;

    $scope.submitForm = function() {
      return $this.submitForm();
    };

  });
