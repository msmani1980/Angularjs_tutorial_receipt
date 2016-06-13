'use strict';

describe('Service: currencyFormatUtility', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencyFormatUtility;
  beforeEach(inject(function (_currencyFormatUtility_) {
    currencyFormatUtility = _currencyFormatUtility_;
  }));

  it('should do something', function () {
    expect(!!currencyFormatUtility).toBe(true);
  });

});
