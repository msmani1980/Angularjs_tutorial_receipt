'use strict';

describe('Controller: ManualEposPromotionCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/currency-globals.json'));
  beforeEach(module('served/daily-exchange-rate.json'));
  beforeEach(module('served/cash-bag-verifications.json'));
  beforeEach(module('served/manual-promotions-list.json'));
  beforeEach(module('served/promotion-list.json'));

  var ManualEposPromotionCtrl;
  var manualEposFactory;
  var globalMenuService;
  var dateUtility;
  var controller;
  var scope;
  var cashBagId;
  var location;
  var companyId;

  var cashBagDeferred;
  var cashBagJSON;

  var storeInstanceDeferred;
  var storeInstanceJSON;

  var currencyListDeferred;
  var currencyListJSON;

  var dailyExchangeRatesDeferred;
  var dailyExchangeRatesJSON;

  var cashBagVerificationDeferred;
  var cashBagVerificationJSON;

  var promotionListDeferred;
  var promotionListJSON;

  var cmpPromotionListDeferred;
  var cmpPromotionListJSON;

  var verifyDeferred;
  var unverifyDeferred;

  var createDeferred;
  var updateDeferred;

  var mockBaseCurrency;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {

    inject(function (_servedCashBag_, _servedStoreInstance_, _servedCurrencyGlobals_, _servedDailyExchangeRate_,
	                 _servedCashBagVerifications_, _servedManualPromotionsList_, _servedPromotionList_) {
      cashBagJSON = _servedCashBag_;
      storeInstanceJSON = _servedStoreInstance_;
      currencyListJSON = _servedCurrencyGlobals_;
      dailyExchangeRatesJSON = _servedDailyExchangeRate_;
      cashBagVerificationJSON = _servedCashBagVerifications_;
      promotionListJSON = _servedManualPromotionsList_;
      cmpPromotionListJSON = _servedPromotionList_;
    });

    manualEposFactory = $injector.get('manualEposFactory');
    globalMenuService = $injector.get('globalMenuService');
    dateUtility = $injector.get('dateUtility');
    controller = $controller;
    location = $location;
    companyId = 403;

    promotionListDeferred = $q.defer();
    promotionListDeferred.resolve(promotionListJSON);
    spyOn(manualEposFactory, 'getCashBagPromotionList').and.returnValue(promotionListDeferred.promise);

    cmpPromotionListDeferred = $q.defer();
    cmpPromotionListDeferred.resolve(cmpPromotionListJSON);
    spyOn(manualEposFactory, 'getCompanyPromotionsList').and.returnValue(cmpPromotionListDeferred.promise);

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

    verifyDeferred = $q.defer();
    verifyDeferred.resolve(cashBagVerificationJSON.response[0]);
    spyOn(manualEposFactory, 'verifyCashBag').and.returnValue(verifyDeferred.promise);

    unverifyDeferred = $q.defer();
    unverifyDeferred.resolve(cashBagVerificationJSON.response[1]);
    spyOn(manualEposFactory, 'unverifyCashBag').and.returnValue(unverifyDeferred.promise);

    mockBaseCurrency = 23;
    spyOn(globalMenuService, 'getCompanyData').and.returnValue({ baseCurrencyId: mockBaseCurrency });

    createDeferred = $q.defer();
    createDeferred.resolve({});
    spyOn(manualEposFactory, 'createManualEposPromotion').and.returnValue(createDeferred.promise);

    updateDeferred = $q.defer();
    updateDeferred.resolve({});
    spyOn(manualEposFactory, 'updateManualEposPromotion').and.returnValue(updateDeferred.promise);

    spyOn(location, 'path').and.callThrough();
    scope = $rootScope.$new();

    ManualEposPromotionCtrl = $controller('ManualEposPromotionCtrl', {
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
      var expectedPayload = { startDate: formattedScheduleDate, endDate: formattedScheduleDate, isOperatedCurrency: true };
      expect(manualEposFactory.getCurrencyList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should get cash bag promotions', function () {
      expect(manualEposFactory.getCashBagPromotionList).toHaveBeenCalledWith(cashBagId);
    });

    it('should get company promotions', function () {
      expect(manualEposFactory.getCompanyPromotionsList).toHaveBeenCalled();
    });

    it('should get daily exchange rate', function () {
      var dailyExchangeRateId = scope.cashBag.dailyExchangeRateId;
      expect(manualEposFactory.getDailyExchangeRate).toHaveBeenCalledWith(dailyExchangeRateId);
    });

    it('should check the cash bag verification', function () {
      expect(manualEposFactory.checkCashBagVerification).toHaveBeenCalled();
      expect(scope.isVerified).toBeDefined();
      expect(scope.verifiedInfo.verifiedBy).toEqual('Joe Williams');
      expect(scope.verifiedInfo.verifiedTimestamp).toEqual('05/05/2016 at 06:53:11');
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
        code: 'GBP',
        name: 'British Pound',
        exchangeRate: { id: 503,
          dailyExchangeRateId: 137,
          retailCompanyCurrencyId: 8,
          bankExchangeRate: null,
          coinExchangeRate: '1.0000',
          paperExchangeRate: '1.0000'
        }
	  });
	  expect(scope.currencyList[0]).toEqual(expectedCurrencyObject);
    });
  });

  describe('convert cash amount', function () {
    it('should use bank exchange rate for bank amounts', function () {
      var mockCurrencyObject = {
        amount: 1.00,
        currentCurrencyAmount: 1.00,
        quantity: 1,
        exchangeRate: {
          bankExchangeRate: 0.50,
          paperExchangeRate: null,
           coinExchangeRate: null
        }
      };
      var convertedAmountObject = scope.onChangePriceOrQty(mockCurrencyObject);
      expect(convertedAmountObject.baseCurrencyAmount).toEqual('1.00');
    });

    it('should use paper and coin exchange rate for paper/coin amounts', function () {
      var mockCurrencyObject = {
        amount: 1.50,
        currentCurrencyAmount: 1.50,
        quantity: 1,
        exchangeRate: {
          bankExchangeRate: null,
          paperExchangeRate: 0.25,
          coinExchangeRate: 0.5
        }
      };
      var convertedAmountObject = scope.onChangePriceOrQty(mockCurrencyObject);
      expect(convertedAmountObject.baseCurrencyAmount).toEqual('1.50');
    });

    it('should default to 0 if amount is empty', function () {
      var mockCurrencyObject = {
        amount: '',
        currentCurrencyAmount: '',
        quantity: 1,
        exchangeRate: {
          bankExchangeRate: 1.00
        }
      };
      var convertedAmountObject = scope.onChangePriceOrQty(mockCurrencyObject);
      expect(convertedAmountObject.baseCurrencyAmount).toEqual('0.00');
    });
  });

  describe('sum converted amounts', function () {
    it('should return the sum of all converted amounts', function () {
      scope.promotionList = [{
        baseCurrencyAmount: '1.00'
        }, {
        baseCurrencyAmount: '3.50'
        }, {
        baseCurrencyAmount: '5.00001'
      }];
      var sum = scope.sumAmounts();
      expect(sum).toEqual('9.50');
    });
  });

  describe('unverify', function () {
    it('should call unverify function and update scope var', function () {
      scope.isVerified = true;
      scope.verifiedInfo = null;
      scope.unverify();
      expect(manualEposFactory.unverifyCashBag).toHaveBeenCalledWith(95, 'PROMO');
      scope.$digest();
      expect(scope.isVerified).toEqual(false);
    });
  });

  describe('saving cash bag promotion', function () {
    var expectedPayload;
    beforeEach(function () {
      scope.companyId = 403;
      scope.promotionList = [{
        cashbagId: 1332,
        promotionId: 1,
        currencyId: 3,
        amount: 1.00,
        quantity: 3,
        baseCurrencyAmount: 2.50
      }];

      expectedPayload = {
        cashbagId: 1332,
        promotionId: 1,
        currencyId: 3,
        amount: 1.00,
        quantity: 3,
        totalConvertedAmount: 2.50,
        companyId: 403
      };
    });

    it('should call create for new entries', function () {
      scope.save();
      expect(manualEposFactory.createManualEposPromotion).toHaveBeenCalledWith(cashBagId, expectedPayload);
    });

    it('should call update for existing entries', function () {
      var promotionId = 74;
      scope.promotionList[0].id = promotionId;
      expectedPayload.id = promotionId;
      scope.save();
      expect(manualEposFactory.updateManualEposPromotion).toHaveBeenCalledWith(cashBagId,  promotionId, expectedPayload);
    });

    it('should redirect page if shouldExit is true', function () {
      scope.shouldExit = true;
      scope.save();
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('manual-epos-dashboard/' + cashBagId);
    });

    it('should save data before verify function', function () {
        scope.isVerified = false;
        scope.verifiedInfo = null;
        scope.verify();
        expect(manualEposFactory.createManualEposPromotion).toHaveBeenCalledWith(cashBagId, expectedPayload);
      });
    
  });
});
