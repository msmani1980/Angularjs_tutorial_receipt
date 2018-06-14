'use strict';

describe('Service: companyEmailReceiptFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyEmailReceiptFactory;
  beforeEach(inject(function (_companyEmailReceiptFactory_) {
    companyEmailReceiptFactory = _companyEmailReceiptFactory_;
  }));

  it('should do something', function () {
    expect(!!companyEmailReceiptFactory).toBe(true);
  });

});
