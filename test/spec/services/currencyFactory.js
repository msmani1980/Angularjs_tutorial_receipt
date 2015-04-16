'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFactory;
  beforeEach(inject(function (_currencyFactory_) {
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

});
