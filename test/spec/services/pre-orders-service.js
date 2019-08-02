'use strict';

describe('Service: preOrdersService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var preOrdersService;
  beforeEach(inject(function (_preOrdersService_) {
    preOrdersService = _preOrdersService_;
  }));

  it('should do something', function () {
    expect(!!preOrdersService).toBe(true);
  });

});
