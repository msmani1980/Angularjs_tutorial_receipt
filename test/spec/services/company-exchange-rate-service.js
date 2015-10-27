'use strict';

describe('Service: companyExchangeRateService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyExchangeRateService;
  beforeEach(inject(function (_companyExchangeRateService_) {
    companyExchangeRateService = _companyExchangeRateService_;
  }));

  it('should do something', function () {
    expect(!!companyExchangeRateService).toBe(true);
  });

});
