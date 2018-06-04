'use strict';

describe('Service: companyReceiptFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReceiptFactory;
  beforeEach(inject(function (_companyReceiptFactory_) {
    companyReceiptFactory = _companyReceiptFactory_;
  }));

  it('should do something', function () {
    expect(!!companyReceiptFactory).toBe(true);
  });

});
