'use strict';

describe('Service: storeInstanceSealService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceSealService;
  beforeEach(inject(function (_storeInstanceSealService_) {
    storeInstanceSealService = _storeInstanceSealService_;
  }));
  // TODO - these test, waiting on BE API to be completed for this.
  it('should do something', function () {
    expect(!!storeInstanceSealService).toBe(true);
  });

});
