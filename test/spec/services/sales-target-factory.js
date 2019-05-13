'use strict';

describe('Service: salesTargetFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var salesTargetFactory;
  beforeEach(inject(function (_salesTargetFactory_) {
    salesTargetFactory = _salesTargetFactory_;
  }));

  it('should do something', function () {
    expect(!!salesTargetFactory).toBe(true);
  });

});
