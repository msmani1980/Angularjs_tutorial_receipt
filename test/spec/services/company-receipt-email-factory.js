'use strict';

describe('Service: companyReceiptEmailFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReceiptEmailFactory;
  beforeEach(inject(function (_companyReceiptEmailFactory_) {
    companyReceiptEmailFactory = _companyReceiptEmailFactory_;
  }));

  it('should do something', function () {
    expect(!!companyReceiptEmailFactory).toBe(true);
  });

});
