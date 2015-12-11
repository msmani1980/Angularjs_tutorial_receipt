'use strict';

describe('Controller: TaxRatesCtrl', function() {

  beforeEach(module(
    'ts5App',
    'template-module',
    'served/tax-rate-types.json',
    'served/tax-types.json',
    'served/country-list.json',
    'served/stations.json',
    'served/currencies.json',
    'served/company-tax-rates.json'
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
  var companyTaxRatesJSON;
  var getTaxTypesListDeferred;
  var getTaxRateTypesDeferred;
  var getCountriesListDeferred;
  var getStationsListDeferred;
  var getCompanyCurrenciesDeferred;
  var getCompanyTaxRatesListDeferred;

  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedTaxTypes_, _servedTaxRateTypes_,
    _servedCountryList_, _servedStations_, _servedCurrencies_, _servedCompanyTaxRates_) {

    taxTypesJSON = _servedTaxTypes_;
    taxRateTypesJSON = _servedTaxRateTypes_;
    countriesJSON = _servedCountryList_;
    stationsListJSON = _servedStations_;
    currenciesListJSON = _servedCurrencies_;
    companyTaxRatesJSON = _servedCompanyTaxRates_;

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

    getCompanyTaxRatesListDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getCompanyTaxRatesList').and.returnValue(getCompanyTaxRatesListDeferred.promise);

  }));

  function resolveAllDependencies() {
    getTaxTypesListDeferred.resolve(taxTypesJSON);
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);
    getCountriesListDeferred.resolve(countriesJSON);
    getStationsListDeferred.resolve(stationsListJSON);
    getCompanyCurrenciesDeferred.resolve(currenciesListJSON);
    getCompanyTaxRatesListDeferred.resolve(companyTaxRatesJSON);
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

    it('should set the companyTaxRatesList as a blank array', function() {
      expect($scope.companyTaxRatesList).toEqual([]);
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

      it('should set the $scope.companyTaxRatesList to the mock data', function() {
        expect($scope.companyTaxRatesList).toEqual(companyTaxRatesJSON.taxRates);
      });

      describe('Search Template Logic', function() {

        beforeEach(function() {
          spyOn(TaxRatesCtrl, 'isDateRangeSet').and.callThrough();
          spyOn(TaxRatesCtrl, 'isSearchFieldActive').and.callThrough();
          spyOn(TaxRatesCtrl, 'isSearchActive').and.callThrough();
        });

        it('clearSearchFilters should clear the search and dates', function() {
          $scope.search = {
            taxRate: 1
          };
          $scope.clearSearchFilters();
          expect($scope.search).toEqual({});
        });

        it('showClearButton should return true if search has data', function() {
          $scope.search.taxRate = 1;
          expect($scope.showClearButton()).toBeTruthy();
        });

        it('showClearButton should return true if dateRange is set', function() {
          $scope.dateRange.startDate = '11202015';
          expect($scope.showClearButton()).toBeTruthy();
        });

        it('showClearButton should return false if search data is set but undefined', function() {
          $scope.search.taxType = undefined;
          $scope.dateRange.startDate = '';
          expect($scope.showClearButton()).toBeFalsy();
        });

        it('showClearButton should trigger isDateRangeSet', function() {
          $scope.showClearButton();
          $scope.$digest();
          expect(TaxRatesCtrl.isDateRangeSet).toHaveBeenCalled();
        });

        it('showClearButton should trigger isSearchActive and isSearchFieldActive', function() {
          $scope.search.taxRate = 1;
          $scope.showClearButton();
          $scope.$digest();
          expect(TaxRatesCtrl.isSearchFieldActive).toHaveBeenCalled();
          expect(TaxRatesCtrl.isSearchActive).toHaveBeenCalled();
        });

      });

    });

  });

}); //Close for describe | Controller: TaxRatesCtrl
