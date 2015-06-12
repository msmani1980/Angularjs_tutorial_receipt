// TODO: Add in test cases for business logic regarding station constraints like start / end date
'use strict';

describe('Schedules Service', function () {

  var schedulesService,
    $httpBackend,
    schedulesJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/schedules.json'));

  beforeEach(inject(function (_schedulesService_, $injector) {
    inject(function (_servedSchedules_) {
      schedulesJSON = _servedSchedules_;
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
        $httpBackend.whenGET(/schedules/).respond(schedulesJSON);

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
  });
});
