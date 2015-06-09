'use strict';

describe('Service: cashBagService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var cashBagService;
  beforeEach(inject(function (_cashBagService_) {
    cashBagService = _cashBagService_;
  }));

  it('should do something', function () {
    expect(!!cashBagService).toBe(true);
  });

});
