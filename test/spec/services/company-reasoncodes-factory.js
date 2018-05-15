'use strict';

describe('Service: companyReasoncodesFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReasoncodesFactory;
  beforeEach(inject(function (_companyReasoncodesFactory_) {
    companyReasoncodesFactory = _companyReasoncodesFactory_;
  }));

  it('should do something', function () {
    expect(!!companyReasoncodesFactory).toBe(true);
  });

});
