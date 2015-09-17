'use strict';

describe('Service: storeInstanceDashboardFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));

  // instantiate service
  var catererStationService;
  var storeInstanceService;
  var storesService;
  var scope;
  var storeInstanceDashboardFactory;

  beforeEach(inject(function (_storeInstanceDashboardFactory_, $injector, $rootScope) {
    storeInstanceDashboardFactory = _storeInstanceDashboardFactory_;
    catererStationService = $injector.get('catererStationService');
    storeInstanceService = $injector.get('storeInstanceService');
    storesService = $injector.get('storesService');
    scope = $rootScope.$new();

    spyOn(catererStationService, 'getCatererStationList');
    spyOn(storeInstanceService, 'getStoreInstancesList');
    spyOn(storesService, 'getStoresList');



  }));

  describe('catererStationService calls', function () {
    it('should call getCatererStationList', function () {
      storeInstanceDashboardFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

  describe('storeInstanceService calls', function () {
    it('should call getStoreInstancesList', function () {
      var fakePayload = {fakeKey: 'fakeValue'};
      storeInstanceDashboardFactory.getStoreInstanceList(fakePayload);
      expect(storeInstanceService.getStoreInstancesList).toHaveBeenCalledWith(fakePayload);
    });
  });

  describe('storesService calls', function () {
    it('should call getStoresList', function () {
      var fakePayload = {fakeKey: 'fakeValue'};
      storeInstanceDashboardFactory.getStoresList(fakePayload);
      expect(storesService.getStoresList).toHaveBeenCalledWith(fakePayload);
    });
  });

});
