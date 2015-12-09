'use strict';

describe('Service: taxRatesFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var taxRatesFactory;
  beforeEach(inject(function (_taxRatesFactory_) {
    taxRatesFactory = _taxRatesFactory_;
  }));

  it('should do something', function () {
    expect(!!taxRatesFactory).toBe(true);
  });

});
