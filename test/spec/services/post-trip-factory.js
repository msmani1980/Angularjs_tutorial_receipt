'use strict';

describe('Factory: cashBagFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var postTripFactory,
    GlobalMenuService,
    stationsService,
    carrierService,
    schedulesService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _postTripFactory_, _GlobalMenuService_, _stationsService_, _carrierService_) {
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;
    carrierService = _carrierService_;

    spyOn(GlobalMenuService.company, 'get');
    spyOn(stationsService, 'getStationList');
    spyOn(carrierService, 'getCarrierTypes');
    spyOn(carrierService, 'getCarrierNumbers');

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

  describe('carrierService API', function () {
    it('should call carrierService on getCarrierType', function () {
      postTripFactory.getCarrierTypes(companyId);
      expect(carrierService.getCarrierTypes).toHaveBeenCalledWith(companyId);
    });
    it('should call carrierService on getCarrierNumber', function () {
      var carrierType = 2;
      postTripFactory.getCarrierNumbers(companyId, carrierType);
      expect(carrierService.getCarrierNumbers).toHaveBeenCalledWith(companyId, carrierType);
    });
  });

});
