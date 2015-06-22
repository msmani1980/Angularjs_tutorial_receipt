'use strict';

describe('Factory: cashBagFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var postTripFactory,
    GlobalMenuService,
    stationsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _postTripFactory_, _GlobalMenuService_, _stationsService_) {
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;

    spyOn(GlobalMenuService.company, 'get');
    spyOn(stationsService, 'getStationList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    postTripFactory = _postTripFactory_;
  }));

  var companyId = '403';
  it('should be defined', function () {
    expect(!!postTripFactory).toBe(true);
  });

  describe('postTripService API', function () {
    it('should call postTripService on getPostTripDataList', function () {
      //cashBagFactory.getCashBagList(companyId);
      //expect(cashBagService.getCashBagList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('stationsService API', function () {
    it('should call stationsService on getStationService', function () {
      postTripFactory.getStationList(companyId);
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('GlobalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      postTripFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });

});
