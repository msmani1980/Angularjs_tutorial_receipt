'use strict';

describe('Service: identityAccessFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var identityAccessFactory;
  beforeEach(inject(function (_identityAccessFactory_) {
    identityAccessFactory = _identityAccessFactory_;
  }));

  it('should exist', function () {
    expect(!!identityAccessFactory).toBe(true);
  });

});
