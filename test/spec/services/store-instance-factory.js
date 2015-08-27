'use strict';

describe('Service: storeInstanceFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceFactory;
  beforeEach(inject(function (_storeInstanceFactory_) {
    storeInstanceFactory = _storeInstanceFactory_;
  }));

  it('should do something', function () {
    expect(!!storeInstanceFactory).toBe(true);
  });

});
