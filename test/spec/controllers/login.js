'use strict';

describe('Controller: LoginCtrl', function() {

  beforeEach(module('ts5App'));

  var LoginCtrl;
  var scope;
  var rootScope;
  var identityAccessFactory;
  var loginDeferred;

  beforeEach(inject(function($controller, $rootScope, $injector, $q) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');

    loginDeferred = $q.defer();
    spyOn(identityAccessFactory, 'login').and.returnValue(loginDeferred.promise);
    spyOn(identityAccessFactory, 'setSessionData');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have a login function attached to scope', function() {
    expect(scope.login).toBeDefined();
  });

  describe('login process', function() {

    it('should not do anything if form is invalid', function() {
      scope.loginForm = {
        $invalid: true
      };
      expect(scope.login()).toBeUndefined();
    });

    describe('Authentication', function() {
      beforeEach(function() {
        scope.credentials = {
          username: 'fakeUser',
          password: 'fakePass'
        };

        scope.loginForm = {
          $invalid: false
        };

        scope.login();
      });

      it('should call login API', function() {
        loginDeferred.resolve({});
        expect(identityAccessFactory.login).toHaveBeenCalledWith(scope.credentials);
      });

      it('should show errors in bad request', function() {
        rootScope.$broadcast('un-authorized', {});
        scope.$digest();
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the error response to invalid username/password error if response does not contain enabled:false', function () {
        var errorMock = {
          status: 400,
          data: [{
            field: 'Username or Password',
            value: 'does not match our records.'
          }]
        };
        rootScope.$broadcast('un-authorized', {
          status: 400
        });
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

      it('should set the error response to show deactivated account error if response contains enabled:false', function () {
        var errorMock = {
          status: 400,
          data: [
            {
              field: 'User Account',
              value: 'Your account has been deactivated.'
            }
          ]
        };
        rootScope.$broadcast('un-authorized', { status: 400, data: {enabled: false} });
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

    });
  });
});
