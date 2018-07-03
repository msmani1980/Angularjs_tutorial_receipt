'use strict';

describe('Service: companyReceiptService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyReceiptService;
  beforeEach(inject(function (_companyReceiptService_) {
    companyReceiptService = _companyReceiptService_;
  }));

  it('should do something', function () {
    expect(!!companyReceiptService).toBe(true);
  });

});
