'use strict';

describe('Service: eulaService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var eulaService;
  beforeEach(inject(function (_eulaService_) {
    eulaService = _eulaService_;
  }));

  it('should do something', function () {
    expect(!!eulaService).toBe(true);
  });

});
