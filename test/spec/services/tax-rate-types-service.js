'use strict';

describe('Service: taxRateTypesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var taxRateTypesService;
  beforeEach(inject(function (_taxRateTypesService_) {
    taxRateTypesService = _taxRateTypesService_;
  }));

  it('should do something', function () {
    expect(!!taxRateTypesService).toBe(true);
  });

});
