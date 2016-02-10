'use strict';

describe('Service: storeInstanceValidationService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceValidationService;
  beforeEach(inject(function (_storeInstanceValidationService_) {
    storeInstanceValidationService = _storeInstanceValidationService_;
  }));

  it('should do something', function () {
    expect(!!storeInstanceValidationService).toBe(true);
  });

});
