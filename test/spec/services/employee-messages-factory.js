'use strict';

describe('Factory: employeeMessagesFactory', function () {

  beforeEach(module('ts5App'));

  var employeeMessagesFactory,
    employeeMessagesService,
    schedulesService,
    employeesService,
    stationsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _employeeMessagesFactory_, _employeeMessagesService_,
                              _schedulesService_, _employeesService_, _stationsService_) {
    employeeMessagesService = _employeeMessagesService_;
    schedulesService = _schedulesService_;
    employeesService = _employeesService_;
    stationsService = _stationsService_;

    spyOn(employeeMessagesService, 'getEmployeeMessages');
    spyOn(employeeMessagesService, 'getEmployeeMessage');
    spyOn(employeeMessagesService, 'createEmployeeMessage');
    spyOn(employeeMessagesService, 'editEmployeeMessage');
    spyOn(schedulesService, 'getSchedules');
    spyOn(employeesService, 'getEmployees');
    spyOn(stationsService, 'getGlobalStationList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    employeeMessagesFactory = _employeeMessagesFactory_;
  }));

  it('should be defined', function () {
    expect(!!employeeMessagesFactory).toBe(true);
  });

  describe('employeeMessagesService API', function () {
    it('should call employeeMessagesService on getCommissionPayableList', function () {
      employeeMessagesFactory.getEmployeeMessages();
      expect(employeeMessagesService.getEmployeeMessages).toHaveBeenCalled();
    });
    it('should call employeeMessagesService on getCommissionPayableData', function () {
      employeeMessagesFactory.getEmployeeMessage(123);
      expect(employeeMessagesService.getEmployeeMessage).toHaveBeenCalledWith(123);
    });
    it('should call employeeMessagesService on createCommissionData', function () {
      employeeMessagesFactory.createEmployeeMessage({});
      expect(employeeMessagesService.createEmployeeMessage).toHaveBeenCalled();
    });
    it('should call employeeMessagesService on updateCommissionData', function () {
      employeeMessagesFactory.editEmployeeMessage(123, {});
      expect(employeeMessagesService.editEmployeeMessage).toHaveBeenCalled();
    });
  });

  describe('schedulesService API', function () {
    it('should call schedulesService on getSchedules', function () {
      employeeMessagesFactory.getSchedules();
      expect(schedulesService.getSchedules).toHaveBeenCalled();
    });
  });

  describe('employeesService API', function () {
    it('should call getCompany', function () {
      employeeMessagesFactory.getEmployees();
      expect(employeesService.getEmployees).toHaveBeenCalled();
    });
  });

  describe('stationsService API', function () {
    it('should call getDetailedCompanyCurrencies', function () {
      employeeMessagesFactory.getStations();
      expect(stationsService.getGlobalStationList).toHaveBeenCalled();
    });
  });

});
