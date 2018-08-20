'use strict';

describe('Service: routeTaxRatesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var routeTaxRatesService;
  beforeEach(inject(function (_routeTaxRatesService_) {
    routeTaxRatesService = _routeTaxRatesService_;
  }));

  it('should do something', function () {
    expect(!!routeTaxRatesService).toBe(true);
  });

});
