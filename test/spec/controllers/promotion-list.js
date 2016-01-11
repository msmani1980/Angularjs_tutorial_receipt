'use strict';
/*global moment*/

describe('Controller: PromotionListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-list.json'));
  beforeEach(module('served/benefit-types.json'));
  beforeEach(module('served/promotion-types.json'));

  var PromotionListCtrl,
    scope,
    promotionsFactory,
    recordsService,
    getPromotionListDeferred,
    getBenefitTypeListDeferred,
    getPromotionTypeListDeferred,
    promotionListJSON,
    benefitTypeListJSON,
    promotionTypeListJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $q, $rootScope, _promotionsFactory_, _recordsService_) {
    inject(function (_servedPromotionList_, _servedBenefitTypes_, _servedPromotionTypes_) {
      promotionListJSON = _servedPromotionList_;
      benefitTypeListJSON = _servedBenefitTypes_;
      promotionTypeListJSON = _servedPromotionTypes_;
    });

    scope = $rootScope.$new();
    promotionsFactory = _promotionsFactory_;
    recordsService = _recordsService_;

    getPromotionListDeferred = $q.defer();
    getPromotionListDeferred.resolve(promotionListJSON);

    getBenefitTypeListDeferred = $q.defer();
    getBenefitTypeListDeferred.resolve(benefitTypeListJSON);

    getPromotionTypeListDeferred = $q.defer();
    getPromotionTypeListDeferred.resolve(promotionTypeListJSON);

    spyOn(promotionsFactory, 'getPromotions').and.returnValue(getPromotionListDeferred.promise);
    spyOn(recordsService, 'getBenefitTypes').and.returnValue(getBenefitTypeListDeferred.promise);
    spyOn(recordsService, 'getPromotionTypes').and.returnValue(getPromotionTypeListDeferred.promise);
    spyOn(promotionsFactory, 'deletePromotion').and.stub();

    PromotionListCtrl = $controller('PromotionListCtrl', {
      $scope: scope

      // place here mocked dependencies
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Promotions');
  });

  it('clearForm should clear search model and make a API call', function () {
    scope.search = {
      startDate: 'fakeDate'
    };
    scope.clearForm();
    expect(scope.search.startDate).toBe(undefined);
    expect(promotionsFactory.getPromotions).toHaveBeenCalledWith({
      startDate: null,
      endDate: null
    });
  });

  it('searchPromotions should clear search model and make a API call', function () {
    scope.search = {
      startDate: '10/05/1979'
    };
    scope.searchPromotions();
    expect(promotionsFactory.getPromotions).toHaveBeenCalledWith({
      startDate: '19791005',
      endDate: null
    });
  });

  it('should get the promotions list from API', function () {
    expect(promotionsFactory.getPromotions).toHaveBeenCalled();
  });

  describe('promotionList in scope', function () {
    it('should attach a promotionList after a API call to getPromotionList',
      function () {
        expect(!!scope.promotionList).toBe(true);
      });

    it('should have a benefitTypeId name property', function () {
      expect(scope.promotionList[0].benefitTypeId).toBe(1);
    });

    it('should have a benefitTypeName name property', function () {
      expect(scope.promotionList[0].benefitTypeName).toBe('Discount');
    });

    it('should have a catalogCount name property', function () {
      expect(scope.promotionList[0].catalogCount).toBe(2);
    });

    it('should have a companyId name property', function () {
      expect(scope.promotionList[0].companyId).toBe(403);
    });

    it('should have a id name property', function () {
      expect(scope.promotionList[0].id).toBe(117);
    });

    it('should have a description name property', function () {
      expect(scope.promotionList[0].description).toBe('Buy 4 drinks get 20% off');
    });

    it('should have a discountTypeId name property', function () {
      expect(scope.promotionList[0].discountTypeId).toBe(1);
    });

    it('should have a discountTypeName name property', function () {
      expect(scope.promotionList[0].discountTypeName).toBe('Percentage');
    });

    it('should have a promotionCode name property', function () {
      expect(scope.promotionList[0].promotionCode).toBe('PM001');
    });

    it('should have a promotionName name property', function () {
      expect(scope.promotionList[0].promotionName).toBe('Buy 4 drinks get 20 percent off');
    });

    it('should have a promotionTypeId name property', function () {
      expect(scope.promotionList[0].promotionTypeId).toBe(1);
    });

    it('should have a promotionTypeName name property', function () {
      expect(scope.promotionList[0].promotionTypeName).toBe('Product Purchase');
    });

    it('should have a formatted start and ebd date', function () {
      expect(scope.promotionList[0].startDate).toBe('01/01/2015');
      expect(scope.promotionList[0].endDate).toBe('09/19/2015');
    });
  });

  describe('Action buttons', function () {
    var fakePromotionItem;

    beforeEach(function () {
      fakePromotionItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });

    describe('can user edit', function () {
      it('should have a isPromotionEditable function', function () {
        expect(!!scope.isPromotionEditable).toBe(true);
      });

      it('should return true if promotion is editable', function () {
        expect(scope.isPromotionEditable(fakePromotionItem)).toBe(true);
      });

      it('should return false if promotion is not editable', function () {
        fakePromotionItem.endDate = moment().subtract(1, 'month').format(
          'L').toString();
        expect(scope.isPromotionEditable(fakePromotionItem)).toBe(false);
      });
    });

    it('should delete promoion be called', function () {
      PromotionListCtrl.deletePromotion(1);

      expect(promotionsFactory.deletePromotion).toHaveBeenCalledWith(1);
    });
  });

  it('setBenefitTypeList should set retail item list', function() {
    var payload = [{ id: 1 }];
    PromotionListCtrl.setBenefitTypeList(payload);

    expect(scope.benefitTypeList).toEqual([{ id: 1 }]);
  });

  it('setPromotionTypeList should set retail item list', function() {
    var payload = [{ id: 1 }];
    PromotionListCtrl.setPromotionTypeList(payload);

    expect(scope.promotionTypeList).toEqual([{ id: 1 }]);
  });
});
