'use strict';

describe('Service: storeInstanceDashboardFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));

  // instantiate service
  var catererStationService;
  var stationsService;
  var storeInstanceService;
  var storesService;
  var recordsService;
  var scope;
  var storeInstanceDashboardFactory;

  beforeEach(inject(function (_storeInstanceDashboardFactory_, $injector, $rootScope) {
    storeInstanceDashboardFactory = _storeInstanceDashboardFactory_;
    catererStationService = $injector.get('catererStationService');
    stationsService = $injector.get('stationsService');
    storeInstanceService = $injector.get('storeInstanceService');
    storesService = $injector.get('storesService');
    recordsService = $injector.get('recordsService');
    scope = $rootScope.$new();

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(stationsService, 'getGlobalStationList');
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(storeInstanceService, 'getStoreInstance');
    spyOn(storeInstanceService, 'updateStoreInstanceStatus');
    spyOn(storesService, 'getStoresList');
    spyOn(recordsService, 'getStoreStatusList');
    spyOn(recordsService, 'getFeatures');

  }));

  describe('catererStationService calls', function () {
    it('should call getCatererStationList', function () {
      storeInstanceDashboardFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('stationsService calls', function () {
    it('should call getStationList', function () {
      storeInstanceDashboardFactory.getStationList();
      expect(stationsService.getGlobalStationList).toHaveBeenCalled();
    });
  });

  describe('storeInstanceService calls', function () {
    it('should call getStoreInstancesList', function () {
      var fakePayload = {fakeKey: 'fakeValue'};
      storeInstanceDashboardFactory.getStoreInstanceList(fakePayload);
      expect(storeInstanceService.getStoreInstancesList).toHaveBeenCalledWith(fakePayload);
    });

    it('should call getStoreInstance', function () {
      var fakeStoreId = 1;
      storeInstanceDashboardFactory.getStoreInstance(fakeStoreId);
      expect(storeInstanceService.getStoreInstance).toHaveBeenCalledWith(fakeStoreId);
    });

    it('should call updateStoreInstanceStatus', function () {
      var fakeStoreId = 1;
      var fakeStatusName = '3';
      storeInstanceDashboardFactory.updateStoreInstanceStatus(fakeStoreId, fakeStatusName);
      expect(storeInstanceService.updateStoreInstanceStatus).toHaveBeenCalledWith(fakeStoreId, fakeStatusName);
    });
  });

  describe('storesService calls', function () {
    it('should call getStoresList', function () {
      var fakePayload = {fakeKey: 'fakeValue'};
      storeInstanceDashboardFactory.getStoresList(fakePayload);
      expect(storesService.getStoresList).toHaveBeenCalledWith(fakePayload);
    });
  });

  describe('recordsService calls', function () {
    it('should call getStoreStatusList', function () {
      storeInstanceDashboardFactory.getStatusList();
      expect(recordsService.getStoreStatusList).toHaveBeenCalled();
    });
    it('should call getFeatures', function () {
      storeInstanceDashboardFactory.getFeaturesList();
      expect(recordsService.getFeatures).toHaveBeenCalled();
    });
  });

});
