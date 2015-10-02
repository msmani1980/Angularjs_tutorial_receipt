'use strict';

describe('Service: discountFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var discountFactory;
  beforeEach(inject(function (_discountFactory_) {
    discountFactory = _discountFactory_;
  }));

  it('should do something', function () {
    expect(!!discountFactory).toBe(true);
  });

});
