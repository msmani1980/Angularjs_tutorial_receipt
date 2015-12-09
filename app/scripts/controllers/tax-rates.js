'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TaxRatesCtrl
 * @description
 * # TaxRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TaxRatesCtrl', function($scope, taxRatesFactory, GlobalMenuService, $q) {

    var $this = this;

    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Tax Management';

    $scope.taxRateList = [];
    $scope.taxTypesList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setTaxTypesList = function(dataFromAPI) {
      $scope.taxTypesList = angular.copy(dataFromAPI.response);
    };

    this.getTaxTypesList = function() {
      var params = {
        companyId: companyId
      };
      return taxRatesFactory.getTaxTypesList(params).then($this.setTaxTypesList);
    };

    this.createPromises = function() {
      return [
        $this.getTaxTypesList()
      ];
    };

    this.makePromises = function() {
      var promises = $this.createPromises();
      console.log(promises);
      $q.all(promises).then($this.initSuccess);
    };

    this.initSuccess = function() {
      $this.hideLoadingModal();
      $scope.viewIsReady = true;
    };

    this.init = function() {
      $this.showLoadingModal('Loading data for Tax Management...');
      $this.makePromises();
    };

    this.init();

  });
