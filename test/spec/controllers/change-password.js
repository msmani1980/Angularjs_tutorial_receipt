'use strict';

describe('Controller: ChangePasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ChangePasswordCtrl;
  var scope;
  var identityAccessFactory;
  var loginDeferred;
  var changePasswordDeferred;
  var routeParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');

    loginDeferred = $q.defer();
    spyOn(identityAccessFactory, 'login').and.returnValue(loginDeferred.promise);

    changePasswordDeferred = $q.defer();
    spyOn(identityAccessFactory, 'changePassword').and.returnValue(changePasswordDeferred.promise);

    spyOn(identityAccessFactory, 'getSessionObject').and.returnValue({ username: 'user' });

    routeParams = {
      sessionToken: 'fakeSessionToken'
    };
    ChangePasswordCtrl = $controller('ChangePasswordCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  it('should have a changePassword function attached to scope', function () {
    expect(scope.changePassword).toBeDefined();
  });

  it('should call getSessionObject function', function () {
    expect(identityAccessFactory.getSessionObject).toHaveBeenCalled();
  });

  describe('changePassword process', function () {

    it('should not do anything if form is invalid', function () {
      scope.changePasswordForm = {
        $invalid: true
      };
      expect(scope.changePassword()).toBeUndefined();
    });

    describe('Authentication', function () {
      beforeEach(function () {
        scope.credentials = {
          username: 'fakeUsername',
          currentPassword: 'fakePass',
          newPassword: 'fakePass',
          newPasswordConfirm: 'fakePass'
        };

        scope.changePasswordForm = {
          $invalid: false
        };

        scope.changePassword();
      });

      it('should call login API', function () {
        changePasswordDeferred.resolve({});
        scope.$digest();
        expect(identityAccessFactory.login).toHaveBeenCalledWith({ username: scope.credentials.username, password: scope.credentials.newPassword });
      });

      it('should call changePassword API', function () {
        var expectedCredentials = jasmine.objectContaining({
          username: scope.credentials.username,
          password: scope.credentials.newPassword
        });
        var expectedHeaders = {
          sessionToken: routeParams.sessionToken
        };
        changePasswordDeferred.resolve({});
        loginDeferred.resolve({});
        scope.$digest();
        expect(identityAccessFactory.changePassword).toHaveBeenCalledWith(expectedCredentials, expectedHeaders);
      });

      it('should show errors in authUser bad request', function () {
        changePasswordDeferred.reject(400);
        scope.$digest();
        expect(scope.displayError).toBeTruthy();
      });

      it('should show errors in chpwd bad request', function () {
        loginDeferred.resolve({});
        scope.$digest();
        changePasswordDeferred.reject(400);
        scope.$digest();
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the login error response', function () {
        var errorMock = {
          status: 400,
          data: [
            {
              field: 'Password',
              value: 'does not match our records.'
            }
          ]
        };
        changePasswordDeferred.reject(errorMock);
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

      it('should set the changePassword error response', function () {
        var errorMock = {
          status: 400,
          data: [
            {
              field: 'Password',
              value: 'cannot be changed.'
            }
          ]
        };
        loginDeferred.resolve({});
        scope.$digest();
        changePasswordDeferred.reject(errorMock);
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

    });
  });
});
