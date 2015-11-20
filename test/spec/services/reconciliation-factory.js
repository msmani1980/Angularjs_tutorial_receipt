'use strict';

describe('Factory: reconciliationFactory', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));
  beforeEach(module('served/store.json'));
  beforeEach(module('served/station.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/payment-report.json'));

  var reconciliationFactory;

  var storeInstanceService;
  var getStoreInstanceDeferred;
  var storeInstanceJSON;

  var storesService;
  var getStoreDeferred;
  var getStoreJSON;

  var reconciliationService;
  var getStockTotalsDeferred;
  var getStockTotalsJSON;

  var getPaymentReportDeferred;
  var getPaymentReportJSON;

  var stationsService;
  var getStationDeferred;
  var getStationJSON;

  var itemTypesService;
  var getItemTypesListDeferred;
  var getItemTypesListJSON;

  var getCHCashBagRevenueDeferred;
  var getCHCreditCardRevenueDeferred;
  var getCHDiscountRevenueDeferred;

  var getEPOSCashBagRevenueDeferred;
  var getEPOSCreditCardRevenueDeferred;
  var getEPOSDiscountRevenueDeferred;

  var scope;

  beforeEach(inject(function (_reconciliationFactory_, $injector, $q, $rootScope) {
    inject(function (_servedStoreInstance_, _servedStore_, _servedStation_, _servedItemTypes_, _servedPaymentReport_) {
      storeInstanceJSON = _servedStoreInstance_;
      getStoreJSON = _servedStore_;
      getStationJSON = _servedStation_;
      getStockTotalsJSON = {};
      getItemTypesListJSON = _servedItemTypes_;
      getPaymentReportJSON = _servedPaymentReport_;
    });

    storeInstanceService = $injector.get('storeInstanceService');
    storesService = $injector.get('storesService');
    stationsService = $injector.get('stationsService');
    reconciliationService = $injector.get('reconciliationService');
    itemTypesService = $injector.get('itemTypesService');

    getStoreInstanceDeferred = $q.defer();
    getStoreInstanceDeferred.resolve(storeInstanceJSON);
    spyOn(storeInstanceService, 'getStoreInstance').and.returnValue(getStoreInstanceDeferred.promise);

    getStoreDeferred = $q.defer();
    getStoreDeferred.resolve(getStoreJSON);
    spyOn(storesService, 'getStore').and.returnValue(getStoreDeferred.promise);

    getStationDeferred = $q.defer();
    getStationDeferred.resolve(getStationJSON);
    spyOn(stationsService, 'getStation').and.returnValue(getStationDeferred.promise);

    getStockTotalsDeferred = $q.defer();
    getStockTotalsDeferred.resolve(getStockTotalsJSON);
    spyOn(reconciliationService, 'getStockTotals').and.returnValue(getStockTotalsDeferred.promise);

    getPaymentReportDeferred = $q.defer();
    getPaymentReportDeferred.resolve(getPaymentReportJSON);
    spyOn(reconciliationService, 'getPaymentReport').and.returnValue(getPaymentReportDeferred.promise);

    spyOn(reconciliationService, 'getPromotionTotals').and.returnValue(getStockTotalsDeferred.promise);

    getItemTypesListDeferred = $q.defer();
    getItemTypesListDeferred.resolve(getItemTypesListJSON);
    spyOn(itemTypesService, 'getItemTypesList').and.returnValue(getItemTypesListDeferred.promise);

    getCHCashBagRevenueDeferred = $q.defer();
    getCHCashBagRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getCHCashBagRevenue').and.returnValue(getCHCashBagRevenueDeferred.promise);

    getCHCreditCardRevenueDeferred = $q.defer();
    getCHCreditCardRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getCHCreditCardRevenue').and.returnValue(getCHCreditCardRevenueDeferred.promise);

    getCHDiscountRevenueDeferred = $q.defer();
    getCHDiscountRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getCHDiscountRevenue').and.returnValue(getCHDiscountRevenueDeferred.promise);


    getEPOSCashBagRevenueDeferred = $q.defer();
    getEPOSCashBagRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getEPOSCashBagRevenue').and.returnValue(getEPOSCashBagRevenueDeferred.promise);

    getEPOSCreditCardRevenueDeferred = $q.defer();
    getEPOSCreditCardRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getEPOSCreditCardRevenue').and.returnValue(getEPOSCreditCardRevenueDeferred.promise);

    getEPOSDiscountRevenueDeferred = $q.defer();
    getEPOSDiscountRevenueDeferred.resolve(200, {});
    spyOn(reconciliationService, 'getEPOSDiscountRevenue').and.returnValue(getEPOSDiscountRevenueDeferred.promise);


    scope = $rootScope.$new();
    reconciliationFactory = _reconciliationFactory_;
  }));

  it('should be defined', function () {
    expect(!!reconciliationFactory).toBe(true);
  });

  describe('API calls', function () {
    it('should call storeInstanceService on getStoreInstance', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStoreInstanceDetails(storeInstanceId);
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(storeInstanceId);
    });

    it('should call storesService on getStore', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStoreInstanceDetails(storeInstanceId);
      scope.$digest();
      expect(storesService.getStore).toHaveBeenCalledWith(storeInstanceJSON.storeId);
    });

    it('should call storesService on getStore', function () {
      reconciliationFactory.getItemTypesList();
      expect(itemTypesService.getItemTypesList).toHaveBeenCalled();
    });

    it('should call stationsService on getStation', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStoreInstanceDetails(storeInstanceId);
      scope.$digest();
      expect(stationsService.getStation).toHaveBeenCalledWith(storeInstanceJSON.cateringStationId);
    });

    it('should call reconciliationService on getStockTotals', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStockTotals(storeInstanceId);
      scope.$digest();
      expect(reconciliationService.getStockTotals).toHaveBeenCalledWith(storeInstanceId);
    });

    it('should call reconciliationService on getPromotionTotals', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getPromotionTotals(storeInstanceId);
      scope.$digest();
      expect(reconciliationService.getPromotionTotals).toHaveBeenCalledWith(storeInstanceId);
    });

    it('should call reconciliationService on getStockTotals', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      reconciliationFactory.getStockTotals(storeInstanceId);
      scope.$digest();
      expect(reconciliationService.getStockTotals).toHaveBeenCalledWith(storeInstanceId);
    });

    describe('getCHRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      beforeEach(function () {
        reconciliationFactory.getCHRevenue(storeInstanceId);
      });

      it('should call getCHCashBagRevenue on getCHRevenue', function () {
        expect(reconciliationService.getCHCashBagRevenue).toHaveBeenCalledWith(storeInstanceId);
      });
      it('should call getCHCreditCardRevenue on getCHRevenue', function () {
        expect(reconciliationService.getCHCreditCardRevenue).toHaveBeenCalledWith(storeInstanceId);
      });
      it('should call getCHDiscountRevenue on getCHRevenue', function () {
        expect(reconciliationService.getCHDiscountRevenue).toHaveBeenCalledWith(storeInstanceId);
      });

    });

    describe('getEPOSRevenue', function () {
      var storeInstanceId = 'fakeStoreInstanceId';
      beforeEach(function () {
        reconciliationFactory.getEPOSRevenue(storeInstanceId);
      });

      it('should call getEPOSCashBagRevenue on getEPOSRevenue', function () {
        expect(reconciliationService.getEPOSCashBagRevenue).toHaveBeenCalledWith(storeInstanceId);
      });
      it('should call getEPOSCreditCardRevenue on getEPOSRevenue', function () {
        expect(reconciliationService.getEPOSCreditCardRevenue).toHaveBeenCalledWith(storeInstanceId);
      });
      it('should call getEPOSDiscountRevenue on getEPOSRevenue', function () {
        expect(reconciliationService.getEPOSDiscountRevenue).toHaveBeenCalledWith(storeInstanceId);
      });

    });

  });

});
