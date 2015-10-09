'use strict';

describe('Service: payloadUtility', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var payloadUtility;
  beforeEach(inject(function (_payloadUtility_) {
    payloadUtility = _payloadUtility_;
  }));

  it('should do something', function () {
    expect(!!payloadUtility).toBe(true);
  });

});
