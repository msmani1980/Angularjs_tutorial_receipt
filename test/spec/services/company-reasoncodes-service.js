'use strict';

describe('Service: companyReasoncodesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReasoncodesService;
  beforeEach(inject(function (_companyReasoncodesService_) {
    companyReasoncodesService = _companyReasoncodesService_;
  }));

  it('should do something', function () {
    expect(!!companyReasoncodesService).toBe(true);
  });

});
