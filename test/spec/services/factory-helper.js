'use strict';

describe('Service: factoryHelper', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var factoryHelper;
  beforeEach(inject(function (_factoryHelper_) {
    factoryHelper = _factoryHelper_;
  }));

  it('should do something', function () {
    expect(!!factoryHelper).toBe(true);
  });

});
