'use strict';

describe('Factory: cashBagFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var cashBagFactory,
    cashBagService,
    GlobalMenuService,
    stationsService,
    schedulesService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _cashBagFactory_, _cashBagService_, _GlobalMenuService_, _stationsService_, _schedulesService_) {
    cashBagService = _cashBagService_;
    GlobalMenuService = _GlobalMenuService_;
    stationsService = _stationsService_;
    schedulesService = _schedulesService_;

    spyOn(cashBagService, 'getCashBagList');
    spyOn(GlobalMenuService.company, 'get');
    spyOn(stationsService, 'getStationList');
    spyOn(schedulesService, 'getSchedules');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    cashBagFactory = _cashBagFactory_;
  }));

  var companyId = '403';
  it('should be defined', function () {
    expect(!!cashBagFactory).toBe(true);
  });

  describe('cashBagService API', function () {
    it('should call cashBagService on getCashBagList', function () {
      cashBagFactory.getCashBagList(companyId);
      expect(cashBagService.getCashBagList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('stationsService API', function () {
    it('should call stationsService on getStationService', function () {
      cashBagFactory.getStationList(companyId);
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('schedulesService API', function () {
    it('should call schedulesService on getSchedules', function () {
      cashBagFactory.getSchedulesList(companyId);
      expect(schedulesService.getSchedules).toHaveBeenCalledWith(companyId);
    });
  });

  describe('GlobalMenuService API', function () {
    it('should call globalMenuService on company.get', function () {
      cashBagFactory.getCompanyId();
      expect(GlobalMenuService.company.get).toHaveBeenCalled();
    });
  });


});
