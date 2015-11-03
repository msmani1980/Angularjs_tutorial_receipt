'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var LoginCtrl;
  var scope;
  var identityAccessFactory;
  var loginDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');

    loginDeferred = $q.defer();

    spyOn(identityAccessFactory, 'login').and.returnValue(loginDeferred.promise);
    spyOn(identityAccessFactory, 'setSessionData');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have a login function attached to scope', function () {
    expect(scope.login).toBeDefined();
  });

  describe('login process', function () {

    it('should not do anything if form is invalid', function () {
      scope.loginForm = {
        $invalid: true
      };
      expect(scope.login()).toBeUndefined();
    });

    it('should not do anything if form is invalid', function () {
      scope.loginForm = {
        $invalid: true
      };
      expect(scope.login()).toBeUndefined();
    });

    describe('Authentication', function () {
      beforeEach(function () {
        scope.credentials = {
          username: 'fakeUser',
          password: 'fakePass'
        };

        scope.loginForm = {
          $invalid: false
        };

        scope.login();
      });

      it('should call login API', function () {
        loginDeferred.resolve({});
        expect(identityAccessFactory.login).toHaveBeenCalledWith(scope.credentials);
      });

      it('should set the session Object', function () {
        loginDeferred.resolve({fakeSessionToken: 'someRandomTextHere'});
        scope.$digest();
        //expect(identityAccessFactory.setSessionData).toHaveBeenCalledWith({fakeSessionToken: 'someRandomTextHere'});
        expect(identityAccessFactory.setSessionData).toHaveBeenCalled();
      });

      //it('should show errors in bad request', function () {
      //  loginDeferred.reject(400);
      //  scope.$digest();
      //  expect(scope.displayError).toBeTruthy();
      //});
    });


  });

});
