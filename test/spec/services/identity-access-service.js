'use strict';

describe('Service: identityAccessService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var identityAccessService;
  beforeEach(inject(function (_identityAccessService_) {
    identityAccessService = _identityAccessService_;
  }));

  it('should do something', function () {
    expect(!!identityAccessService).toBe(true);
  });

});
