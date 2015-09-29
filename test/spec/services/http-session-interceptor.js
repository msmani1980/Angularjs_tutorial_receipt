'use strict';

fdescribe('Service: httpSessionInterceptor', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var httpSessionInterceptor;
  beforeEach(inject(function (_httpSessionInterceptor_) {
    httpSessionInterceptor = _httpSessionInterceptor_;
  }));

  it('should exist', function () {
    expect(!!httpSessionInterceptor).toBe(true);
  });

  describe('request function', function () {
    var actualConfig;

    beforeEach(function () {
      var config = {
        headers: {
          key: 'fakeValue'
        }
      };

      actualConfig = httpSessionInterceptor.request(config);
    });

    it('should add a session token header', function () {
      expect(angular.isDefined(actualConfig.headers.sessionToken)).toBe(true);
    });

    it('should add a timeout header', function () {
      expect(angular.isDefined(actualConfig.headers.timeout)).toBe(true);
    });
  });

});
