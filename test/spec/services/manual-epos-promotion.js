'use strict';

describe('Service: manualEposPromotion', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/manual-promotions-list.json', 'served/manual-promotion.json'));

  // instantiate service
  var manualEposPromotion,
    $httpBackend,
    promotionResponseJSON,
    promotionListResponseJSON;

  beforeEach(inject(function (_manualEposPromotion_, $injector){
    inject(function (_servedManualPromotionsList_, _servedManualPromotion_) {
    	promotionResponseJSON = _servedManualPromotion_;
    	promotionListResponseJSON = _servedManualPromotionsList_;
      });

      $httpBackend = $injector.get('$httpBackend');

      manualEposPromotion = _manualEposPromotion_;

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
	    expect(!!manualEposPromotion).toBe(true);
  });

  describe('API calls', function () {

    describe('getManualEposPromotionList', function () {

      var promotionListData;

      it('should be accessible in the service', function () {
        expect(!!manualEposPromotion.getManualEposPromotionList).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenGET(/cashbag-promotions/).respond(promotionListResponseJSON);
        manualEposPromotion.getManualEposPromotionList().then(function (dataFromAPI) {
          promotionListData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(promotionListData.promotions)).toBe('[object Array]');
      });

      it('should have promotionId property', function () {
        expect(promotionListData.promotions[0].promotionId).not.toBe(null);
      });

      it('should have cashbagId property', function () {
        expect(promotionListData.promotions[0].cashbagId).not.toBe(null);
      });
    });

    describe('createPromotion', function () {

      it('should be accessible in the service', function () {
        expect(!!manualEposPromotion.createManualEposPromotion).toBe(true);
      });

      var promotionData;

      beforeEach(function () {
        var promotion = {
          cashbagId: 1182,
          promotionId: 163,
          currencyId: 8,
          amount: 12.12,
          quantity: 12,
          totalConvertedAmount: 145.44
        };
        $httpBackend.expectPOST(/cashbag-promotions/).respond(promotionResponseJSON);

        manualEposPromotion.createManualEposPromotion (promotion).then(function (dataFromAPI) {
          promotionData = dataFromAPI;
        });

        $httpBackend.flush();
      });

      it('should be an object', function () {
        expect(Object.prototype.toString.call(promotionData)).toBe('[object Object]');
      });

      it('should have promotionId property', function () {
        expect(promotionData.promotionId).not.toBe(null);
      });

    });

    describe('updatePromotion', function () {

      it('should be accessible in the service', function () {
        expect(!!manualEposPromotion.updateManualEposPromotion).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenPUT(/cashbag-promotions/).respond({ done: true });
      });

      it('should PUT data to cash bag API', function () {
        manualEposPromotion.updateManualEposPromotion(95, { promotion: 'fakePromotionPayload' });
        $httpBackend.expectPUT(/cashbag-promotions/);
        $httpBackend.flush();
      });
    });

    describe('deletePromotion', function() {
      it('should be accessible in the service', function () {
        expect(!!manualEposPromotion.deleteManualEposPromotion).toBe(true);
      });

      beforeEach(function () {
        $httpBackend.whenDELETE(/cashbag-promotions/).respond({ done: true });
      });

      it('should DELETE a promotion from API', function() {
        manualEposPromotion.deleteManualEposPromotion(95);
        $httpBackend.expectDELETE(/cashbag-promotions/);
        $httpBackend.flush();
      });
    });
  });
});