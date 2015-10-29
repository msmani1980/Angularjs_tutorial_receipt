'use strict';

describe('Service: httpSessionInterceptor', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var httpSessionInterceptor;
  var rootScope;
  beforeEach(inject(function (_httpSessionInterceptor_, $rootScope) {
    httpSessionInterceptor = _httpSessionInterceptor_;
    rootScope = $rootScope;
    spyOn(rootScope, '$broadcast');
  }));

  it('should exist', function () {
    expect(!!httpSessionInterceptor).toBe(true);
  });

  describe('responseError function', function () {

    it('should broadcast if status is unauthorized 401', function () {
      httpSessionInterceptor.responseError({status: 401});
      expect(rootScope.$broadcast).toHaveBeenCalledWith('unauthorized');
    });

    it('should broadcast if status is unauthorized 401', function () {
      httpSessionInterceptor.responseError({status: 200});
      expect(rootScope.$broadcast).not.toHaveBeenCalled();
    });

  });

});
