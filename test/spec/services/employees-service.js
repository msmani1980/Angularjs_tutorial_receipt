'use strict';

describe('Employees Service', function () {

  var employeesService,
    $httpBackend,
    employeesJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/employees.json'));

  beforeEach(inject(function (_employeesService_, $injector) {
    inject(function (_servedEmployees_) {
      employeesJSON = _servedEmployees_;
    });
    employeesService = _employeesService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(employeesService).toBeDefined();
  });

  describe('API calls', function () {

    describe('getEmployees', function () {
      it('should be accessible', function () {
        expect(!!employeesService.getEmployees).toBe(true);
      });

      var employeeData;
      var companyId = 413;
      beforeEach(function () {
        $httpBackend.whenGET(/employees/).respond(employeesJSON);

        employeesService.getEmployees(companyId).then(function (dataFromAPI) {
          employeeData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(employeeData.companyEmployees)).toBe('[object Array]');
      });

      it('should have a company id as payload', function () {
        var regex = new RegExp('/companies/' + companyId + '/employees', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        employeesService.getEmployees(companyId);
        $httpBackend.flush();
      });
    });
  });
});
