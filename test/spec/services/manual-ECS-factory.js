'use strict';

describe('Factory: manualECSFactory', function () {

  beforeEach(module('ts5App'));

  var manualECSFactory,
    catererStationService,
    storeInstanceService,
    carrierInstancesService,
    stationsService,
    recordsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _catererStationService_, _storeInstanceService_, _carrierInstancesService_, _manualECSFactory_, _stationsService_, _recordsService_) {
    catererStationService = _catererStationService_;
    storeInstanceService = _storeInstanceService_;
    carrierInstancesService = _carrierInstancesService_;
    stationsService = _stationsService_;
    recordsService = _recordsService_;

    spyOn(carrierInstancesService, 'getCarrierInstances');
    spyOn(carrierInstancesService, 'updateCarrierInstance');
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stationsService, 'getStationList');
    spyOn(recordsService, 'getStoreStatusList');

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
      var mockCompanyId = 123;
      var offset = 0;
      manualECSFactory.getCompanyStationList(mockCompanyId, offset);
      expect(stationsService.getStationList).toHaveBeenCalledWith(mockCompanyId, offset);
    });
  });

  describe('recordsService API', function () {
    it('should call recordsService on getStoreStatusList', function () {
      manualECSFactory.getStoreStatusList();
      expect(recordsService.getStoreStatusList).toHaveBeenCalled();
    });
  });

});
