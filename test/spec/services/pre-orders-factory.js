'use strict';

describe('Service: preOrdersFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var preOrdersFactory;
  beforeEach(inject(function (_preOrdersFactory_) {
    preOrdersFactory = _preOrdersFactory_;
  }));

  it('should do something', function () {
    expect(!!preOrdersFactory).toBe(true);
  });

});
