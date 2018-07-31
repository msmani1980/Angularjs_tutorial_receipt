'use strict';

describe('Service: routeTaxRatesFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var routeTaxRatesFactory;
  beforeEach(inject(function (_routeTaxRatesFactory_) {
    routeTaxRatesFactory = _routeTaxRatesFactory_;
  }));

  it('should do something', function () {
    expect(!!routeTaxRatesFactory).toBe(true);
  });

});
