'use strict';

describe('Factory: manualECSFactory', function () {

  beforeEach(module('ts5App'));

  var manualECSFactory,
    catererStationService,
    storeInstanceService,
    carrierInstancesService,
    stationsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _catererStationService_, _storeInstanceService_, _carrierInstancesService_, _manualECSFactory_, _stationsService_) {
    catererStationService = _catererStationService_;
    storeInstanceService = _storeInstanceService_;
    carrierInstancesService = _carrierInstancesService_;
    stationsService = _stationsService_;

    spyOn(carrierInstancesService, 'getCarrierInstances');
    spyOn(carrierInstancesService, 'updateCarrierInstance');
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stationsService, 'getStationList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    manualECSFactory = _manualECSFactory_;
  }));

  it('should be defined', function () {
    expect(!!manualECSFactory).toBe(true);
  });

  describe('exciseDutyService API', function () {
    it('should call carrierInstancesService on getCarrierInstances', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      manualECSFactory.getCarrierInstanceList(mockPayload);
      expect(carrierInstancesService.getCarrierInstances).toHaveBeenCalledWith(mockPayload);
    });

    it('should call exciseDutyService on updateExciseDuty', function () {
      var fakeId = 123;
      var fakePayload = { fakeKey: 'fakeValue' };
      manualECSFactory.updateCarrierInstance(fakeId, fakePayload);
      expect(carrierInstancesService.updateCarrierInstance).toHaveBeenCalledWith(fakeId, fakePayload);
    });
  });

  describe('storeInstanceService API', function () {
    it('should call storeInstanceService on getStoreInstancesList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      manualECSFactory.getStoreInstanceList(mockPayload);
      expect(storeInstanceService.getStoreInstancesList).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('catererStationService API', function () {
    it('should call catererStationService on getCatererStationList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      manualECSFactory.getCatererStationList(mockPayload);
      expect(catererStationService.getCatererStationList).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('catererStationService API', function () {
    it('should call stationsService on getCatererStationList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      manualECSFactory.getCompanyStationList(mockPayload);
      expect(stationsService.getStationList).toHaveBeenCalledWith(mockPayload);
    });
  });

});
