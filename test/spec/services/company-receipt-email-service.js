'use strict';

describe('Service: companyReceiptEmailService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReceiptEmailService;
  beforeEach(inject(function (_companyReceiptEmailService_) {
    companyReceiptEmailService = _companyReceiptEmailService_;
  }));

  it('should do something', function () {
    expect(!!companyReceiptEmailService).toBe(true);
  });

});
