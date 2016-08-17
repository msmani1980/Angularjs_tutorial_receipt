'use strict';

describe('Service: scheduledReportsService', function () {
	  var scheduledReportsService;
	  var httpBackend;
	  beforeEach(module('ts5App'));

	  beforeEach(inject(function (_scheduledReportsService_, $injector) {
	    scheduledReportsService = _scheduledReportsService_;
	    httpBackend = $injector.get('$httpBackend');
	  }));

	  describe('API calls', function () {
	    describe('getAll', function () {
	      it('should make GET request to API', function () {
	        var expectedURL = '/report-api/scheduleReport';
	        httpBackend.expectGET(expectedURL).respond(200, {});
	      });
	    });
	  });
});
