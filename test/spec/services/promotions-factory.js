'use strict';

describe('Service: promotionsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionsFactory;
  beforeEach(inject(function (_promotionsFactory_) {
    promotionsFactory = _promotionsFactory_;
  }));

  it('should do something', function () {
    expect(!!promotionsFactory).toBe(true);
  });

});
