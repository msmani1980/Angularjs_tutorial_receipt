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

    // SET $scope placeholders

    $scope.viewName = 'Tax Management';

    $scope.taxRatesList = [];
    $scope.taxTypesList = [];
    $scope.countriesList = [];
    $scope.stationsList = [];
    $scope.currenciesList = [];

    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    // Show/Hide loading modal

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    // SET $scope data

    this.setTaxTypesList = function(dataFromAPI) {
      $scope.taxTypesList = angular.copy(dataFromAPI.response);
    };

    this.setTaxRateTypesList = function(dataFromAPI) {
      $scope.taxRatesList = angular.copy(dataFromAPI);
    };

    this.setCountriesList = function(dataFromAPI) {
      $scope.countriesList = angular.copy(dataFromAPI.countries);
    };

    this.setStationsList = function(dataFromAPI) {
      $scope.stationsList = angular.copy(dataFromAPI);
    };

    this.setCurrenciesList = function(dataFromAPI) {
      $scope.currenciesList = angular.copy(dataFromAPI.response);
    };

    // GET $scope data

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

    this.getStationsList = function() {
      return taxRatesFactory.getStationsList(companyId, 0).then($this.setStationsList);
    };

    this.getCurrenciesList = function() {
      return taxRatesFactory.getCompanyCurrencies(companyId).then($this.setCurrenciesList);
    };

    // Dependancy Promises

    this.createPromises = function() {
      return [
        $this.getTaxTypesList(),
        $this.getTaxRateTypesList(),
        $this.getCountriesList(),
        $this.getStationsList(),
        $this.getCurrenciesList()
      ];
    };

    this.makePromises = function() {
      var promises = $this.createPromises();
      $q.all(promises).then($this.initSuccess);
    };

    // Initialize Controller

    this.initSuccess = function() {
      $this.hideLoadingModal();
      $scope.viewIsReady = true;
    };

    this.init = function() {
      $this.showLoadingModal('Loading data for Tax Management...');
      $this.makePromises();
    };

    this.init();

    // Place $scope functions here

    //TODO: write all $scope logic for template
  });
