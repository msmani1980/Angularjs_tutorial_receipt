'use strict';

describe('Service: companyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyFactory;
  beforeEach(inject(function (_companyFactory_) {
    companyFactory = _companyFactory_;
  }));

  it('should do something', function () {
    expect(!!companyFactory).toBe(true);
  });

});
