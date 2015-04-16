'use strict';

describe('Service: currencies', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencies;
  beforeEach(inject(function (_currencies_) {
    currencies = _currencies_;
  }));

  it('should do something', function () {
    expect(!!currencies).toBe(true);
  });

});
