'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyEmailReceiptCreateCtrl
 * @description
 * # CompanyEmailReceiptCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyEmailReceiptCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, companyReceiptFactory) {
    var $this = this;

    $scope.viewName = 'Company E-mail Receipts';
    $scope.shouldDisableEndDate = false;
    $scope.displayError = false;
    $scope.companyReceipt = {};
    $scope.receiptTypes = [];

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.editingItem = false;
      $scope.isLoadingCompleted = true;
      $scope.viewName = 'Create Company E-mail Receipt';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.editingItem = true;
      $scope.viewName = 'View Company E-mail Receipt';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.editingItem = true;
      $scope.viewName = 'Edit Company E-mail Receipt';
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.companyReceiptForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };
  });
