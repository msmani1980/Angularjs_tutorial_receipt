'use strict';

describe('Service: mainMenuOrderService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var mainMenuOrderService;
  beforeEach(inject(function (_mainMenuOrderService_) {
    mainMenuOrderService = _mainMenuOrderService_;
  }));

  it('should do something', function () {
    expect(!!mainMenuOrderService).toBe(true);
  });

});
