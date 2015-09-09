'use strict';

describe('Service: storeInstanceSealService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceSealService;
  beforeEach(inject(function (_storeInstanceSealService_) {
    storeInstanceSealService = _storeInstanceSealService_;
  }));

  it('should do something', function () {
    expect(!!storeInstanceSealService).toBe(true);
  });

});
