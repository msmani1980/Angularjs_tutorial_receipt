'use strict';

describe('Controller: ManualEposItemsCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/cash-bag.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/master-item-list.json'));
  //
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/currency-globals.json'));
  beforeEach(module('served/daily-exchange-rate.json'));
  beforeEach(module('served/cash-bag-verifications.json'));
  beforeEach(module('served/cash-bag-items.json'));


  var ManualEposItemsCtrl;
  var manualEposFactory;
  var globalMenuService;
  var dateUtility;
  var controller;
  var scope;
  var cashBagId;
  var itemType;
  var location;

  var cashBagDeferred;
  var cashBagJSON;

  var itemTypesDeferred;
  var itemTypesJSON;

  var itemListDeferred;
  var itemListJSON;

  var storeInstanceDeferred;
  var storeInstanceJSON;

  var currencyListDeferred;
  var currencyListJSON;

  var cashBagItemListDeferred;
  var cashBagItemListJSON;

  var dailyExchangeRatesDeferred;
  var dailyExchangeRatesJSON;

  var cashBagVerificationDeferred;
  var cashBagVerificationJSON;

  var verifyDeferred;
  var unverifyDeferred;

  var createDeferred;
  var updateDeferred;

  var mockBaseCurrency;

  function createFormObject() {
    scope.manualItemForm = {
      $name: 'manualItemForm',
      $valid: true,
      $invalid: false,
      $pristine: false,
      $dirty: true,
      $setPristine: function (pristine) {
        this.$pristine = pristine;
      }
    };
  }

  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {

    inject(function (_servedCashBag_, _servedItemTypes_, _servedStoreInstance_, _servedMasterItemList_, _servedCashBagItems_,
                     _servedCurrencyGlobals_, _servedDailyExchangeRate_, _servedCashBagVerifications_) {
      cashBagJSON = _servedCashBag_;
      itemTypesJSON = _servedItemTypes_;
      storeInstanceJSON = _servedStoreInstance_;
      itemListJSON = _servedMasterItemList_;
      currencyListJSON = _servedCurrencyGlobals_;
      dailyExchangeRatesJSON = _servedDailyExchangeRate_;
      cashBagVerificationJSON = _servedCashBagVerifications_;
      cashBagItemListJSON = _servedCashBagItems_;
    });

    manualEposFactory = $injector.get('manualEposFactory');
    globalMenuService = $injector.get('globalMenuService');
    dateUtility = $injector.get('dateUtility');
    controller = $controller;
    location = $location;


    cashBagDeferred = $q.defer();
    cashBagDeferred.resolve(cashBagJSON);
    spyOn(manualEposFactory, 'getCashBag').and.returnValue(cashBagDeferred.promise);

    itemTypesDeferred = $q.defer();
    itemTypesDeferred.resolve(itemTypesJSON);
    spyOn(manualEposFactory, 'getItemTypes').and.returnValue(itemTypesDeferred.promise);

    storeInstanceDeferred = $q.defer();
    storeInstanceDeferred.resolve(storeInstanceJSON);
    spyOn(manualEposFactory, 'getStoreInstance').and.returnValue(storeInstanceDeferred.promise);

    itemListDeferred = $q.defer();
    itemListDeferred.resolve(itemListJSON);
    spyOn(manualEposFactory, 'getRetailItems').and.returnValue(itemListDeferred.promise);

    cashBagItemListDeferred = $q.defer();
    cashBagItemListDeferred.resolve(cashBagItemListJSON);
    spyOn(manualEposFactory, 'getCashBagItemList').and.returnValue(cashBagItemListDeferred.promise);

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

    createDeferred = $q.defer();
    createDeferred.resolve({});
    spyOn(manualEposFactory, 'createCashBagItem').and.returnValue(createDeferred.promise);

    updateDeferred = $q.defer();
    updateDeferred.resolve({});
    spyOn(manualEposFactory, 'updateCashBagItem').and.returnValue(updateDeferred.promise);

    cashBagId = 123;
    itemType = 'virtual';
    mockBaseCurrency = 8;
    spyOn(globalMenuService, 'getCompanyData').and.returnValue({ baseCurrencyId: mockBaseCurrency });

    spyOn(location, 'path').and.callThrough();

    scope = $rootScope.$new();
    ManualEposItemsCtrl = $controller('ManualEposItemsCtrl', {
      $scope: scope,
      $routeParams: {
        cashBagId: cashBagId,
        itemType: itemType
      }
    });

    createFormObject();
    scope.$digest();

  }));

  describe('init', function () {
    it('should get cash bag', function () {
      expect(manualEposFactory.getCashBag).toHaveBeenCalledWith(cashBagId);
      scope.$digest();
      expect(scope.cashBag).toBeDefined();
    });

    it('should get a list of item types', function () {
      expect(manualEposFactory.getItemTypes).toHaveBeenCalled();
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

    it('should attach the list of currencies to scope', function () {
      expect(scope.currencyList).toBeDefined();
    });

    it('should get a list of retail items, filtered by date and item type', function () {
      var formattedScheduleDate = dateUtility.formatDate(scope.storeInstance.scheduleDate, 'YYYY-MM-DD', 'YYYYMMDD');
      var expectedPayload = {
        startDate: formattedScheduleDate,
        endDate: formattedScheduleDate,
        itemTypeId: 2 // virtual
      };
      expect(manualEposFactory.getRetailItems).toHaveBeenCalledWith(expectedPayload);
      expect(scope.itemList.length).toEqual(itemListJSON.masterItems.length);
    });

    it('should get cash bag items', function () {
      expect(manualEposFactory.getCashBagItemList).toHaveBeenCalledWith(cashBagId);
    });

    it('should merge cash bag items with matching item types and item ids', function () {
      var expectedItem = jasmine.objectContaining({
        id: 76,
        quantity: 5
      });
      expect(scope.itemList[0]).toEqual(expectedItem);
    });

    it('should get daily exchange rate tied to the cash bag', function () {
      var dailyExchangeRateId = scope.cashBag.dailyExchangeRateId;
      expect(manualEposFactory.getDailyExchangeRate).toHaveBeenCalledWith(dailyExchangeRateId);
    });

    it('should check the cash bag verification', function () {
      expect(manualEposFactory.checkCashBagVerification).toHaveBeenCalled();
      expect(scope.isVerified).toBeDefined();
      expect(scope.verifiedInfo.verifiedBy).toEqual('John Adams');
      expect(scope.verifiedInfo.verifiedTimestamp).toEqual('05/05/2016 at 06:53');
    });

    it('should set the base currency', function () {
      scope.$digest();
      expect(scope.baseCurrency).toBeDefined();
      expect(scope.baseCurrency.id).toEqual(mockBaseCurrency);
    });
  });

  describe('calculate totals', function () {
    it('should calculate total amount based on price * qty', function () {
      var mockItem = {
        amount: '2.50',
        quantity: '2',
        exchangeRate: {
          bankExchangeRate: 2
        }
      };

      scope.calculateTotals(mockItem);
      expect(mockItem.totalValue).toEqual('5.00');
    });

    describe('converted total', function () {
      it('should use bank exchange rate for bank amounts', function () {
        var mockItemWithExchangeRate = {
          amount: '1.00',
          quantity: '1',
          exchangeRate: {
            bankExchangeRate: 0.50,
            paperExchangeRate: null,
            coinExchangeRate: null
          }
        };
        scope.calculateTotals(mockItemWithExchangeRate);
        expect(mockItemWithExchangeRate.convertedTotal).toEqual('2.00');
      });

      it('should use paper and coin exchange rate for paper/coin amounts', function () {
        var mockItemWithExchangeRate = {
          amount: '1.50',
          quantity: '1',
          exchangeRate: {
            bankExchangeRate: null,
            paperExchangeRate: 0.25,
            coinExchangeRate: 0.5
          }
        };
        scope.calculateTotals(mockItemWithExchangeRate);
        expect(mockItemWithExchangeRate.convertedTotal).toEqual('4.10');
      });
    });
  });

  describe('sum all amounts', function () {
    it('should return sum of all converted totals', function () {
      scope.itemList = [{
        convertedTotal: '2.50'
      }, {
        convertedTotal: '3.50'
      }];
      expect(scope.sumAllItems()).toEqual('6.00');
    });
  });

  describe('switching amounts', function () {
    it('should convert all amounts to the new currency', function () {
      scope.dailyExchangeRates = [{
        retailCompanyCurrencyId: 1,
        bankExchangeRate: 0.25
      }, {
        retailCompanyCurrencyId: 2,
        bankExchangeRate: 2
      }];

      scope.itemList = [{
        currencyId: 1,
        amount: '2.00'
      }];

      scope.selectedCurrency = {currency: {id: 2}};
      scope.updateAmountsWithSelectedCurrency();
      expect(scope.itemList[0].amount).toEqual('16.00');
    });
  });

  describe('verify and unverify', function () {
    it('should call verify function and update scope var', function () {
      scope.isVerified = false;
      scope.verifiedInfo = null;
      scope.verify();
      expect(manualEposFactory.verifyCashBag).toHaveBeenCalledWith(cashBagId, 'VIRT_ITEM');
      scope.$digest();
    });

    it('should call unverify function and update scope var', function () {
      scope.isVerified = true;
      scope.verifiedInfo = null;
      scope.unverify();
      expect(manualEposFactory.unverifyCashBag).toHaveBeenCalledWith(cashBagId, 'VIRT_ITEM');
      scope.$digest();
    });
  });

  describe('saving cash bag cash', function () {
    var expectedPayload;
    beforeEach(function () {
      scope.selectedCurrency = { currency: { id: 1 } };
      scope.mainItemType = { id: 2 };
      scope.itemList = [{
        amount: '1.00',
        quantity: 4,
        convertedTotal: '2.50',
        itemMasterId: 3
      }];

      expectedPayload = {
        amount: 1,
        quantity: 4,
        convertedAmount: 2.5,
        itemTypeId: 2,
        itemMasterId: 3,
        currencyId: 1
      };
    });

    it('should check form validity before saving', function () {
      scope.manualItemForm.$valid = false;
      scope.save();
      expect(scope.displayError).toEqual(true);
    });

    it('should call create for new entries', function () {
      scope.save();
      expect(manualEposFactory.createCashBagItem).toHaveBeenCalledWith(cashBagId, expectedPayload);
    });

    it('should call update for existing entries', function () {
      var itemId = 4;
      scope.itemList[0].id = itemId;
      scope.save();
      expect(manualEposFactory.updateCashBagItem).toHaveBeenCalledWith(cashBagId, itemId, expectedPayload);
    });

    it('should redirect page if shouldExit is true', function () {
      scope.shouldExit = true;
      scope.save();
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('manual-epos-dashboard/' + cashBagId);
    });

  });

});
