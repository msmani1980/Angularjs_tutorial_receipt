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
  var removeCompanyTaxRateDeferred;

  beforeEach(inject(function($q, $controller, $rootScope, $injector, dateUtility, $route, ngToast, _servedTaxTypes_,
    _servedTaxRateTypes_, _servedCountryList_, _servedStations_, _servedCurrencies_, _servedCompanyTaxRates_) {

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

    removeCompanyTaxRateDeferred = $q.defer();
    spyOn(taxRatesFactory, 'removeCompanyTaxRate').and.returnValue(removeCompanyTaxRateDeferred.promise);

  }));

  function resolveAllDependencies() {
    getTaxTypesListDeferred.resolve(taxTypesJSON);
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);
    getCountriesListDeferred.resolve(countriesJSON);
    getStationsListDeferred.resolve(stationsListJSON);
    getCompanyCurrenciesDeferred.resolve(currenciesListJSON);
    getCompanyTaxRatesListDeferred.resolve(companyTaxRatesJSON);
    removeCompanyTaxRateDeferred.resolve({
      id: '123',
      companyId: '403'
    });
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

        describe('showClearButton method', function() {
          it('should return true if search has data', function() {
            $scope.search.taxRate = 1;
            expect($scope.showClearButton()).toBeTruthy();
          });
          it('should return true if dateRange is set', function() {
            $scope.dateRange.startDate = '11202015';
            expect($scope.showClearButton()).toBeTruthy();
          });
          it('should return false if search data is set but undefined', function() {
            $scope.search.taxType = undefined;
            $scope.dateRange.startDate = '';
            expect($scope.showClearButton()).toBeFalsy();
          });
          it('should trigger isDateRangeSet', function() {
            $scope.showClearButton();
            $scope.$digest();
            expect(TaxRatesCtrl.isDateRangeSet).toHaveBeenCalled();
          });
          it('should trigger isSearchActive and isSearchFieldActive', function() {
            $scope.search.taxRate = 1;
            $scope.showClearButton();
            $scope.$digest();
            expect(TaxRatesCtrl.isSearchFieldActive).toHaveBeenCalled();
            expect(TaxRatesCtrl.isSearchActive).toHaveBeenCalled();
          });
        });

        describe('searchRecords method', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'createSearchPromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'makeSearchPromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'createSearchPayload').and.callThrough();
            spyOn(TaxRatesCtrl, 'createUiSelectSearchPayload').and.callThrough();
            spyOn(TaxRatesCtrl, 'generateCompanyStationIds').and.callThrough();
            $scope.search = {
              'taxType': {
                'id': 20,
                'companyId': 403,
                'taxTypeCode': 'Local',
                'countTaxRate': '5',
                'description': 'Local Tax'
              },
              'country': {
                'id': 240,
                'countryName': 'United States'
              },
              'stations': [{
                'id': 129,
                'cityId': 5,
                'cityName': 'Chicago',
                'companyId': 403,
                'countryId': 240,
                'countryName': 'United States',
                'description': null,
                'isCaterer': false,
                'endDate': '2050-01-01',
                'startDate': '2015-05-02',
                'regionId': 4,
                'regionName': 'Illinois',
                'stationCode': 'LAX',
                'stationId': 8,
                'stationName': 'Los Angeles',
                'timezone': 'America/Chicago',
                'timezoneId': '459',
                'utcDstOffset': '-05:00',
                'utcOffset': '-06:00',
                'companyStationRelationships': []
              }, {
                'id': 131,
                'cityId': 5,
                'cityName': 'Chicago',
                'companyId': 403,
                'countryId': 240,
                'countryName': 'United States',
                'description': null,
                'isCaterer': false,
                'endDate': '2050-01-01',
                'startDate': '2015-05-02',
                'regionId': 4,
                'regionName': 'Illinois',
                'stationCode': 'ORD',
                'stationId': 1,
                'stationName': 'Chicago O-hare',
                'timezone': 'America/Chicago',
                'timezoneId': '459',
                'utcDstOffset': '-05:00',
                'utcOffset': '-06:00',
                'companyStationRelationships': []
              }],
              'taxRateType': {
                'id': '1',
                'taxRateType': 'Amount'
              },
              'taxRate': 9,
              'currency': {
                'id': 1,
                'companyId': 403,
                'code': 'USD',
                'name': 'U.S. Dollar'
              }
            };
            $scope.dateRange = {
              startDate: '12302015',
              endDate: '12302016'
            };
            $scope.searchRecords();
          });
          it('should call makeSearchPromises', function() {
            expect(TaxRatesCtrl.makeSearchPromises).toHaveBeenCalled();
          });
          it('should call createSearchPromises', function() {
            expect(TaxRatesCtrl.createSearchPromises).toHaveBeenCalled();
          });
          it('should call createSearchPayload', function() {
            expect(TaxRatesCtrl.createSearchPayload).toHaveBeenCalled();
          });
          it('should call createUiSelectSearchPayload', function() {
            expect(TaxRatesCtrl.createUiSelectSearchPayload).toHaveBeenCalled();
          });
          it('should call generateCompanyStationIds', function() {
            expect(TaxRatesCtrl.generateCompanyStationIds).toHaveBeenCalled();
          });
          it('generateCompanyStationIds should return empty', function() {
            $scope.search = {
              'stations': [{
                'id': 129
              }, {
                'id': 131
              }],
            };
            expect(TaxRatesCtrl.generateCompanyStationIds()).toBe('');
          });

        });

        describe('clearSearchFilters method', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'makeSearchPromises').and.callThrough();
          });
          it('should clear the search and dates', function() {
            $scope.search.taxRate = 1;
            $scope.clearSearchFilters();
            expect($scope.search).toEqual({});
            expect(TaxRatesCtrl.makeSearchPromises).toHaveBeenCalledWith(true);
          });
          it('should break and not error if undefined', function() {
            $scope.search = undefined;
            $scope.clearSearchFilters();
            expect($scope.search).toEqual(undefined);
          });
        });

        describe('isTaxRateActive method', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'isTaxRateActive').and.callThrough();
            taxRate = {
              startDate: '12302015',
              endDate: '12312016'
            };
          });
          it('should return falsy', function() {
            expect($scope.showEditButton(taxRate)).toBeFalsy();
          });
          it('should call the controller function', function() {
            $scope.showEditButton(taxRate);
            expect(TaxRatesCtrl.isTaxRateActive).toHaveBeenCalledWith(taxRate);
          });
        });

        describe('hasTaxRateStarted method', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'hasTaxRateStarted').and.callThrough();
            taxRate = {
              startDate: '12302015',
              endDate: '12302016'
            };

          });
          it('should return falsy', function() {
            expect($scope.showDeleteButton(taxRate)).toBeFalsy();
          });
          it('should call the controller function', function() {
            $scope.showDeleteButton(taxRate);
            expect(TaxRatesCtrl.hasTaxRateStarted).toHaveBeenCalledWith(taxRate);
          });
        });

        describe('routeReload method', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'reloadRoute').and.callThrough();
            TaxRatesCtrl.reloadRoute();
          });
          it('should be defined, cannot test or it will cause tests to break.', function() {
            expect(TaxRatesCtrl.reloadRoute).toHaveBeenCalled();
          });
        });

        describe('deleteCompanyTaxRate method', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'makeDeletePromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'createDeletePromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'displayConfirmDialog').and.callThrough();
            spyOn(TaxRatesCtrl, 'deleteSuccess').and.callThrough();
            taxRate = {
              id: '123',
              companyId: '403'
            };
            $scope.displayConfirmDialog(taxRate.id);
            $scope.deleteCompanyTaxRate(taxRate);
          });
          it('should call makeDeletePromises with payload', function() {
            expect(TaxRatesCtrl.makeDeletePromises).toHaveBeenCalledWith(taxRate);
          });
          it('should call createDeletePromises with payload', function() {
            expect(TaxRatesCtrl.createDeletePromises).toHaveBeenCalledWith(taxRate);
          });
          it('should call displayConfirmDialog with payload', function() {
            expect(TaxRatesCtrl.displayConfirmDialog).toHaveBeenCalledWith(taxRate.id);
          });
          it('should call deleteSuccess with payload', function() {
            resolveAllDependencies();
            expect(TaxRatesCtrl.deleteSuccess).toHaveBeenCalledWith([taxRate]);
          });

        });

      });

    });
  });
}); //Close for describe | Controller: TaxRatesCtrl
