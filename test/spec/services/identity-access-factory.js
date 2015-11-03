'use strict';

describe('Service: identityAccessFactory', function () {

  beforeEach(module('ts5App'));

  var identityAccessFactory;
  var localStorage;
  var identityAccessService;
  var scope;
  var location;
  var timeout;

  beforeEach(inject(function (_identityAccessFactory_, $injector, $rootScope, $location, $timeout) {
    localStorage = $injector.get('$localStorage');
    identityAccessService = $injector.get('identityAccessService');
    scope = $rootScope;
    location = $location;
    timeout = $timeout;

    spyOn(identityAccessService, 'authorizeUser');
    spyOn(location, 'path');

    identityAccessFactory = _identityAccessFactory_;
  }));

  it('should exist', function () {
    expect(!!identityAccessFactory).toBe(true);
  });

  describe('LocalStorage sessionObject', function () {
    beforeEach(function () {
      var credentials = {
        username: 'username',
        password: 'password'
      };
      identityAccessFactory.login(credentials);
    });

    it('should set session data in localStorage', function () {
      expect(identityAccessService.authorizeUser).toHaveBeenCalled();
    });

  });

  describe('location change', function () {

    it('should redirect to login when not authenticated and location changes', function () {
      scope.$broadcast('$locationChangeStart', 'fakeRoute');
      timeout.flush();
      expect(location.path).toHaveBeenCalledWith('/login');
    });

  });

  describe('LocalStorage sessionObject', function () {
    beforeEach(function () {
      var sessionObject = {
        id: 'fakeId',
        companyId: 'fakeCompanyId',
        currentSession: {
          sessionToken: 'fakeSessionToken'
        }
      };
      identityAccessFactory.setSessionData(sessionObject);
    });

    it('should set session data in localStorage', function () {
      expect(localStorage.sessionObject).toBeDefined();
    });

    it('should return true is session stored on LS', function () {
      expect(identityAccessFactory.isAuthorized()).toBe(true);
    });

    it('should not redirect to login when location changes', function () {
      scope.$broadcast('$locationChangeStart', 'fakeRoute');
      expect(location.path).not.toHaveBeenCalledWith('/login');
    });

    it('should delete sessionObject on LS', function () {
      scope.$broadcast('logout');
      scope.$digest();
      expect(identityAccessFactory.isAuthorized()).toBe(false);
    });
  });


});
