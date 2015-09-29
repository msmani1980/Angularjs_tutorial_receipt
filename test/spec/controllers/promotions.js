'use strict';

fdescribe('Controller: PromotionsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  beforeEach(module(
    'served/benefit-types.json',
    'served/discount-types.json',
    'served/promotion-types.json',
    'served/company-discounts-vouchers.json',
    'served/company-discounts-coupons.json',
    'served/sales-categories.json',
    'served/discount-apply-types.json',
    'served/promotion-categories.json',
    'served/company-station-globals.json',
    'served/currency-globals.json',
    'served/master-item-list.json'
  ));

  var PromotionsCtrl;
  var scope;
  var routeParams;
  var promotionsFactory;
  var getBenefitTypesDeferred;
  var getDiscountTypesDeferred;
  var getPromotionTypesDeferred;
  var getCompanyDiscountsCouponDeferred;
  var getCompanyDiscountsVoucherDeferred;
  var getSalesCategoriesDeferred;
  var getDiscountApplyTypesDeferred;
  var getPromotionCategoriesDeferred;
  var getStationGlobalsDeferred;
  var getCurrencyGlobalsDeferred;
  var getMasterItemsDeferred;

  /**/
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $injector, $q,
                              _servedBenefitTypes_,
                              _servedDiscountTypes_,
                              _servedPromotionTypes_,
                              _servedCompanyDiscountsVouchers_,
                              _servedCompanyDiscountsCoupons_,
                              _servedSalesCategories_,
                              _servedDiscountApplyTypes_,
                              _servedPromotionCategories_,
                              _servedCompanyStationGlobals_,
                              _servedCurrencyGlobals_,
                              _servedMasterItemList_) {
    scope = $rootScope.$new();

    promotionsFactory = $injector.get('promotionsFactory');

    getBenefitTypesDeferred = $q.defer();
    getBenefitTypesDeferred.resolve(_servedBenefitTypes_);
    getDiscountTypesDeferred = $q.defer();
    getDiscountTypesDeferred.resolve(_servedDiscountTypes_);
    getPromotionTypesDeferred = $q.defer();
    getPromotionTypesDeferred.resolve(_servedPromotionTypes_);
    getCompanyDiscountsCouponDeferred = $q.defer();
    getCompanyDiscountsCouponDeferred.resolve(_servedCompanyDiscountsCoupons_);
    getCompanyDiscountsVoucherDeferred = $q.defer();
    getCompanyDiscountsVoucherDeferred.resolve(_servedCompanyDiscountsVouchers_);
    getSalesCategoriesDeferred = $q.defer();
    getSalesCategoriesDeferred.resolve(_servedSalesCategories_);
    getDiscountApplyTypesDeferred = $q.defer();
    getDiscountApplyTypesDeferred.resolve(_servedDiscountApplyTypes_);
    getPromotionCategoriesDeferred = $q.defer();
    getPromotionCategoriesDeferred.resolve(_servedPromotionCategories_);
    getStationGlobalsDeferred = $q.defer();
    getStationGlobalsDeferred.resolve(_servedCompanyStationGlobals_);
    getCurrencyGlobalsDeferred = $q.defer();
    getCurrencyGlobalsDeferred.resolve(_servedCurrencyGlobals_);
    getMasterItemsDeferred = $q.defer();
    getMasterItemsDeferred.resolve(_servedMasterItemList_);

    spyOn(promotionsFactory, 'getBenefitTypes').and.returnValue(getBenefitTypesDeferred.promise);
    spyOn(promotionsFactory, 'getDiscountTypes').and.returnValue(getDiscountTypesDeferred.promise);
    spyOn(promotionsFactory, 'getPromotionTypes').and.returnValue(getPromotionTypesDeferred.promise);
    spyOn(promotionsFactory, 'getCompanyDiscountsCoupon').and.returnValue(getCompanyDiscountsCouponDeferred.promise);
    spyOn(promotionsFactory, 'getCompanyDiscountsVoucher').and.returnValue(getCompanyDiscountsVoucherDeferred.promise);
    spyOn(promotionsFactory, 'getSalesCategories').and.returnValue(getSalesCategoriesDeferred.promise);
    spyOn(promotionsFactory, 'getDiscountApplyTypes').and.returnValue(getDiscountApplyTypesDeferred.promise);
    spyOn(promotionsFactory, 'getPromotionCategories').and.returnValue(getPromotionCategoriesDeferred.promise);
    spyOn(promotionsFactory, 'getStationGlobals').and.returnValue(getStationGlobalsDeferred.promise);
    spyOn(promotionsFactory, 'getCurrencyGlobals').and.returnValue(getCurrencyGlobalsDeferred.promise);
    spyOn(promotionsFactory, 'getMasterItems').and.returnValue(getMasterItemsDeferred.promise);

  }));

  describe('Init create', function () {
    beforeEach(inject(function($controller){
      routeParams = {
        state:'create'
      };
      PromotionsCtrl = $controller('PromotionsCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('init API calls', function () {

      it('should call promotionsFactory.getBenefitTypes', function () {
        expect(promotionsFactory.getBenefitTypes).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getDiscountTypes', function () {
        expect(promotionsFactory.getDiscountTypes).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getPromotionTypes', function () {
        expect(promotionsFactory.getPromotionTypes).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getCompanyDiscountsCoupon', function () {
        expect(promotionsFactory.getCompanyDiscountsCoupon).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getCompanyDiscountsVoucher', function () {
        expect(promotionsFactory.getCompanyDiscountsVoucher).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getSalesCategories', function () {
        expect(promotionsFactory.getSalesCategories).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getDiscountApplyTypes', function () {
        expect(promotionsFactory.getDiscountApplyTypes).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getStationGlobals', function () {
        expect(promotionsFactory.getStationGlobals).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getStationGlobals', function () {
        expect(promotionsFactory.getStationGlobals).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getCurrencyGlobals', function () {
        expect(promotionsFactory.getCurrencyGlobals).toHaveBeenCalled();
      });
      it('should call promotionsFactory.getMasterItems', function () {
        expect(promotionsFactory.getMasterItems).toHaveBeenCalled();
      });
      /**/
    });

    describe('scope selection options and data arrays', function () {
      it('should have companyCurrencyGlobals', function () {
        expect(scope.companyCurrencyGlobals).toBeDefined();
        expect(Object.prototype.toString.call(scope.companyCurrencyGlobals)).toBe('[object Array]');
      });
      it('should have selectOptions object', function () {
        expect(scope.selectOptions).toBeDefined();
        expect(Object.prototype.toString.call(scope.selectOptions)).toBe('[object Object]');
      });
      describe('selectOptions arrays', function () {
        it('should have a property promotionTypes', function () {
          expect(scope.selectOptions.promotionTypes).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.promotionTypes)).toBe('[object Array]');
        });
        it('should have a property benefitTypes', function () {
          expect(scope.selectOptions.benefitTypes).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.benefitTypes)).toBe('[object Array]');
        });
        it('should have a property discountTypes', function () {
          expect(scope.selectOptions.discountTypes).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.discountTypes)).toBe('[object Array]');
        });
        it('should have a property promotionCategories', function () {
          expect(scope.selectOptions.promotionCategories).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.promotionCategories)).toBe('[object Array]');
        });
        it('should have a property salesCategories', function () {
          expect(scope.selectOptions.salesCategories).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.salesCategories)).toBe('[object Array]');
        });
        it('should have a property masterItems', function () {
          expect(scope.selectOptions.masterItems).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.masterItems)).toBe('[object Array]');
        });
        it('should have a property discountApplyTypes', function () {
          expect(scope.selectOptions.discountApplyTypes).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.discountApplyTypes)).toBe('[object Array]');
        });
        it('should have a property companyDiscountsCoupon', function () {
          expect(scope.selectOptions.companyDiscountsCoupon).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.companyDiscountsCoupon)).toBe('[object Array]');
        });
        it('should have a property companyDiscountsVoucher', function () {
          expect(scope.selectOptions.companyDiscountsVoucher).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.companyDiscountsVoucher)).toBe('[object Array]');
        });
        it('should have a property companyStationGlobals', function () {
          expect(scope.selectOptions.companyStationGlobals).toBeDefined();
          expect(Object.prototype.toString.call(scope.selectOptions.companyStationGlobals)).toBe('[object Array]');
        });
      });
    });

    describe('addBlankObjectToArray scope function', function () {
      it('should add a blank object to a scope array', function () {
        scope.mockArray2 = [{}, {}, {}, {}];
        scope.addBlankObjectToArray(scope.mockArray2);
        scope.$apply();
        expect(scope.mockArray2.length).toEqual(5);
      });
    });

    describe('promotionCategoryQtyRequired scope function', function(){
      it('should return true if whatever passed into it has a promotionCategory property', function(){
        expect(scope.promotionCategoryQtyRequired({promotionCategory:'yes'})).toBe(true);
      });
      it('should return false if whatever passed into it does not have a promotionCategory property', function(){
        expect(scope.promotionCategoryQtyRequired({foo:'bar'})).toBe(false);
      });
    });

    describe('retailItemQtyRequired scope function', function(){
      it('should return true if retailItem is set', function(){
        expect(scope.retailItemQtyRequired({retailItem:'bar'})).toBe(true);
      });
      it('should return true if itemId is set', function(){
        expect(scope.retailItemQtyRequired({itemId:'bar'})).toBe(true);
      });
      it('should return false neither are set', function(){
        expect(scope.retailItemQtyRequired({foo:'bar'})).toBe(false);
      });
    });

    describe('cancel scope function', function(){
      it('should have a scope function cancel', function () {
        expect(Object.prototype.toString.call(scope.cancel)).toBe('[object Function]');
      });
    });

    describe('promotionCategorySelectChanged scope function', function(){
      it('should add the promotion.promotionCategories to repeatableProductPurchasePromotionCategoryIds', function(){
        scope.promotion.promotionCategories = [
          {
            promotionCategory:{
              id: 123
            }
          },
          {
            promotionCategory:{
              id: 543
            }
          }
        ];
        scope.promotionCategorySelectChanged(1);
        expect(scope.repeatableProductPurchasePromotionCategoryIds[1]).toBe(543);
      });
    });

    describe('disabledPromotionCategory scope function', function(){
      it('should return true if id in repeatableProductPurchasePromotionCategoryIds', function(){
        scope.repeatableProductPurchasePromotionCategoryIds = [321,234,43];
        expect(scope.disabledPromotionCategory({id:43})).toBe(true);
      });
      it('should return false if id not in repeatableProductPurchasePromotionCategoryIds', function(){
        scope.repeatableProductPurchasePromotionCategoryIds = [321,234,43];
        expect(scope.disabledPromotionCategory({id:65})).toBe(false);
      });
    });

    describe('removeFromPromotionCategoryByIndex scope function', function(){
      it('should splice on index of promotion.promotionCategories and repeatableProductPurchasePromotionCategoryIds', function(){
        scope.promotion.promotionCategories = [
          {id:1},
          {id:2},
          {id:3}
        ];
        scope.repeatableProductPurchasePromotionCategoryIds = [1,2,3];
        scope.removeFromPromotionCategoryByIndex(1);
        expect(scope.promotion.promotionCategories).toEqual([{id:1},{id:3}]);
        expect(scope.repeatableProductPurchasePromotionCategoryIds).toEqual([1,3]);
      });
    });

    describe('itemSelectInit scope function', function(){
      it('should set repeatableItemListSelectOptions index to selectOptions.masterItems', function(){
        var mockMasterItems = [
          {mock:'123'},{data:6543}
        ];
        scope.selectOptions.masterItems = mockMasterItems;
        scope.itemSelectInit(5);
        expect(scope.repeatableItemListSelectOptions[5]).toEqual(mockMasterItems);
      });
    });

    describe('itemSelectChanged scope function', function(){
      it('should set repeatableProductPurchaseItemIds index to promotion.items[$index].retailItem.id', function(){
        var mockId = 45;
        scope.promotion.items = [
          {retailItem: {id:76}},
          {retailItem: {id:mockId}}
        ];
        scope.itemSelectChanged(1);
        expect(scope.repeatableProductPurchaseItemIds[1]).toEqual(mockId);
      });
    });

    describe('disabledItems scope function', function(){
      it('should return true if id in repeatableProductPurchaseItemIds', function(){
        var mockItem = {id:23};
        scope.repeatableProductPurchaseItemIds = [45,54,23];
        expect(scope.disabledItems(mockItem)).toBe(true);
      });
      it('should return false if id not in repeatableProductPurchaseItemIds', function(){
        var mockItem = {id:2};
        scope.repeatableProductPurchaseItemIds = [45,54,23];
        expect(scope.disabledItems(mockItem)).toBe(false);
      });
    });

    describe('removeFromItemListByIndex scope function', function(){
      it('should splice index of repeatableProductPurchaseItemIds and promotion.items', function(){
        scope.repeatableProductPurchaseItemIds = [23,54,46];
        scope.promotion.items = [{id:23},{id:54},{id:46}];
        scope.removeFromItemListByIndex(1);
        expect(scope.repeatableProductPurchaseItemIds).toEqual([23,46]);
        expect(scope.promotion.items).toEqual([{id:23},{id:46}]);
      });
    });

    describe('save scope function', function(){
      // TODO these test when this is written
    });

    // TODO tests for create by mocking scope

  });
});
