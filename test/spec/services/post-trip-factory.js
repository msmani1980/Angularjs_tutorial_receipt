'use strict';

describe('Factory: postTripFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var postTripFactory,
    postTripService,
    GlobalMenuService,
    stationsService,
    carrierService,
    employeesService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _postTripFactory_, _GlobalMenuService_, _stationsService_, _carrierService_, _postTripService_, _employeesService_) {
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;
    carrierService = _carrierService_;
    postTripService = _postTripService_;
    employeesService = _employeesService_;

    spyOn(postTripService, 'getPostTrips');
    spyOn(postTripService, 'createPostTrip');
    spyOn(postTripService, 'updatePostTrip');
    spyOn(postTripService, 'deletePostTrip');
    spyOn(postTripService, 'getPostTrip');
    spyOn(postTripService, 'importFromExcel');
    spyOn(GlobalMenuService.company, 'get');
    spyOn(stationsService, 'getGlobalStationList');
    spyOn(carrierService, 'getCarrierTypes');
    spyOn(carrierService, 'getCarrierNumbers');
    spyOn(employeesService, 'getEmployees');

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
      expect(postTripService.getPostTrips).toHaveBeenCalledWith(companyId);
    });
    it('should call postTripService on getPostTrip', function () {
      postTripFactory.getPostTrip(companyId, '123');
      expect(postTripService.getPostTrip).toHaveBeenCalled();
    });
    it('should call postTripService on createPostTrip', function () {
      postTripFactory.createPostTrip(companyId, {});
      expect(postTripService.createPostTrip).toHaveBeenCalled();
    });
    it('should call postTripService on updatePostTrip', function () {
      postTripFactory.updatePostTrip('123', {});
      expect(postTripService.updatePostTrip).toHaveBeenCalled();
    });
    it('should call postTripService on deletePostTrip', function () {
      postTripFactory.deletePostTrip(companyId, '123');
      expect(postTripService.deletePostTrip).toHaveBeenCalled();
    });
    it('should call postTripService on uploadPostTrip', function () {
      postTripFactory.uploadPostTrip(companyId, null, null, null);
      expect(postTripService.importFromExcel).toHaveBeenCalled();
    });
  });

  describe('stationsService API', function () {
    it('should call stationsService on getStationService', function () {
      postTripFactory.getStationList(companyId);
      expect(stationsService.getGlobalStationList).toHaveBeenCalledWith({companyId: companyId});
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

  describe('employeesService API', function () {
    it('should call employeesService on getEmployees', function () {
      postTripFactory.getEmployees(companyId);
      expect(employeesService.getEmployees).toHaveBeenCalledWith(companyId);
    });
  });

});
