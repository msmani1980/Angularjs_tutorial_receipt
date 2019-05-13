'use strict';

describe('Service: salesTargetCategoryService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var salesTargetCategoryService;
  beforeEach(inject(function (_salesTargetCategoryService_) {
    salesTargetCategoryService = _salesTargetCategoryService_;
  }));

  it('should do something', function () {
    expect(!!salesTargetCategoryService).toBe(true);
  });

});
