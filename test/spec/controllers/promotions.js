'use strict';

describe('Controller: PromotionsCtrl', function () {

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
    /**/

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

    describe('scope functions exist', function () {
      it('should have a scope function promotionCategoryQtyRequired', function () {
        expect(Object.prototype.toString.call(scope.promotionCategoryQtyRequired)).toBe('[object Function]');
      });
      it('should have a scope function addBlankObjectToArray', function () {
        expect(Object.prototype.toString.call(scope.addBlankObjectToArray)).toBe('[object Function]');
      });
      it('should have a scope function removeFromArrayByIndex', function () {
        expect(Object.prototype.toString.call(scope.removeFromArrayByIndex)).toBe('[object Function]');
      });
      it('should have a scope function retailItemQtyRequired', function () {
        expect(Object.prototype.toString.call(scope.retailItemQtyRequired)).toBe('[object Function]');
      });
      it('should have a scope function scrollToAnchor that set activeBtn to whatever Id is passed in', function () {
        expect(Object.prototype.toString.call(scope.scrollToAnchor)).toBe('[object Function]');
        scope.scrollToAnchor('test-123');
        expect(scope.activeBtn).toBe('test-123');
      });
      it('should have a scope function save', function () {
        expect(Object.prototype.toString.call(scope.save)).toBe('[object Function]');
      });
    });

    describe('removeFromArrayByIndex scope function', function () {
      it('should remove an index item from array', function () {
        scope.mockArray = [2, 3, 4, 5];
        scope.removeFromArrayByIndex(scope.mockArray, 2);
        scope.$apply();
        expect(scope.mockArray).toEqual([2, 3, 5]);
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

    describe('promotionCategoryQtyRequired scope function', function () {
      it('should return true if promotionCategory is defined', function () {
        var mock = {promotionCategory: {}};
        expect(scope.promotionCategoryQtyRequired(mock)).toBe(true);
      });
      it('should return false if promotionCategory is undefined', function () {
        var mock = {};
        expect(scope.promotionCategoryQtyRequired(mock)).toBe(false);
      });
    });

    describe('retailItemQtyRequired scope function', function () {
      it('should return true if retailItem is defined', function () {
        var mock = {retailItem: {}};
        expect(scope.retailItemQtyRequired(mock)).toBe(true);
      });
      it('should return false if retailItem is undefined', function () {
        var mock = {};
        expect(scope.retailItemQtyRequired(mock)).toBe(false);
      });
    });

    describe('save scope function', function(){
      // TODO these test when this is written
    });

    // TODO tests for create by mocking scope

  });
});
