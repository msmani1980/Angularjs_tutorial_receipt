'use strict';

describe('Service: scheduledReportsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var scheduledReportsService;
  beforeEach(inject(function (_scheduledReportsService_) {
    scheduledReportsService = _scheduledReportsService_;
  }));

  it('should do something', function () {
    expect(!!scheduledReportsService).toBe(true);
  });

});
