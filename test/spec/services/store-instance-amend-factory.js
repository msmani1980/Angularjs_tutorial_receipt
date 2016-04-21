'use strict';

describe('Factory: storeInstanceAmendFactory', function () {

  beforeEach(module('ts5App'));

  var storeInstanceAmendFactory;
  var rootScope;
  var scope;
  var cashBagService;
  var storeInstanceAmendService;

  beforeEach(inject(function ($rootScope, _storeInstanceAmendFactory_, _cashBagService_, _storeInstanceAmendService_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    storeInstanceAmendFactory = _storeInstanceAmendFactory_;
    cashBagService = _cashBagService_;
    storeInstanceAmendService = _storeInstanceAmendService_;

    spyOn(cashBagService, 'getCashBagList').and.stub();
    spyOn(cashBagService, 'getCashBagCarrierInstances').and.stub();
    spyOn(cashBagService, 'deleteCashBag').and.stub();
    spyOn(storeInstanceAmendService, 'movePostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'getPostTrips').and.stub();
  }));

  it('should be defined', function () {
    expect(!!storeInstanceAmendFactory).toBe(true);
  });

  describe('API calls', function () {
    it('should be accessible in the service', function () {
      expect(!!storeInstanceAmendFactory.getCashBagListMockData).toBe(true);
      expect(!!storeInstanceAmendFactory.getStoreInstancesMockData).toBe(true);
      expect(!!storeInstanceAmendFactory.getScheduleMockData).toBe(true);
      expect(!!storeInstanceAmendFactory.getCashBags).toBe(true);
      expect(!!storeInstanceAmendFactory.getFlightSectors).toBe(true);
      expect(!!storeInstanceAmendFactory.deleteCashBag).toBe(true);
    });

    it('getCashBags should call cashBagService', function () {
      var payload = {
        companyId: 1,
        isReconciliation: true,
        storeInstanceId: 2
      };

      storeInstanceAmendFactory.getCashBags(payload);
      expect(cashBagService.getCashBagList).toHaveBeenCalledWith(payload.companyId, payload);
    });

    it('getCashBagCarrierInstances should call cashBagService', function () {
      var cashBagId = 1;

      storeInstanceAmendFactory.getFlightSectors(cashBagId);
      expect(storeInstanceAmendService.getPostTrips).toHaveBeenCalledWith(cashBagId);
    });

    it('deleteCashBag should call cashBagService', function () {
      var cashBagId = 1;

      storeInstanceAmendFactory.deleteCashBag(cashBagId);
      expect(cashBagService.deleteCashBag).toHaveBeenCalledWith(cashBagId);
    });

    it('rearrangeFlightSector should call storeInstanceAmendService', function () {
      var originCashBagId = 1;
      var targetCashBagId = 2;
      var postTripId = 3;

      storeInstanceAmendFactory.rearrangeFlightSector(originCashBagId, targetCashBagId, postTripId);
      expect(storeInstanceAmendService.movePostTrip).toHaveBeenCalledWith(originCashBagId, targetCashBagId, postTripId);
    });
  });

});
