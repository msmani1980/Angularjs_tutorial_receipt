'use strict';
/*global $:false */

describe('Controller: CurrencyEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/company.json',
    'served/currencies.json',
    'served/currency.json',
    'served/company-currency-globals.json'
  ));

  var CurrencyEditCtrl,
    scope,
    dateUtility,
    currencyFactory,
    companyJSON,
    currenciesJSON,
    currencyJSON,
    masterCurrenciesJSON,
    getCompanyGlobalCurrenciesDeferred,
    getDetailedCompanyCurrenciesDeferred,
    getCompanyDeferred,
    createCompanyDeffered,
    deleteCompanyDeffered;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $httpBackend, $controller, $rootScope, _dateUtility_, _currencyFactory_, _servedCompany_, _servedCurrencies_, _servedCurrency_, _servedCompanyCurrencyGlobals_) {
    scope = $rootScope.$new();

    dateUtility = _dateUtility_;
    currencyFactory = _currencyFactory_;
    companyJSON = _servedCompany_;
    currenciesJSON = _servedCurrencies_;
    currencyJSON = _servedCurrency_;
    masterCurrenciesJSON = _servedCompanyCurrencyGlobals_;

    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesDeferred.resolve(masterCurrenciesJSON);
    getDetailedCompanyCurrenciesDeferred = $q.defer();
    getDetailedCompanyCurrenciesDeferred.resolve(currenciesJSON);
    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyJSON);
    createCompanyDeffered = $q.defer();
    createCompanyDeffered.resolve({id:1});
    deleteCompanyDeffered = $q.defer();
    deleteCompanyDeffered.resolve({});

    spyOn(currencyFactory, 'getCompanyGlobalCurrencies').and.returnValue(getCompanyGlobalCurrenciesDeferred.promise);
    spyOn(currencyFactory, 'getDetailedCompanyCurrencies').and.returnValue(getDetailedCompanyCurrenciesDeferred.promise);
    spyOn(currencyFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);
    spyOn(currencyFactory, 'deleteDetailedCompanyCurrency').and.returnValue(deleteCompanyDeffered.promise);
    spyOn(currencyFactory, 'createDetailedCompanyCurrency').and.callFake(function () { return $.Deferred().resolve(createCompanyDeffered);});
    spyOn(currencyFactory, 'updateDetailedCompanyCurrency').and.callFake(function () { return $.Deferred().resolve(currencyJSON);});

    $httpBackend.whenGET(/companies/).respond(companyJSON);

    CurrencyEditCtrl = $controller('CurrencyEditCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Retail Company Currency & Denomination Setup');
  });

  it('should get the company global currencies called', function () {
    expect(currencyFactory.getCompanyGlobalCurrencies).toHaveBeenCalled();
  });

  it('should get company global currencies', function () {
    CurrencyEditCtrl.getCompanyGlobalCurrencies();
    expect(currencyFactory.getCompanyGlobalCurrencies().then(function (globalCurrencies) {
      expect(globalCurrencies.response.length).toBeGreaterThan(0);
    }));
  });

  it('should create denomination map', function () {
    scope.globalCurrencyList = currenciesJSON;
    CurrencyEditCtrl.getDenominations();
    expect(1 in scope.currencyDenominations).toBe(true);
  });

  it('should get the detailed company currencies called', function () {
    expect(currencyFactory.getDetailedCompanyCurrencies).toHaveBeenCalled();
  });

  it('should get company base currency', function () {
    scope.globalCurrencyList = currenciesJSON;
    CurrencyEditCtrl.getCompanyBaseCurrency();
    expect(scope.companyBaseCurrency.code).toBe('EUR');
  });

  it('should delete detailed currency be called', function () {
    scope.currencyToDelete = {id: 1};
    scope.companyCurrencyList = [{id: 1}];

    scope.deleteDetailedCompanyCurrency();
    expect(currencyFactory.deleteDetailedCompanyCurrency).toHaveBeenCalled();
  });

  it('should clear search model and make get detailed company currencies', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(currencyFactory.getDetailedCompanyCurrencies).toHaveBeenCalledWith({
      currencyId: null,
      startDate: null,
      endDate: null
    });
  });

  it('should clear search model and make get detailed company currencies', function () {
    scope.search = {
      startDate: '10/05/1979'
    };
    scope.searchDetailedCompanyCurrencies();
    expect(currencyFactory.getDetailedCompanyCurrencies).toHaveBeenCalledWith({
      currencyId: null,
      startDate: '19791005',
      endDate: null
    });
  });

  it('should call create currency in case currency is a new one', function () {
    var currency = angular.copy(currencyJSON);
    currency.isNew = true;
    currency.selectedDenominations = [];

    scope.saveDetailedCompanyCurrency(1, currency);
    expect(currencyFactory.createDetailedCompanyCurrency).toHaveBeenCalled();
  });

  it('should call update currency in case currency is not a new one', function () {
    var currency = angular.copy(currencyJSON);
    currency.isNew = false;
    currency.selectedDenominations = [];

    scope.saveDetailedCompanyCurrency(1, currency);
    expect(currencyFactory.updateDetailedCompanyCurrency).toHaveBeenCalled();
  });

  it('should add new currency to detailed company currency list', function () {
    scope.companyCurrencyList = [];
    var items = scope.companyCurrencyList.length;

    scope.addDetailedCompanyCurrencies();

    expect(scope.companyCurrencyList.length).toBe(items + 1);
  });

  describe('currency should be', function () {
    describe('read only if', function () {
      it('start date is in the past ', function () {
        var currency = angular.copy(currencyJSON);
        currency.startDate = '01/01/2014';

        expect(scope.isCurrencyReadOnly(currency)).toBe(true);
      });
      it('start date is today ', function () {
        var currency = angular.copy(currencyJSON);
        currency.startDate = dateUtility.nowFormatted();

        expect(scope.isCurrencyReadOnly(currency)).toBe(true);
      });
    });
    describe('not be read only if', function () {
      it('start date is undefined ', function () {
        var currency = angular.copy(currencyJSON);
        currency.startDate = '';

        expect(scope.isCurrencyReadOnly(currency)).toBe(false);
      });

      it('start date is in the future', function () {
        var currency = angular.copy(currencyJSON);
        currency.startDate = '01/01/2050';

        expect(scope.isCurrencyReadOnly(currency)).toBe(false);
      });
      it('is a new currency', function () {
        var currency = angular.copy(currencyJSON);
        currency.isNew = true;

        expect(scope.isCurrencyReadOnly(currency)).toBe(false);
      });
    });
  });

  describe('currency should be', function () {
    describe('partially read only if', function () {

      it('end date is in the past', function () {
        var currency = angular.copy(currencyJSON);
        currency.endDate = '01/01/2014';

        expect(scope.isCurrencyPartialReadOnly(currency)).toBe(true);
      });
    });
    describe('not be partially read only if', function () {
      it('end date is undefined ', function () {
        var currency = angular.copy(currencyJSON);
        currency.endDate = '';

        expect(scope.isCurrencyPartialReadOnly(currency)).toBe(false);
      });
      it('end date is in the future ', function () {
        var currency = angular.copy(currencyJSON);
        currency.endDate = '01/01/2050';

        expect(scope.isCurrencyPartialReadOnly(currency)).toBe(false);
      });
      it('end date is today ', function () {
        var currency = angular.copy(currencyJSON);
        currency.endDate = dateUtility.nowFormatted();

        expect(scope.isCurrencyPartialReadOnly(currency)).toBe(false);
      });
      it('is a new currency', function () {
        var currency = angular.copy(currencyJSON);
        currency.isNew = true;

        expect(scope.isCurrencyPartialReadOnly(currency)).toBe(false);
      });
    });
  });

});
