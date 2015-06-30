'use strict';

describe('Factory: postTripFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var postTripFactory,
    postTripsService,
    GlobalMenuService,
    stationsService,
    carrierService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _postTripFactory_, _GlobalMenuService_, _stationsService_, _carrierService_, _postTripsService_) {
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;
    carrierService = _carrierService_;
    postTripsService = _postTripsService_;

    spyOn(postTripsService, 'getPostTrips');
    spyOn(postTripsService, 'createPostTrip')
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
      postTripFactory.getPostTripDataList(companyId);
      expect(postTripsService.getPostTrips).toHaveBeenCalledWith(companyId);
    });
    it('should call postTripService on createPostTrip', function(){
      postTripFactory.createPostTrip(companyId, {});
      expect(postTripsService.createPostTrip).toHaveBeenCalled();
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
