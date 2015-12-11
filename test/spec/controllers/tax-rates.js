'use strict';

describe('Controller: TaxRatesCtrl', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/tax-rate-types.json',
    'served/tax-types.json',
    'served/country-list.json',
    'served/stations.json',
    'served/currencies.json'
  ));

  var TaxRatesCtrl;
  var $scope;
  var controller;
  var compile;
  var templateCache;
  var taxRatesFactory;
  var taxTypesJSON;
  var taxRateTypesJSON;
  var countriesJSON;
  var stationsListJSON;
  var currenciesListJSON;
  var getTaxTypesListDeferred;
  var getTaxRateTypesDeferred;
  var getCountriesListDeferred;
  var getStationsListDeferred;
  var getCompanyCurrenciesDeferred;

  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedTaxTypes_, _servedTaxRateTypes_,
    _servedCountryList_, _servedStations_, _servedCurrencies_) {

    taxTypesJSON = _servedTaxTypes_;
    taxRateTypesJSON = _servedTaxRateTypes_;
    countriesJSON = _servedCountryList_;
    stationsListJSON = _servedStations_;
    currenciesListJSON = _servedCurrencies_;

    $scope = $rootScope.$new();
    controller = $controller;

    templateCache = $injector.get('$templateCache');
    compile = $injector.get('$compile');
    taxRatesFactory = $injector.get('taxRatesFactory');

    getTaxTypesListDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getTaxTypesList').and.returnValue(getTaxTypesListDeferred.promise);

    getTaxRateTypesDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);

    getCountriesListDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getCountriesList').and.returnValue(getCountriesListDeferred.promise);

    getStationsListDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getStationsList').and.returnValue(getStationsListDeferred.promise);

    getCompanyCurrenciesDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
  }));

  function resolveAllDependencies() {
    getTaxTypesListDeferred.resolve(taxTypesJSON);
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);
    getCountriesListDeferred.resolve(countriesJSON);
    getStationsListDeferred.resolve(stationsListJSON);
    getCompanyCurrenciesDeferred.resolve(currenciesListJSON);
    $scope.$digest();
  }

  function initController() {
    TaxRatesCtrl = controller('TaxRatesCtrl', {
      $scope: $scope
    });
  }

  function mockInitController() {
    TaxRatesCtrl.init();
    $scope.$digest();
  }

  describe('When the Controller is rendered, it', function() {

    beforeEach(function() {
      initController();
    });

    it('should set the taxRateList as a blank array', function() {
      expect($scope.taxRatesList).toEqual([]);
    });

    it('should set the taxTypesList as a blank array', function() {
      expect($scope.taxTypesList).toEqual([]);
    });

    it('should set the countriesList as a blank array', function() {
      expect($scope.countriesList).toEqual([]);
    });

    it('should set the stationsList as a blank array', function() {
      expect($scope.stationsList).toEqual([]);
    });

    it('should set the currenciesList as a blank array', function() {
      expect($scope.currenciesList).toEqual([]);
    });

    it('should set the taxTypesList as a blank array', function() {
      var mockDates = {
        startDate: '',
        endDate: ''
      };
      expect($scope.dateRange).toEqual(mockDates);
    });

  });

  describe('When the controller is Initialized, it', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();

      spyOn(TaxRatesCtrl, 'showLoadingModal');
      spyOn(TaxRatesCtrl, 'hideLoadingModal');

      mockInitController();
    });

    it('should set the $scope.viewName to Tax Management', function() {
      expect($scope.viewName).toBe('Tax Management');
    });

    it('should display the loading modal, with specific text', function() {
      expect(TaxRatesCtrl.showLoadingModal).toHaveBeenCalledWith('Loading data for Tax Management...');
    });

    it('should hide the loading modal', function() {
      expect(TaxRatesCtrl.hideLoadingModal).toHaveBeenCalled();
    });

    it('should set the viewIsReady to true', function() {
      expect($scope.viewIsReady).toBeTruthy();
    });

    describe('After dependencies have been resolved, it', function() {

      it('should set the $scope.taxTypesList to the mock data', function() {
        expect($scope.taxTypesList).toEqual(taxTypesJSON.response);
      });

      it('should set the $scope.taxRatesList to the mock data', function() {
        expect($scope.taxRatesList).toEqual(taxRateTypesJSON);
      });

      it('should set the $scope.countriesList to the mock data', function() {
        expect($scope.countriesList).toEqual(countriesJSON.countries);
      });

      it('should set the $scope.stationsList to the mock data', function() {
        expect($scope.stationsList).toEqual(stationsListJSON.response);
      });

      it('should set the $scope.currenciesList to the mock data', function() {
        expect($scope.currenciesList).toEqual(currenciesListJSON.response);
      });

    });

  });

}); //Close for describe | Controller: TaxRatesCtrl
