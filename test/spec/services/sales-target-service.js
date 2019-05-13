'use strict';

describe('Service: salesTargetService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var salesTargetService;
  beforeEach(inject(function (_salesTargetService_) {
    salesTargetService = _salesTargetService_;
  }));

  it('should do something', function () {
    expect(!!salesTargetService).toBe(true);
  });

});
