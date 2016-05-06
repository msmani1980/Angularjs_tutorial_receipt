'use strict';

fdescribe('Controller: ManualEposCashCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/currency-globals.json'));
  beforeEach(module('served/daily-exchange-rate.json'));
  beforeEach(module('served/cash-bag-verifications.json'));
  beforeEach(module('served/cash-bag-cash.json'));


  var ManualEposCashCtrl;
  var manualEposFactory;
  var globalMenuService;
  var dateUtility;
  var controller;
  var scope;
  var cashBagId;

  var cashBagDeferred;
  var cashBagJSON;
  var storeInstanceDeferred;
  var storeInstanceJSON;

  var currencyListDeferred;
  var currencyListJSON;

  var cashBagCashListDeferred;
  var cashBagCashListJSON;

  var dailyExchangeRatesDeferred;
  var dailyExchangeRatesJSON;

  var cashBagVerificationDeferred;
  var cashBagVerificationJSON;

  var mockBaseCurrency;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {

    inject(function (_servedCashBag_, _servedStoreInstance_, _servedCurrencyGlobals_, _servedDailyExchangeRate_,
                     _servedCashBagVerifications_, _servedCashBagCash_) {
      cashBagJSON = _servedCashBag_;
      storeInstanceJSON = _servedStoreInstance_;
      currencyListJSON = _servedCurrencyGlobals_;
      dailyExchangeRatesJSON = _servedDailyExchangeRate_;
      cashBagVerificationJSON = _servedCashBagVerifications_;
      cashBagCashListJSON = _servedCashBagCash_;
    });

    manualEposFactory = $injector.get('manualEposFactory');
    globalMenuService = $injector.get('globalMenuService');
    dateUtility = $injector.get('dateUtility');
    controller = $controller;

    cashBagDeferred = $q.defer();
    cashBagDeferred.resolve(cashBagJSON);
    spyOn(manualEposFactory, 'getCashBag').and.returnValue(cashBagDeferred.promise);

    storeInstanceDeferred = $q.defer();
    storeInstanceDeferred.resolve(storeInstanceJSON);
    spyOn(manualEposFactory, 'getStoreInstance').and.returnValue(storeInstanceDeferred.promise);

    currencyListDeferred = $q.defer();
    currencyListDeferred.resolve(currencyListJSON);
    spyOn(manualEposFactory, 'getCurrencyList').and.returnValue(currencyListDeferred.promise);

    dailyExchangeRatesDeferred = $q.defer();
    dailyExchangeRatesDeferred.resolve(dailyExchangeRatesJSON);
    spyOn(manualEposFactory, 'getDailyExchangeRate').and.returnValue(dailyExchangeRatesDeferred.promise);

    cashBagVerificationDeferred = $q.defer();
    cashBagVerificationDeferred.resolve(cashBagVerificationJSON.response[0]);
    spyOn(manualEposFactory, 'checkCashBagVerification').and.returnValue(cashBagVerificationDeferred.promise);

    cashBagCashListDeferred = $q.defer();
    cashBagCashListDeferred.resolve(cashBagCashListJSON);
    spyOn(manualEposFactory, 'getCashBagCashList').and.returnValue(cashBagCashListDeferred.promise);

    cashBagId = 123;
    mockBaseCurrency = 23;
    spyOn(globalMenuService, 'getCompanyData').and.returnValue({ baseCurrencyId: mockBaseCurrency });


    scope = $rootScope.$new();
    ManualEposCashCtrl = $controller('ManualEposCashCtrl', {
      $scope: scope,
      $routeParams: {
        cashBagId: cashBagId
      }
    });
    scope.$digest();

  }));

  describe('init', function () {
    it('should get cash bag', function () {
      expect(manualEposFactory.getCashBag).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.cashBag).toBeDefined();
    });

    it('should get the store instance tied to the cash bag', function () {
      expect(manualEposFactory.getStoreInstance).toHaveBeenCalled();
      expect(scope.storeInstance).toBeDefined();
    });

    it('should get a list of currencies', function () {
      var formattedScheduleDate = dateUtility.formatDate(scope.storeInstance.scheduleDate, 'YYYY-MM-DD', 'YYYYMMDD');
      var expectedPayload = { startDate: formattedScheduleDate, endDate: formattedScheduleDate };
      expect(manualEposFactory.getCurrencyList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should get cash bag cash', function () {
      expect(manualEposFactory.getCashBagCashList).toHaveBeenCalledWith(cashBagId, {});
    });

    it('should get daily exchange rate', function () {
      var dailyExchangeRateId = scope.cashBag.dailyExchangeRateId;
      expect(manualEposFactory.getDailyExchangeRate).toHaveBeenCalledWith(dailyExchangeRateId);
    });

    it('should check the cash bag verification', function () {
      expect(manualEposFactory.checkCashBagVerification).toHaveBeenCalled();
      expect(scope.isVerified).toBeDefined();
    });

    it('should set the base currency', function () {
      scope.$digest();
      expect(scope.baseCurrency).toBeDefined();
      expect(scope.baseCurrency.currencyId).toEqual(mockBaseCurrency);
    });

    it('should attach a list of cash bag currencies to scope', function () {
      expect(scope.currencyList).toBeDefined();
      var expectedCurrencyObject = jasmine.objectContaining({
        currencyId: 8,
        currencyCode: 'GBP',
        amount: 12,
        convertedAmount: 12
      });
      expect(scope.currencyList[0]).toEqual(expectedCurrencyObject);
    });
  });

  describe('convert cash amount', function () {
    it('should use bank exchange rate for bank amounts', function () {

    });

    it('should use paper and coin exchange rate for paper/coin amounts', function () {

    });
  });

  describe('sum converted amounts', function () {
    it('should return the sum of all converted amounts', function () {
      scope.currencyList = [{
        convertedAmount: '1.00'
      }, {
        convertedAmount: '2.50'
      }, {
        convertedAmount: '5.00001'
      }];

      var sum = scope.sumConvertedAmounts();
      expect(sum).toEqual('8.50');
    });
  });

  describe('verify and unverify', function () {

  });

  describe('saving cash bag cash', function () {
    it('should call create for new entries', function () {

    });

    it('should call update for existing entries', function () {

    });

  });


});
