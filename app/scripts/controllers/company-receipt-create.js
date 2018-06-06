'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyReceiptCreateCtrl
 * @description
 * # CompanyReceiptCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReceiptCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, companyReceiptFactory, $filter) {
    var $this = this;

    $scope.viewName = 'Company Receipts';
    $scope.shouldDisableEndDate = false;
    $scope.displayError = false;
    $scope.companyReceipt = {};


  });
