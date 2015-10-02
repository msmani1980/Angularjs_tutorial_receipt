'use strict';

describe('Service: discountService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var discountService;
  beforeEach(inject(function (_discountService_) {
    discountService = _discountService_;
  }));

  it('should do something', function () {
    expect(!!discountService).toBe(true);
  });

});
