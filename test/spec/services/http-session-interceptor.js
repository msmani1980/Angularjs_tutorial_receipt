'use strict';

describe('Service: httpSessionInterceptor', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var httpSessionInterceptor;
  beforeEach(inject(function (_httpSessionInterceptor_) {
    httpSessionInterceptor = _httpSessionInterceptor_;
  }));

  it('should do something', function () {
    expect(!!httpSessionInterceptor).toBe(true);
  });

});
