'use strict';

describe('Factory: postTripFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var postTripFactory,
    postTripService,
    globalMenuService,
    stationsService,
    carrierService,
    employeesService,
    schedulesService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _postTripFactory_, _globalMenuService_, _stationsService_, _carrierService_, _postTripService_, _employeesService_, _schedulesService_) {
    globalMenuService = _globalMenuService_;
    stationsService = _stationsService_;
    carrierService = _carrierService_;
    postTripService = _postTripService_;
    employeesService = _employeesService_;
    schedulesService = _schedulesService_;

    spyOn(postTripService, 'getPostTrips');
    spyOn(postTripService, 'createPostTrip');
    spyOn(postTripService, 'updatePostTrip');
    spyOn(postTripService, 'deletePostTrip');
    spyOn(postTripService, 'getPostTrip');
    spyOn(postTripService, 'importFromExcel');
    spyOn(globalMenuService.company, 'get').and.returnValue(403);
    spyOn(stationsService, 'getStationList');
    spyOn(carrierService, 'getCarrierTypes');
    spyOn(carrierService, 'getCarrierNumbers');
    spyOn(employeesService, 'getEmployees');
    spyOn(schedulesService, 'getSchedules');

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
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId);
    });

    it('should take optional offset', function () {
      var offset = 20;
      postTripFactory.getStationList(companyId, offset);
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId, offset);
    });
  });

  describe('globalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      postTripFactory.getCompanyId();
      expect(globalMenuService.company.get).toHaveBeenCalled();
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
      postTripFactory.getEmployees(companyId, { search: 'something' });
      expect(employeesService.getEmployees).toHaveBeenCalledWith(companyId, { search: 'something' });
    });
  });

  describe('schedulesService API', function () {
    it('should call schedulesService on getSchedules', function () {
      postTripFactory.getSchedules(companyId);
      expect(schedulesService.getSchedules).toHaveBeenCalledWith(companyId);
    });
  });

});
