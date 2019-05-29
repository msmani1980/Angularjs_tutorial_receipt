'use strict';

describe('Service: salesTargetCategoryFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var salesTargetCategoryFactory;
  beforeEach(inject(function (_salesTargetCategoryFactory_) {
    salesTargetCategoryFactory = _salesTargetCategoryFactory_;
  }));

  it('should do something', function () {
    expect(!!salesTargetCategoryFactory).toBe(true);
  });

});
