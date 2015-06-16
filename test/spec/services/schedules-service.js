// TODO: Add in test cases for business logic regarding station constraints like start / end date
'use strict';

describe('Schedules Service', function () {

  var schedulesService,
    $httpBackend,
    schedulesJSON,
    dailySchedulesJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/schedules.json'));
  beforeEach(module('served/schedules-daily.json'));

  beforeEach(inject(function (_schedulesService_, $injector) {
    inject(function (_servedSchedules_, _servedSchedulesDaily_) {
      schedulesJSON = _servedSchedules_;
      dailySchedulesJSON = _servedSchedulesDaily_;
    });
    schedulesService = _schedulesService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(schedulesService).toBeDefined();
  });

  describe('API calls', function () {

    describe('getSchedules', function () {
      it('should be accessible in the controller', function () {
        expect(!!schedulesService.getSchedules).toBe(true);
      });

      var schedulesData;
      beforeEach(function () {
        $httpBackend.whenGET(/distinct/).respond(schedulesJSON);

        schedulesService.getSchedules().then(function (dataFromAPI) {
          schedulesData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(schedulesData.distinctSchedules)).toBe('[object Array]');
      });

      it('should have a company id as payload', function () {
        var companyId = 413;
        var regex = new RegExp('/companies/' + companyId + '/schedules/distinct', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        schedulesService.getSchedules(companyId);
        $httpBackend.flush();
      });

      it('should have companyId property', function () {
        expect(schedulesData.distinctSchedules[0].companyId).not.toBe(null);
      });

      it('should have scheduleNumber property', function () {
        expect(schedulesData.distinctSchedules[0].scheduleNumber).not.toBe(null);
      });
    });

    describe('getDailySchedules', function () {
      it('should be accessible in the controller', function () {
        expect(!!schedulesService.getDailySchedules).toBe(true);
      });

      var dailySchedulesData;
      beforeEach(function () {
        $httpBackend.whenGET(/daily/).respond(dailySchedulesJSON);
        schedulesService.getDailySchedules().then(function (dataFromAPI) {
          dailySchedulesData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(dailySchedulesData.schedules)).toBe('[object Array]');
      });

      it('should have id property', function () {
        expect(dailySchedulesData.schedules[0].id).not.toBe(null);
      });
    });
    describe('daily schedules API parameters', function () {
      it('should have a company id as payload', function () {
        var companyId = 413;
        var regex = new RegExp('/companies/' + companyId + '/schedules/daily', 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        schedulesService.getDailySchedules(companyId);
        $httpBackend.flush();
      });

      it('should have a schedule number as payload', function () {
        var scheduleNumber = '123';
        var regex = new RegExp('/daily\\?\.\*scheduleNumber=' + scheduleNumber, 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        schedulesService.getDailySchedules('413', scheduleNumber, '20150602');
        $httpBackend.flush();
      });

      it('should have a schedule date as payload', function () {
        var scheduleDate = '20150602';
        var regex = new RegExp('/daily\\?\.\*scheduleDate=' + scheduleDate, 'g');
        $httpBackend.expectGET(regex).respond(200, '');
        schedulesService.getDailySchedules('413', '123', scheduleDate);
        $httpBackend.flush();
      });
    });
  });
});
