'use strict';

describe('Service: companiesListFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companiesListFactory;
  beforeEach(inject(function (_companiesListFactory_) {
    companiesListFactory = _companiesListFactory_;
  }));

  it('should do something', function () {
    expect(!!companiesListFactory).toBe(true);
  });

});
