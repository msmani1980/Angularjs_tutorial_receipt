'use strict';

describe('Service: storeTimeConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeTimeConfig;
  beforeEach(inject(function (_storeTimeConfig_) {
    storeTimeConfig = _storeTimeConfig_;
  }));

  it('should do something', function () {
    expect(!!storeTimeConfig).toBe(true);
  });

});
