'use strict';

describe('Factory: storeInstanceAmendFactory', function () {

  beforeEach(module('ts5App'));

  var storeInstanceAmendFactory;
  var rootScope;
  var scope;
  var cashBagService;
  var itemsService;
  var storeInstanceAmendService;

  beforeEach(inject(function ($rootScope, _storeInstanceAmendFactory_, _cashBagService_, _storeInstanceAmendService_, _itemsService_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    storeInstanceAmendFactory = _storeInstanceAmendFactory_;
    cashBagService = _cashBagService_;
    storeInstanceAmendService = _storeInstanceAmendService_;
    itemsService = _itemsService_;

    spyOn(cashBagService, 'getCashBagVerifications').and.stub();
    spyOn(cashBagService, 'getCashBagCarrierInstances').and.stub();
    spyOn(cashBagService, 'deleteCashBag').and.stub();
    spyOn(storeInstanceAmendService, 'movePostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'getPostTrips').and.stub();
    spyOn(storeInstanceAmendService, 'addPostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'editPostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'editTemporaryPostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'deletePostTrip').and.stub();
    spyOn(storeInstanceAmendService, 'deleteTemporaryPostTrip').and.stub();
    spyOn(cashBagService, 'getAllManualCashList');
    spyOn(cashBagService, 'getManualCashBagList');
    spyOn(cashBagService, 'getEposSales');
    spyOn(itemsService, 'getItemsList');
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
      expect(!!storeInstanceAmendFactory.getCashBagEposSales).toBe(true);
    });

    it('getCashBags should call cashBagService', function () {
      var payload = {
        companyId: 1,
        storeInstanceId: 2
      };

      storeInstanceAmendFactory.getCashBags(payload);
      expect(cashBagService.getCashBagVerifications).toHaveBeenCalledWith(payload);
    });

    it('should call cashBagService getAllManualCashList on getCashBagManualData with cash type', function () {
      var fakePayload = { fakeKey: 'fakeValue' };
      storeInstanceAmendFactory.getCashBagManualData('cash', fakePayload);
      expect(cashBagService.getAllManualCashList).toHaveBeenCalledWith(fakePayload);
    });

    it('should call cashBagService getManualCashBagList on getCashBagManualData', function () {
      var fakePayload = { fakeKey: 'fakeValue' };
      storeInstanceAmendFactory.getCashBagManualData('credit', fakePayload);
      expect(cashBagService.getManualCashBagList).toHaveBeenCalledWith('credit', fakePayload);
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
    it('addFlightSector should call storeInstanceAmendService', function () {
      var cashBagId = 1;
      var postTripId = 2;

      storeInstanceAmendFactory.addFlightSector(cashBagId, postTripId);
      expect(storeInstanceAmendService.addPostTrip).toHaveBeenCalledWith(cashBagId, postTripId);
    });
    it('editFlightSector should call storeInstanceAmendService editPostTrip for real post trips', function () {
      var cashBagId = 1;
      var postTripId = 2;
      var newPostTripId = 3;
      var isTemporary = false;

      storeInstanceAmendFactory.editFlightSector(cashBagId, postTripId, newPostTripId, isTemporary);
      expect(storeInstanceAmendService.editPostTrip).toHaveBeenCalledWith(cashBagId, postTripId, newPostTripId);
    });
    it('editFlightSector should call storeInstanceAmendService editTemporaryPostTrip for temporary post trips', function () {
      var cashBagId = 1;
      var postTripId = 2;
      var newPostTripId = 3;
      var isTemporary = true;

      storeInstanceAmendFactory.editFlightSector(cashBagId, postTripId, newPostTripId, isTemporary);
      expect(storeInstanceAmendService.editTemporaryPostTrip).toHaveBeenCalledWith(cashBagId, postTripId, newPostTripId);
    });
    it('deleteFlightSector should call storeInstanceAmendService deletePostTrip for real post trips', function () {
      var cashBagId = 1;
      var postTripId = 2;
      var isTemporary = false;

      storeInstanceAmendFactory.deleteFlightSector(cashBagId, postTripId, isTemporary);
      expect(storeInstanceAmendService.deletePostTrip).toHaveBeenCalledWith(cashBagId, postTripId);
    });
    it('deleteFlightSector should call storeInstanceAmendService deleteTemporaryPostTrip for real post trips', function () {
      var cashBagId = 1;
      var postTripId = 2;
      var isTemporary = true;

      storeInstanceAmendFactory.deleteFlightSector(cashBagId, postTripId, isTemporary);
      expect(storeInstanceAmendService.deleteTemporaryPostTrip).toHaveBeenCalledWith(cashBagId, postTripId);
    });
    it('getFlightSector should call storeInstanceAmendService', function () {
      var cashBagId = 1;

      storeInstanceAmendFactory.getFlightSectors(cashBagId);
      expect(storeInstanceAmendService.getPostTrips).toHaveBeenCalledWith(cashBagId);
    });

    it('getCashBagEposSales should call cashBagSerivce', function () {
      var cashBagId = 1;

      storeInstanceAmendFactory.getCashBagEposSales(cashBagId);
      expect(cashBagService.getEposSales).toHaveBeenCalledWith(cashBagId);
    });

    it('getItemsList shoudl call itemSericee', function () {
      var fakePayload = {fakeKey: 'fakeValue'};
      storeInstanceAmendFactory.getMasterItemList(fakePayload);
      expect(itemsService.getItemsList).toHaveBeenCalledWith(fakePayload, true);
    });
  });

});
