'use strict';

describe('Service: discountTypesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var discountTypesService;
  beforeEach(inject(function (_discountTypesService_) {
    discountTypesService = _discountTypesService_;
  }));

  it('should do something', function () {
    expect(!!discountTypesService).toBe(true);
  });

});
