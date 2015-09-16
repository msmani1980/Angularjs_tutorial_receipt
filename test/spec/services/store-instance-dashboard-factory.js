'use strict';

describe('Service: storeInstanceDashboardFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/store-instance.json'));

  // instantiate service
  var catererStationService;
  var scope;
  var storeInstanceDashboardFactory;

  beforeEach(inject(function (_storeInstanceDashboardFactory_, $injector, $rootScope) {
    storeInstanceDashboardFactory = _storeInstanceDashboardFactory_;
    catererStationService = $injector.get('catererStationService');
    scope = $rootScope.$new();

    spyOn(catererStationService, 'getCatererStationList');

  }));

  describe('catererStationService calls', function () {
    it('should call getCatererStationList', function () {
      storeInstanceDashboardFactory.getCatererStationList();
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });
  });

});
