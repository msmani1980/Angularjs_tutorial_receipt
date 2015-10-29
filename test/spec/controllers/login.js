'use strict';

fdescribe('Controller: LoginCtrl', function () {

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
    loginDeferred.resolve({});

    spyOn(identityAccessFactory, 'login').and.returnValue(loginDeferred.promise);

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

    it('should not do anything if form is invalid', function () {
      scope.credentials = {
        username: 'fakeUser',
        password: 'fakePass'
      };

      scope.loginForm = {
        $invalid: false
      };

      scope.login();
    });

  });

});
