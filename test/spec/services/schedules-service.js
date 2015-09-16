'use strict';

describe('Schedules Service', function () {

  var schedulesService;
  var httpBackend;

  beforeEach(module('ts5App'));

  beforeEach(inject(function (_schedulesService_, $injector) {
    schedulesService = _schedulesService_;
    httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('API calls', function () {
    describe('getSchedules', function () {
      it('should make GET request to API', function () {
        var expectedURL = /companies\/\d+\/schedules\/distinct/;
        var mockCompanyId = 4;
        httpBackend.expectGET(expectedURL).respond(200, {});
        schedulesService.getSchedules(mockCompanyId).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

    describe('getDailySchedules', function () {
      it('should make GET request to API', function () {
        var expectedURL = /companies\/\d+\/schedules\/daily/;
        var mockCompanyId = 4;
        var mockScheduleNumber = 'ABC1234';
        var mockScheduleDate = '20150909';
        httpBackend.expectGET(expectedURL).respond(200, {});
        schedulesService.getDailySchedules(mockCompanyId, mockScheduleNumber, mockScheduleDate).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });

    describe('getSchedulesInDateRange', function(){
      it('should make GET request to API', function () {
        var expectedURL = /companies\/\d+\/schedules/;
        var mockCompanyId = 4;
        var mockDate = '20150909';
        httpBackend.expectGET(expectedURL).respond(200, {});
        schedulesService.getSchedulesInDateRange(mockCompanyId, mockDate, mockDate).then(function (response) {
          expect(response).toBeDefined();
        });
        httpBackend.flush();
      });
    });
  });
});
