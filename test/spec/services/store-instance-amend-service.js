'use strict';

describe('Service: storeInstanceAmendService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceAmendService;
  beforeEach(inject(function (_storeInstanceAmendService_) {
    storeInstanceAmendService = _storeInstanceAmendService_;
  }));

  it('should do something', function () {
    expect(!!storeInstanceAmendService).toBe(true);
  });

});
