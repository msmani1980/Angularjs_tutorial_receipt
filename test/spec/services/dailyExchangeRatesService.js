'use strict';

describe('Service: dailyExchangeRatesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var dailyExchangeRatesService;
  beforeEach(inject(function (_dailyExchangeRatesService_) {
    dailyExchangeRatesService = _dailyExchangeRatesService_;
  }));

  it('should do something', function () {
    expect(!!dailyExchangeRatesService).toBe(true);
  });

});
