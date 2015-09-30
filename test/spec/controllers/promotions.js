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
    'served/master-item-list.json',
    'served/promotion.json'
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
  var companyId;
  var masterItemsList;
  var savePromotionDeferred;
  var getPromotionDeferred;

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
                              _servedMasterItemList_,
                              _servedPromotion_) {
    scope = $rootScope.$new();

    promotionsFactory = $injector.get('promotionsFactory');
    companyId = 403;

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
    masterItemsList = _servedMasterItemList_;
    getMasterItemsDeferred.resolve(masterItemsList);
    savePromotionDeferred = $q.defer();
    savePromotionDeferred.resolve(true);
    getPromotionDeferred = $q.defer();
    getPromotionDeferred.resolve(_servedPromotion_);

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
    spyOn(promotionsFactory, 'getCompanyId').and.returnValue(companyId);
    spyOn(promotionsFactory, 'getPromotion').and.returnValue(getPromotionDeferred.promise);
    spyOn(promotionsFactory, 'createPromotion').and.returnValue(savePromotionDeferred.promise);
    spyOn(promotionsFactory, 'savePromotion').and.returnValue(savePromotionDeferred.promise);

  }));

  describe('create promotion', function () {
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

    describe('disabledDepartureStations scope function', function(){
      it('should return false if stations is passed in with arrivalStation undefined', function(){
        expect(scope.disabledDepartureStations(null, {})).toBe(false);
      });
      it('should return false if stations is passed in with arrivalStation.id undefined', function(){
        expect(scope.disabledDepartureStations(null, {arrivalStation:{}})).toBe(false);
      });
      it('should return false if passed in station does not contain an id', function(){
        scope.repeatableStations.arrivalHas = [];
        scope.repeatableStations.arrivalHas[5] = [1,2,3];
        expect(scope.disabledDepartureStations({foo:'bar'}, {arrivalStation:{id:1}})).toBe(false);
      });
      it('should return false if arrivalStation.id doesn not exist in repeatableStations.arrivalHas', function(){
        scope.repeatableStations.arrivalHas = [];
        scope.repeatableStations.arrivalHas[5] = [1,2,3];
        expect(scope.disabledDepartureStations({id:7}, {arrivalStation:{id:1}})).toBe(false);
      });
      it('should return false if the station.id is not in repeatableStations.arrivalHas', function(){
        scope.repeatableStations.arrivalHas = [];
        scope.repeatableStations.arrivalHas[5] = [1,2,3];
        expect(scope.disabledDepartureStations({id:4}, {arrivalStation:{id:5}})).toBe(false);
      });
      it('should return true if the station.id of the arrivalStation.id is in repeatableStations.arrivalHas', function(){
        scope.repeatableStations.arrivalHas = [];
        scope.repeatableStations.arrivalHas[5] = [1,2,3];
        expect(scope.disabledDepartureStations({id:2}, {arrivalStation:{id:5}})).toBe(true);
      });
      it('should return false if passed in station.id is same as arrivalStation.id', function(){
        scope.repeatableStations.arrivalHas = [];
        scope.repeatableStations.arrivalHas[5] = [1,2,3];
        expect(scope.disabledDepartureStations({id:5}, {arrivalStation:{id:5}})).toBe(false);
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

    describe('removeFromStationListByIndex scope function', function(){
      describe('hasCompleteStationObject private function', function(){
        it('should return false if promotion.filters[$index] is undefined', function(){
          expect(scope.removeFromStationListByIndex(0)).toBe(false);
        });
        it('should return false if promotion.filters[$index].arrivalStation is undefined', function(){
          scope.promotion.filters = [
            {},{}
          ];
          expect(scope.removeFromStationListByIndex(0)).toBe(false);
        });
        it('should return false if promotion.filters[$index].arrivalStation.id is undefined', function(){
          scope.promotion.filters = [
            {arrivalStation:{}},{arrivalStation:{}}
          ];
          expect(scope.removeFromStationListByIndex(0)).toBe(false);
        });
        it('should return false if promotion.filters[$index].departureStation is undefined', function(){
          scope.promotion.filters = [
            {arrivalStation:{id:1}},{arrivalStation:{id:2}}
          ];
          expect(scope.removeFromStationListByIndex(0)).toBe(false);
        });
        it('should return false if promotion.filters[$index].departureStation.id is undefined', function(){
          scope.promotion.filters = [
            {arrivalStation:{id:1},departureStation:{}},{arrivalStation:{id:2},departureStation:{}}
          ];
          expect(scope.removeFromStationListByIndex(0)).toBe(false);
        });
      });
      it('should remove by index from promotion.filters, by id from repeatableStations.arrivalHas and by id from repeatableStations.departureHas', function(){
        scope.promotion.filters = [
          {
            departureStation: {id:5},
            arrivalStation:   {id:6}},
          {
            departureStation: {id:5},
            arrivalStation:   {id:4}
          },
          {
            arrivalStation:   {id:4},
            departureStation: {id:3}
          },
          {
            departureStation: {id:3},
            arrivalStation:   {id:6}
          },
          {
            departureStation: {id:7}
          }
        ];
        scope.repeatableStations = {
          arrivalHas:   [ null, null, null, null,     [ 5, 3 ], null,     [ 5, 3 ], [  ] ],
          departureHas: [ null, null, null, [ 4, 6 ], null,     [ 6, 4 ], [  ] ]
        };

        scope.removeFromStationListByIndex(2);

        expect(scope.promotion.filters).toEqual([
          {
            departureStation: {id:5},
            arrivalStation:   {id:6}
          },
          {
            departureStation: {id:5},
            arrivalStation:   {id:4}
          },
          {
            departureStation: {id:3},
            arrivalStation:   {id:6}
          },
          {
            departureStation: {id:7}
          }
        ]);
        expect(scope.repeatableStations).toEqual({
          arrivalHas:   [ null, null, null, null,     [ 5 ],    null,     [ 5, 3 ], [  ] ],
          departureHas: [ null, null, null, [ 6 ],    null,     [ 6, 4 ], [  ] ]
        });
      });
    });

    describe('disabledArrivalStations scope function', function(){
      it('should return false if stations is passed in with departureStation undefined', function(){
        expect(scope.disabledArrivalStations(null, {})).toBe(false);
      });
      it('should return false if stations is passed in with departureStation.id undefined', function(){
        expect(scope.disabledArrivalStations(null, {departureStation:{}})).toBe(false);
      });
      it('should return false if passed in station does not contain an id', function(){
        scope.repeatableStations.departureHas = [];
        scope.repeatableStations.departureHas[5] = [1,2,3];
        expect(scope.disabledArrivalStations({foo:'bar'}, {departureStation:{id:1}})).toBe(false);
      });
      it('should return false if departureStation.id doesn not exist in repeatableStations.departureHas', function(){
        scope.repeatableStations.departureHas = [];
        scope.repeatableStations.departureHas[5] = [1,2,3];
        expect(scope.disabledArrivalStations({id:7}, {departureStation:{id:1}})).toBe(false);
      });
      it('should return false if the station.id is not in repeatableStations.departureHas', function(){
        scope.repeatableStations.departureHas = [];
        scope.repeatableStations.departureHas[5] = [1,2,3];
        expect(scope.disabledArrivalStations({id:4}, {departureStation:{id:5}})).toBe(false);
      });
      it('should return true if the station.id of the departureStation.id is in repeatableStations.departureHas', function(){
        scope.repeatableStations.departureHas = [];
        scope.repeatableStations.departureHas[5] = [1,2,3];
        expect(scope.disabledArrivalStations({id:2}, {departureStation:{id:5}})).toBe(true);
      });
      it('should return false if passed in station.id is same as departureStation.id', function(){
        scope.repeatableStations.departureHas = [];
        scope.repeatableStations.departureHas[5] = [1,2,3];

        expect(scope.disabledArrivalStations({id:5}, {departureStation:{id:5}})).toBe(false);
      });
    });

    describe('stationListChanged scope function', function(){
      it('should set the correct station Has array items', function() {
        scope.promotion.filters = [
          {
            departureStation: {id: 1},
            arrivalStation: {id: 2}
          },
          {
            departureStation: {id: 2},
            arrivalStation: {id: 4}
          }
        ];
        scope.stationListChanged(1);
        var mock = {arrivalHas:[],departureHas:[]};
        mock.arrivalHas[4] = [2];
        mock.departureHas[2] = [4];

        expect(scope.repeatableStations).toEqual(mock);
      });
    });

    describe('itemCategoryChanged scope function', function(){
      var mockId = 432;
      beforeEach(function(){
        scope.itemCategorySelects = [];
        scope.itemCategorySelects[5] = {id:mockId};
        scope.itemCategoryChanged(5);
        scope.$digest();
      });
      it('should make an API call', function(){
        expect(promotionsFactory.getMasterItems).toHaveBeenCalledWith({companyId:companyId,categoryId:mockId});
      });
      it('should set repeatableItemListSelectOptions index to API response', function(){
        expect(scope.repeatableItemListSelectOptions[5]).toEqual(masterItemsList.masterItems);
      });
      it('should set repeatableItemListSelectOptions index to cached API response', function(){
        scope.itemCategoryChanged(5);
        scope.$digest();
        expect(scope.repeatableItemListSelectOptions[5]).toEqual(masterItemsList.masterItems);
      });
    });

    describe('save scope function', function(){
      beforeEach(function(){
        scope.promotionsForm = {$valid:true};
      });
      it('should call create with formatted payload 1', function(){
        scope.promotion = {
          'promotionCode': 'test1',
          'promotionName': 'test1',
          'description': 'test1',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 1,
          },
          'promotionCategories': [
            {
              'promotionCategory': {
                'id': 63
              },
              'categoryQty': 1
            },
            {
              'promotionCategory': {
                'id': 64
              },
              'categoryQty': 2
            }
          ],
          'items': [
            {
              'retailItem': {
                'id': 206
              },
              'itemQty': 2
            },
            {
              'retailItem': {
                'id': 36
              },
              'itemQty': 3
            }
          ],
          'spendLimitCategory': {
            'id': null
          },
          'benefitType': {
            'id': 1,
            'name': 'Discount'
          },
          'discountType': {
            'id': 1,
            'name': 'Percentage'
          },
          'benefitDiscountApply': {
            'id': 1,
            'name': 'Cart'
          },
          'discountItem': {
            'id': null
          },
          'giftWithPurchase': false,
          'discountCategory': {
            'id': null
          },
          'companyCoupon': {
            'id': null
          },
          'companyVoucher': {
            'id': null
          },
          'discountPercentage': '1.123',
          'lowestPricedArticle': true,
          'filters': [
            {
              'departureStation': {
                'id': 2
              },
              'arrivalStation': {
                'id': 3
              }
            },
            {
              'departureStation': {
                'id': 4
              },
              'arrivalStation': {
                'id': 5,
              }
            }
          ]
        };
        scope.save();
        var mockPayload1 = {
          companyId: 403,
          promotionCode: 'test1',
          promotionName: 'test1',
          description: 'test1',
          startDate: '20150930',
          endDate: '20150930',
          benefitTypeId: 1,
          promotionCategories: [
            {
              companyPromotionCategoryId: 63,
              categoryQty: 1
            },
            {
              companyPromotionCategoryId: 64,
              categoryQty: 2
            }
          ],
          items: [
            {
              itemQty: 2,
              itemId: 206
            },
            {
              itemQty: 3,
              itemId: 36
            }
          ],
          spendLimitAmounts: null,
          spendLimitCategoryId: null,
          companyCouponId: null,
          companyVoucherId: null,
          discountTypeId: 1,
          benefitDiscountApplyId: 1,
          discountCategoryId: null,
          discountItemId: null,
          giftWithPurchase: null,
          discountPercentage: '1.123',
          lowestPricedArticle: true,
          benefitAmounts: null,
          filters: [
            {
              arrivalStationId: 3,
              departureStationId: 2
            },
            {
              arrivalStationId: 5,
              departureStationId: 4 }
          ],
          promotionTypeId: 1
        };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload1);
      });
      it('should call create with formatted payload 2', function(){
        scope.promotion = {
          'promotionCode': 'test2',
          'promotionName': 'test2',
          'description': 'test2',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 2
          },
          'promotionCategories': [],
          'items': [],
          'spendLimitCategory': {
            'id': 64
          },
          'benefitType': {
            'id': 2
          },
          'discountType': {
            'id': null
          },
          'benefitDiscountApply': {
            'id': null
          },
          'discountItem': {
            'id': null
          },
          'giftWithPurchase': false,
          'discountCategory': {
            'id': null
          },
          'companyCoupon': {
            'id': 102,
          },
          'companyVoucher': {
            'id': null
          },
          'discountPercentage': null,
          'lowestPricedArticle': false,
          'filters': []
        };
        scope.save();
        var mockPayload2 = { companyId: 403, promotionCode: 'test2', promotionName: 'test2', description: 'test2', startDate: '20150930', endDate: '20150930', benefitTypeId: 2, promotionCategories: null, items: null, spendLimitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], spendLimitCategoryId: 64, companyCouponId: 102, companyVoucherId: null, discountTypeId: null, benefitDiscountApplyId: null, discountCategoryId: null, discountItemId: null, giftWithPurchase: null, discountPercentage: null, lowestPricedArticle: null, benefitAmounts: null, filters: [  ], promotionTypeId: 2 };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload2);
      });
      it('should call create with formatted payload 3', function(){
        scope.promotion = {
          'promotionCode': 'test3',
          'promotionName': 'test3',
          'description': 'test3',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 2
          },
          'promotionCategories': [],
          'items': [],
          'spendLimitCategory': {
            'id': 66
          },
          'benefitType': {
            'id': 3
          },
          'discountType': {
            'id': null
          },
          'benefitDiscountApply': {
            'id': null
          },
          'discountItem': {
            'id': null
          },
          'giftWithPurchase': false,
          'discountCategory': {
            'id': null
          },
          'companyCoupon': {
            'id': null
          },
          'companyVoucher': {
            'id': 109
          },
          'discountPercentage': null,
          'lowestPricedArticle': false,
          'filters': []
        };
        scope.save();
        var mockPayload3 = { companyId: 403, promotionCode: 'test3', promotionName: 'test3', description: 'test3', startDate: '20150930', endDate: '20150930', benefitTypeId: 3, promotionCategories: null, items: null, spendLimitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], spendLimitCategoryId: 66, companyCouponId: null, companyVoucherId: 109, discountTypeId: null, benefitDiscountApplyId: null, discountCategoryId: null, discountItemId: null, giftWithPurchase: null, discountPercentage: null, lowestPricedArticle: null, benefitAmounts: null, filters: [  ], promotionTypeId: 2 };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload3);
      });
      it('should call create with formatted payload 4', function(){
        scope.promotion = {
          'promotionCode': 'test4',
          'promotionName': 'test4',
          'description': 'test4',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 2,
            'name': 'Spend Limit'
          },
          'promotionCategories': [],
          'items': [],
          'spendLimitCategory': {
            'id': 67
          },
          'benefitType': {
            'id': 1,
            'name': 'Discount'
          },
          'discountType': {
            'id': 2,
            'name': 'Amount'
          },
          'benefitDiscountApply': {
            'id': 2
          },
          'discountItem': {
            'id': null
          },
          'giftWithPurchase': false,
          'discountCategory': {
            'id': null
          },
          'companyCoupon': {
            'id': null
          },
          'companyVoucher': {
            'id': null
          },
          'discountPercentage': null,
          'lowestPricedArticle': false,
          'filters': []
        };
        scope.save();
        var mockPayload4 = { companyId: 403, promotionCode: 'test4', promotionName: 'test4', description: 'test4', startDate: '20150930', endDate: '20150930', benefitTypeId: 1, promotionCategories: null, items: null, spendLimitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], spendLimitCategoryId: 67, companyCouponId: null, companyVoucherId: null, discountTypeId: 2, benefitDiscountApplyId: 2, discountCategoryId: null, discountItemId: null, giftWithPurchase: null, discountPercentage: null, lowestPricedArticle: null, benefitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], filters: [  ], promotionTypeId: 2 };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload4);
      });
      it('should call create with formatted payload 5', function(){
        scope.promotion = {
          'promotionCode': 'test5',
          'promotionName': 'test5',
          'description': 'test5',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 2
          },
          'promotionCategories': [],
          'items': [],
          'spendLimitCategory': {
            'id': 64
          },
          'benefitType': {
            'id': 1
          },
          'discountType': {
            'id': 1
          },
          'benefitDiscountApply': {
            'id': 3
          },
          'discountItem': {
            'id': null
          },
          'giftWithPurchase': false,
          'discountCategory': {
            'id': 65
          },
          'companyCoupon': {
            'id': null
          },
          'companyVoucher': {
            'id': null
          },
          'discountPercentage': '1.234',
          'lowestPricedArticle': false,
          'filters': []
        };
        scope.save();
        var mockPayload5 = { companyId: 403, promotionCode: 'test5', promotionName: 'test5', description: 'test5', startDate: '20150930', endDate: '20150930', benefitTypeId: 1, promotionCategories: null, items: null, spendLimitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], spendLimitCategoryId: 64, companyCouponId: null, companyVoucherId: null, discountTypeId: 1, benefitDiscountApplyId: 3, discountCategoryId: 65, discountItemId: null, giftWithPurchase: null, discountPercentage: '1.234', lowestPricedArticle: false, benefitAmounts: null, filters: [  ], promotionTypeId: 2 };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload5);
      });
      it('should call create with formatted payload 6', function(){
        scope.promotion = {
          'promotionCode': 'test5',
          'promotionName': 'test5',
          'description': 'test5',
          'startDate': '09/30/2015',
          'endDate': '09/30/2015',
          'promotionType': {
            'id': 2
          },
          'promotionCategories': [],
          'items': [],
          'spendLimitCategory': {
            'id': 67
          },
          'benefitType': {
            'id': 1
          },
          'discountType': {
            'id': 1
          },
          'benefitDiscountApply': {
            'id': 4
          },
          'discountItem': {
            'id': 36,
          },
          'giftWithPurchase': true,
          'discountCategory': {
            'id': null
          },
          'companyCoupon': {
            'id': null
          },
          'companyVoucher': {
            'id': null
          },
          'discountPercentage': '1.234',
          'lowestPricedArticle': true,
          'filters': []
        };
        scope.save();
        var mockPayload6 = { companyId: 403, promotionCode: 'test5', promotionName: 'test5', description: 'test5', startDate: '20150930', endDate: '20150930', benefitTypeId: 1, promotionCategories: null, items: null, spendLimitAmounts: [ { amount: null, companyCurrencyId: 8 }, { amount: null, companyCurrencyId: 9 } ], spendLimitCategoryId: 67, companyCouponId: null, companyVoucherId: null, discountTypeId: 1, benefitDiscountApplyId: 4, discountCategoryId: null, discountItemId: 36, giftWithPurchase: true, discountPercentage: '1.234', lowestPricedArticle: true, benefitAmounts: null, filters: [  ], promotionTypeId: 2 };
        expect(promotionsFactory.createPromotion).toHaveBeenCalledWith(mockPayload6);
      });
    });

    describe('foobar state', function() {
      beforeEach(inject(function ($controller) {
        routeParams = {
          state: 'foobar'
        };
        PromotionsCtrl = $controller('PromotionsCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
        scope.promotionsForm = {$valid: true};
      }));
      it('should return false if form.$invalid', function(){
        expect(scope.save()).toBe(false);
      });
    });

    describe('edit promotion', function(){
      beforeEach(inject(function ($controller) {
        routeParams = {
          state: 'edit',
          id: 253
        };
        PromotionsCtrl = $controller('PromotionsCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
        scope.promotionsForm = {$valid:true};
      }));
      it('should call get promotion API', function(){
        expect(promotionsFactory.getPromotion).toHaveBeenCalledWith(253);
      });
      it('should call save promotion API', function(){
        scope.save();
        expect(promotionsFactory.savePromotion).toHaveBeenCalled();
      });
      it('should return false if form.$invalid', function(){
        scope.promotionsForm = {$valid:false};
        expect(scope.save()).toBe(false);
      });
    });

    describe('view promotion', function () {
      beforeEach(inject(function ($controller) {
        routeParams = {
          state: 'view',
          id: 253
        };
        PromotionsCtrl = $controller('PromotionsCtrl', {
          $scope: scope,
          $routeParams: routeParams
        });
        scope.$digest();
      }));
      it('should call get promotion API', function(){
        expect(promotionsFactory.getPromotion).toHaveBeenCalledWith(253);
      });
      it('should set readOnly to true', function(){
        expect(scope.readOnly).toBe(true);
      });
      it('should return false: addBlankObjectToArray', function(){
        expect(scope.addBlankObjectToArray([])).toBe(false);
      });
      it('should return false: save', function(){
        expect(scope.save()).toBe(false);
      });
      it('should set scope.promotion.id', function(){
        expect(scope.promotion.id).toEqual(253);
      });
    });

  });
});
