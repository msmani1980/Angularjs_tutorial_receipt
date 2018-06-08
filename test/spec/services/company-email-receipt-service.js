'use strict';

describe('Service: companyEmailReceiptService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyEmailReceiptService;
  beforeEach(inject(function (_companyEmailReceiptService_) {
    companyEmailReceiptService = _companyEmailReceiptService_;
  }));

  it('should do something', function () {
    expect(!!companyEmailReceiptService).toBe(true);
  });

});
