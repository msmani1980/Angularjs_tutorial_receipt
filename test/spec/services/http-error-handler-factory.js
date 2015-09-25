'use strict';

describe('Service: httpErrorHandlerFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var httpErrorHandlerFactory;
  beforeEach(inject(function (_httpErrorHandlerFactory_) {
    httpErrorHandlerFactory = _httpErrorHandlerFactory_;
  }));

  it('should do something', function () {
    expect(!!httpErrorHandlerFactory).toBe(true);
  });

});
