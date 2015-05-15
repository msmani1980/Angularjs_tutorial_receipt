'use strict';

describe('Service: companiesFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companiesFactory;
  beforeEach(inject(function (_companiesFactory_) {
    companiesFactory = _companiesFactory_;
  }));

  it('should do something', function () {
    expect(!!companiesFactory).toBe(true);
  });

});
