'use strict';

describe('Service: promotionsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionsFactory;
  var itemsService;
  var recordsService;
  var GlobalMenuService;
  var stationsService;
  var companyDiscountService;
  var salesCategoriesService;
  var currenciesService;
  var promotionCategoriesService;
  var promotionsService;
  var dateUtility;
  var today;
  beforeEach(inject(function (_promotionsFactory_, $injector) {
    promotionsFactory = _promotionsFactory_;
    itemsService = $injector.get('itemsService');
    recordsService = $injector.get('recordsService');
    GlobalMenuService = $injector.get('GlobalMenuService');
    stationsService = $injector.get('stationsService');
    companyDiscountService = $injector.get('companyDiscountService');
    salesCategoriesService = $injector.get('salesCategoriesService');
    currenciesService = $injector.get('currenciesService');
    promotionCategoriesService = $injector.get('promotionCategoriesService');
    promotionsService = $injector.get('promotionsService');
    dateUtility = $injector.get('dateUtility');

    today = dateUtility.nowFormatted('YYYYMMDD');

    spyOn(itemsService, 'getItemsList');
    spyOn(recordsService, 'getBenefitTypes');
    spyOn(recordsService, 'getDiscountTypes');
    spyOn(GlobalMenuService.company, 'get');
    spyOn(recordsService, 'getPromotionTypes');
    spyOn(companyDiscountService, 'getDiscountList');
    spyOn(salesCategoriesService, 'getSalesCategoriesList');
    spyOn(recordsService, 'getDiscountApplyTypes');
    spyOn(promotionCategoriesService, 'getPromotionCategories');
    spyOn(stationsService, 'getGlobalStationList');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(promotionsService, 'getPromotion');
    spyOn(promotionsService, 'createPromotion');
    spyOn(promotionsService, 'savePromotion');
  }));

  //itemsService
  describe('itemsService service calls', function(){
    it('should call getItemsList', function(){
      var mockSearch = {foo:'bars'};
      promotionsFactory.getMasterItems(mockSearch);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(mockSearch, true);
    });
  });

  // recordsService
  describe('recordsService service calls', function(){
    it('should call getBenefitTypes', function(){
      promotionsFactory.getBenefitTypes();
      expect(recordsService.getBenefitTypes).toHaveBeenCalled();
    });
    it('should call getDiscountTypes', function(){
      promotionsFactory.getDiscountTypes();
      expect(recordsService.getDiscountTypes).toHaveBeenCalled();
    });
    it('should call getPromotionTypes', function(){
      promotionsFactory.getPromotionTypes();
      expect(recordsService.getPromotionTypes).toHaveBeenCalled();
    });
    it('should call getDiscountApplyTypes', function(){
      promotionsFactory.getDiscountApplyTypes();
      expect(recordsService.getDiscountApplyTypes).toHaveBeenCalled();
    });
  });

  // GlobalMenuService
  describe('GlobalMenuService service calls', function(){
    it('should call get', function(){
      promotionsFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

  // stationsService
  describe('stationsService service calls', function(){
    it('should call getGlobalStationList', function(){
      var mockObj = {id:123};
      promotionsFactory.getStationGlobals(mockObj);
      expect(stationsService.getGlobalStationList).toHaveBeenCalledWith(mockObj);
    });
  });

  // companyDiscountService
  describe('companyDiscountService service calls', function(){
    it('should call getDiscountList when calling getCompanyDiscountsCoupon', function(){
      promotionsFactory.getCompanyDiscountsCoupon();
      var mock = {
        discountTypeId: 1,
        startDate: today
      };
      expect(companyDiscountService.getDiscountList).toHaveBeenCalledWith(mock);
    });
    it('should call getDiscountList when calling getCompanyDiscountsVoucher', function(){
      promotionsFactory.getCompanyDiscountsVoucher();
      var mock = {
        discountTypeId: 4,
        startDate: today
      };
      expect(companyDiscountService.getDiscountList).toHaveBeenCalledWith(mock);
    });
  });

  // salesCategoriesService
  describe('salesCategoriesService service calls', function(){
    it('should call getSalesCategoriesList', function(){
      var mockObj = {foo:'bars'};
      promotionsFactory.getSalesCategories(mockObj);
      expect(salesCategoriesService.getSalesCategoriesList).toHaveBeenCalledWith(mockObj);
    });
  });

  // currenciesService
  describe('currenciesService service calls', function(){
    it('should call getCompanyCurrencies', function(){
      var mockObj = {foo:'bars'};
      promotionsFactory.getCurrencyGlobals(mockObj);
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalledWith(mockObj);
    });
  });

  // promotionCategoriesService
  describe('promotionCategoriesService service calls', function(){
    it('should call getPromotionCategories', function(){
      promotionsFactory.getPromotionCategories();
      expect(promotionCategoriesService.getPromotionCategories).toHaveBeenCalled();
    });
  });

  // promotionsService
  describe('promotionsService service calls', function(){
    it('should call getPromotion', function(){
      var mockId = 321;
      promotionsFactory.getPromotion(mockId);
      expect(promotionsService.getPromotion).toHaveBeenCalledWith(mockId);
    });
    it('should call createPromotion', function(){
      var mockObj = {id:321};
      promotionsFactory.createPromotion(mockObj);
      expect(promotionsService.createPromotion).toHaveBeenCalledWith(mockObj);
    });
    it('should call savePromotion', function(){
      var mockId = 234;
      var mockObj = {id:321};
      promotionsFactory.savePromotion(mockId, mockObj);
      expect(promotionsService.savePromotion).toHaveBeenCalledWith(mockId, mockObj);
    });
  });

});
