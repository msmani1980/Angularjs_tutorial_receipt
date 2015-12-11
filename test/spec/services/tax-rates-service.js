'use strict';

describe('Service: taxRatesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var taxRatesService;
  beforeEach(inject(function (_taxRatesService_) {
    taxRatesService = _taxRatesService_;
  }));

  it('should do something', function () {
    expect(!!taxRatesService).toBe(true);
  });

});
