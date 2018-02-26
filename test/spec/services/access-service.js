'use strict';

describe('Service: accessService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var accessService;
  beforeEach(inject(function (_accessService_) {
    accessService = _accessService_;
  }));

  it('should do something', function () {
    expect(!!accessService).toBe(true);
  });

});
