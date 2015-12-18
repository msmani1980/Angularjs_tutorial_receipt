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
  var updateCompanyTaxRateDeferred;

  beforeEach(inject(function($q, $controller, $rootScope, $injector, $route, dateUtility, ngToast, _servedTaxTypes_,
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

    updateCompanyTaxRateDeferred = $q.defer();
    spyOn(taxRatesFactory, 'updateCompanyTaxRate').and.returnValue(updateCompanyTaxRateDeferred.promise);
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
    updateCompanyTaxRateDeferred.resolve({
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
      spyOn(TaxRatesCtrl, 'setCompanyTaxRatesList').and.callThrough();
      spyOn(TaxRatesCtrl, 'createCompanyTaxRates').and.callThrough();
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
    it('should set the masterTaxRates as a blank array', function() {
      expect($scope.masterTaxRates).toEqual([]);
    });
    it('should set the taxRateToRemove as a blank array', function() {
      expect($scope.taxRateToRemove).toEqual([]);
    });
    it('should fail setting the companyTaxRatesList', function() {
      var dataFromAPI = [];
      TaxRatesCtrl.setCompanyTaxRatesList(dataFromAPI);
      expect(TaxRatesCtrl.setCompanyTaxRatesList).toHaveBeenCalledWith([]);
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
      spyOn(TaxRatesCtrl, 'hideSearchPanel');
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
    it('should hide the search panel', function() {
      expect(TaxRatesCtrl.hideSearchPanel).toHaveBeenCalled();
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

      describe('$scope.companyTaxRatesList and $scope.masterTaxRates', function() {
        beforeEach(function() {
          spyOn(TaxRatesCtrl, 'createCompanyTaxRates').and.callThrough();
          spyOn(TaxRatesCtrl, 'createMasterCompanyTaxRates').and.callThrough();
          spyOn(TaxRatesCtrl, 'formatTaxRateObject').and.callThrough();
          spyOn(TaxRatesCtrl, 'uiSelectPosition').and.callThrough();
        });
        it('should set $scope.companyTaxRatesList', function() {
          expect($scope.companyTaxRatesList.length).toBe(14);
        });
        it('should set $scope.masterTaxRates', function() {
          expect($scope.masterTaxRates.length).toBe(14);
        });
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
            spyOn(TaxRatesCtrl, 'searchSuccess').and.callThrough();
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
          it('should call searchSuccess', function() {
            resolveAllDependencies();
            expect(TaxRatesCtrl.searchSuccess).toHaveBeenCalled();
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
            spyOn($scope, 'deleteCompanyTaxRate').and.callThrough();
            taxRate = {
              id: '123',
              companyId: '403',
              deleted: true
            };
            $scope.displayConfirmDialog(taxRate);
            $scope.deleteCompanyTaxRate(taxRate);
          });
          it('should call makeDeletePromises with payload', function() {
            expect(TaxRatesCtrl.makeDeletePromises).toHaveBeenCalledWith(taxRate);
          });
          it('should call createDeletePromises with payload', function() {
            expect(TaxRatesCtrl.createDeletePromises).toHaveBeenCalledWith(taxRate.id);
          });
          it('should call displayConfirmDialog with payload', function() {
            expect(TaxRatesCtrl.displayConfirmDialog).toHaveBeenCalledWith(taxRate);
          });
          it('should call deleteSuccess with payload', function() {
            taxRate = {
              id: '123',
              companyId: '403'
            };
            resolveAllDependencies();
            expect(TaxRatesCtrl.deleteSuccess).toHaveBeenCalledWith([taxRate]);
          });
        });

        describe('editCompanyTaxRate method', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'editCompanyTaxRate').and.callThrough();
            spyOn(TaxRatesCtrl, 'cancelTaxRateEdit').and.callThrough();
            spyOn(TaxRatesCtrl, 'addEditActionToTaxRate').and.callThrough();
            spyOn(TaxRatesCtrl, 'saveTaxRateEdits').and.callThrough();
            spyOn(TaxRatesCtrl, 'makeEditPromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'createEditPromises').and.callThrough();
            spyOn(TaxRatesCtrl, 'editSuccess').and.callThrough();
            spyOn(TaxRatesCtrl, 'resetTaxRate').and.callThrough();
            spyOn(TaxRatesCtrl, 'resetTaxRateEdit').and.callThrough();
            taxRate = companyTaxRatesJSON.taxRates[0];
          });
          it('should call editCompanyTaxRate with payload', function() {
            $scope.editCompanyTaxRate(taxRate);
            expect(TaxRatesCtrl.editCompanyTaxRate).toHaveBeenCalledWith(taxRate);
          });
          it('should call cancelTaxRateEdit with payload', function() {
            $scope.cancelTaxRateEdit(taxRate);
            expect(TaxRatesCtrl.cancelTaxRateEdit).toHaveBeenCalledWith(taxRate);
          });
          it('should call addEditActionToTaxRate with payload', function() {
            $scope.editCompanyTaxRate(taxRate);
            expect(TaxRatesCtrl.addEditActionToTaxRate).toHaveBeenCalledWith(taxRate);
          });
          it('should call editCompanyTaxRateand error gracefully', function() {
            $scope.editCompanyTaxRate();
            expect(TaxRatesCtrl.editCompanyTaxRate).toHaveBeenCalled();
          });
          it('should call cancelTaxRateEdit and error gracefully', function() {
            $scope.cancelTaxRateEdit();
            expect(TaxRatesCtrl.cancelTaxRateEdit).toHaveBeenCalled();
          });
          it('should call addEditActionToTaxRate and error gracefully', function() {
            $scope.editCompanyTaxRate();
            expect(TaxRatesCtrl.addEditActionToTaxRate).toHaveBeenCalled();
          });
          it('should call saveTaxRateEdits', function() {
            $scope.saveTaxRateEdits(taxRate);
            expect(TaxRatesCtrl.saveTaxRateEdits).toHaveBeenCalledWith(taxRate);
          });
          it('should call editSuccess', function() {
            $scope.saveTaxRateEdits(taxRate);
            resolveAllDependencies();
            expect(TaxRatesCtrl.editSuccess).toHaveBeenCalled();
          });
          it('should call resetTaxRateEdit', function() {
            $scope.resetTaxRateEdit(taxRate);
            expect(TaxRatesCtrl.resetTaxRateEdit).toHaveBeenCalledWith(taxRate);
          });
          it('should call resetTaxRateEdit', function() {
            $scope.resetTaxRateEdit(taxRate);
            expect(TaxRatesCtrl.resetTaxRate).toHaveBeenCalled();
          });
        });

        describe('$scope.isFieldReadOnly', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'isTaxRateActive').and.callThrough();
            spyOn(TaxRatesCtrl, 'hasTaxRateStarted').and.callThrough();
            taxRate = companyTaxRatesJSON.taxRates[0];
          });
          it('should return true', function() {
            expect($scope.isFieldReadOnly(taxRate)).toBeTruthy();
          });
        });

        describe('$scope.taxRateRowClass', function() {
          it('should return bg-warning with edited flag set', function() {
            var taxRate = [];
            taxRate.edited = true;
            expect($scope.taxRateRowClass(taxRate)).toBe('bg-warning');
          });
          it('should return bg-info with created flag set', function() {
            var taxRate = [];
            taxRate.created = true;
            expect($scope.taxRateRowClass(taxRate)).toBe('bg-info');
          });
          it('should return bg-danger with deleted flag set', function() {
            var taxRate = [];
            taxRate.deleted = true;
            expect($scope.taxRateRowClass(taxRate)).toBe('bg-danger');
          });
          it('should return bg-success with deleted flag set', function() {
            var taxRate = [];
            taxRate.saved = true;
            expect($scope.taxRateRowClass(taxRate)).toBe('bg-success');
          });
          it('should return empty', function() {
            var taxRate = [];
            expect($scope.taxRateRowClass(taxRate)).toBe();
          });
        });

        describe('$scope.determineDatePickerOrientation', function() {
          it('should return false with a number less than 7', function() {
            var taxRate = [];
            taxRate.key = 7;
            expect($scope.determineDatePickerOrientation(taxRate)).toBe();
          });
          it('should return false with a number less than 7', function() {
            var taxRate = [];
            taxRate.key = 13;
            expect($scope.determineDatePickerOrientation(taxRate)).toBe('auto');
          });
        });

        describe('determineMinDate', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'determineMinDate').and.callThrough();
          });
          it('should have called controller function with the start date', function() {
            var taxRate = companyTaxRatesJSON.taxRates[0];
            $scope.determineMinDate(taxRate.startDate);
            expect(TaxRatesCtrl.determineMinDate).toHaveBeenCalledWith(taxRate.startDate);
          });
          it('should have called controller function with nothing, and return today', function() {
            $scope.determineMinDate();
            expect(TaxRatesCtrl.determineMinDate).toHaveBeenCalled();
          });
        });

        describe('createNewTaxRate', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'createNewTaxRate').and.callThrough();
          });
          it('should have called controller and added a new record', function() {
            $scope.companyTaxRatesList = companyTaxRatesJSON.taxRates;
            var length = parseInt($scope.companyTaxRatesList.length);
            $scope.createNewTaxRate();
            expect(TaxRatesCtrl.createNewTaxRate).toHaveBeenCalled();
            expect($scope.companyTaxRatesList.length - 1).toBe(length);
          });
        });

        describe('searchUiSelectReady', function() {
          beforeEach(function() {
            spyOn($scope, 'searchUiSelectReady').and.callThrough();
          });
          it('should return undefined with nothing set', function() {
            $scope.uiSelectReady = true;
            $scope.searchUiSelectReady();
            expect($scope.searchUiSelectReady()).toBe(undefined);
          });
          it('should return true if uiSelectReady is set', function() {
            $scope.uiSelectReady = undefined;
            $scope.searchUiSelectReady();
            expect($scope.uiSelectReady).toBeTruthy();
          });
        });

        describe('createNewTaxRate', function() {
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'createNewTaxRate').and.callThrough();
          });
          it('should call the controller method', function() {
            $scope.createNewTaxRate();
            expect(TaxRatesCtrl.createNewTaxRate).toHaveBeenCalled();
          });

          it('should add a new row to the list', function() {
            var length = $scope.companyTaxRatesList.length;
            $scope.createNewTaxRate();
            expect($scope.companyTaxRatesList.length - 1).toBe(length);
          });
        });

        describe('createNewTaxRatePayload', function() {
          var taxRate;
          var payload;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'createNewTaxRatePayload').and.callThrough();
            spyOn(TaxRatesCtrl, 'clearCustomErrors').and.callThrough();
            spyOn(TaxRatesCtrl, 'validateNewData').and.callThrough();
            spyOn(TaxRatesCtrl, 'parseNewTaxRatePayload').and.callThrough();
            spyOn(TaxRatesCtrl, 'createStationsPayload').and.callThrough();
            taxRate = companyTaxRatesJSON.taxRates[0];
            payload = {
              taxRateValue: '9.00',
              taxRateType: {
                taxRateType: 'Percentage'
              },
              startDate: '07/01/2015',
              endDate: '07/01/2016',
              taxTypeCode: {
                id: 8
              },
              companyTaxRateStations: [{
                id: 3
              }]
            };
            $scope.displayError = true;
          });
          it('should call the controller method', function() {
            $scope.createNewTaxRatePayload(taxRate);
            expect(TaxRatesCtrl.createNewTaxRatePayload).toHaveBeenCalledWith(taxRate);
          });
          it('should call the controller method and not set companyCurrencyId', function() {
            delete taxRate.companyCurrencyId;
            $scope.createNewTaxRatePayload(taxRate);
            expect(TaxRatesCtrl.createNewTaxRatePayload).toHaveBeenCalledWith(taxRate);
          });
          it('should call the controller method clearCustomErrors', function() {
            $scope.createNewTaxRatePayload(taxRate);
            expect(TaxRatesCtrl.clearCustomErrors).toHaveBeenCalled();
          });
          it('should call the controller method clearCustomErrors', function() {
            $scope.displayError = false;
            $scope.errorCustom = [];
            $scope.createNewTaxRatePayload(payload);
            expect(TaxRatesCtrl.createNewTaxRatePayload).toHaveBeenCalled();
          });
        });

        describe('$scope.isTaxRateTypePercentage', function() {
          beforeEach(function() {
            spyOn($scope, 'isTaxRateTypePercentage').and.callThrough();
          });
          it('should return false without taxRateType defined ', function() {
            var taxRate = {
              id: 1,
              taxRateType: {
                id: 1
              }
            };
            expect($scope.isTaxRateTypePercentage(taxRate)).toBeFalsy();
          });
          it('should return false without taxRateType defined ', function() {
            var taxRate = {
              id: 1,
            };
            expect($scope.isTaxRateTypePercentage(taxRate)).toBeTruthy();
          });
          it('should return true with taxRateType set to Percentage ', function() {
            var taxRate = {
              id: 1,
              taxRateType: {
                taxRateType: 'Percentage'
              }
            };
            expect($scope.isTaxRateTypePercentage(taxRate)).toBeTruthy();
          });
        });

        describe('$scope.cancelNewTaxRate', function() {
          var taxRate;
          beforeEach(function() {
            spyOn(TaxRatesCtrl, 'clearCustomErrors').and.callThrough();
            taxRate = companyTaxRatesJSON.taxRates[0];
          });
          it('should call the clearCustomErrors method', function() {
            $scope.cancelNewTaxRate(taxRate);
            expect(TaxRatesCtrl.clearCustomErrors).toHaveBeenCalled();
          });
          it('should add deleted to the object, which adds the red color to it', function() {
            $scope.cancelNewTaxRate(taxRate);
            expect(taxRate.deleted).toBe(true);
          });
          it('should add deleted to the object, which will hide it indefinitely', function() {
            $scope.cancelNewTaxRate(taxRate);
            expect(taxRate.action).toBe('deleted');
          });
        });

        describe('the error handler', function() {
          var mockError;
          beforeEach(function() {
            mockError = {
              status: 400,
              statusText: 'Bad Request',
              response: {
                field: 'bogan',
                code: '000'
              }
            };
            TaxRatesCtrl.errorHandler(mockError);
          });
          it('should set error data ', function() {
            expect($scope.errorResponse).toEqual(mockError);
          });
          it('should return false', function() {
            expect($scope.displayError).toBeTruthy();
          });
        });

      });
    });
  });
}); //Close for describe | Controller: TaxRatesCtrl
