'use strict';

describe('Factory: receiptsFactory', function () {

  beforeEach(module('ts5App'));

  var receiptsFactory,
      globalMenuService,
      stationsService,
      countriesService,
      receiptRulesService,
      currenciesService,
      rootScope,
      scope;

  beforeEach(inject(function ($rootScope, _receiptsFactory_,_receiptRulesService_, _globalMenuService_, _stationsService_, _countriesService_, _currenciesService_) {
	receiptRulesService = _receiptRulesService_;
	globalMenuService = _globalMenuService_;
	stationsService = _stationsService_;
	countriesService = _countriesService_;
	currenciesService = _currenciesService_;
	
    spyOn(receiptRulesService, 'getReceiptRules');
    spyOn(receiptRulesService, 'createReceiptRule');
    spyOn(receiptRulesService, 'updateReceiptRule');
    spyOn(receiptRulesService, 'deleteReceiptRule');
    spyOn(receiptRulesService, 'getReceiptRule');
    spyOn(countriesService, 'getCountriesList');
    spyOn(stationsService, 'getGlobalStationList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    receiptsFactory = _receiptsFactory_;
  }));

  it('should be defined', function () {
    expect(!!receiptsFactory).toBe(true);
  });

  describe('stationsService API', function () {
    it('should call stationsService on getCompanyGlobalStationList', function () {
    	receiptsFactory.getCompanyGlobalStationList();
        expect(stationsService.getGlobalStationList).toHaveBeenCalled();
    });
  });
  
  describe('currenciesService API', function () {
    it('should call currenciesService on CountrieList', function () {
    	receiptsFactory.getCountriesList();
        expect(countriesService.getCountriesList).toHaveBeenCalled();
    });
   });
  
  describe('receiptsFactory API', function () {
      it('should call receiptRulesService on getReceiptRules', function () {
        var mockPayload = {fakeKey: 'fakeValue'};
        receiptsFactory.getReceiptRules(mockPayload);
        expect(receiptRulesService.getReceiptRules).toHaveBeenCalledWith(mockPayload);
      });

      it('should call receiptRulesService on getReceiptRule', function () {
    	receiptsFactory.getReceiptRule(123);
        expect(receiptRulesService.getReceiptRule).toHaveBeenCalledWith(123);
      });

      it('should call receiptRulesService on createReceiptRule', function () {
    	receiptsFactory.createReceiptRule({});
        expect(receiptRulesService.createReceiptRule).toHaveBeenCalled();
      });

      it('should call receiptRulesService on updateReceiptRule', function () {
    	receiptsFactory.updateReceiptRule({});
        expect(receiptRulesService.updateReceiptRule).toHaveBeenCalled();
      });

      it('should call receiptRulesService on deleteReceiptRule', function () {
    	receiptsFactory.deleteReceiptRule(123);
        expect(receiptRulesService.deleteReceiptRule).toHaveBeenCalledWith(123);
      });
      
  });
});
