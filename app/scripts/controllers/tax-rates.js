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

    $scope.taxRatesList = [];
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

    this.setTaxRateTypesList = function(dataFromAPI) {
      $scope.taxRatesList = angular.copy(dataFromAPI);
    };

    this.setCountriesList = function(dataFromAPI) {
      $scope.countriesList = angular.copy(dataFromAPI);
    };

    this.getTaxTypesList = function() {
      var params = {
        companyId: companyId
      };
      return taxRatesFactory.getTaxTypesList(params).then($this.setTaxTypesList);
    };

    this.getTaxRateTypesList = function() {
      return taxRatesFactory.getTaxRateTypes(companyId).then($this.setTaxRateTypesList);
    };

    this.getCountriesList = function() {
      return taxRatesFactory.getCountriesList().then($this.setCountriesList);
    };

    this.createPromises = function() {
      return [
        $this.getTaxTypesList(),
        $this.getTaxRateTypesList(),
        $this.getCountriesList()
      ];
    };

    this.makePromises = function() {
      var promises = $this.createPromises();
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
