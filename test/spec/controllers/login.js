'use strict';

fdescribe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var LoginCtrl;
  var scope;
  var identityAccessFactory;
  var httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $httpBackend) {
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');
    httpBackend = $httpBackend;

    spyOn(identityAccessFactory, 'login');

    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

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
      var expectedURL = /dispatch\/store-instances$/;
      httpBackend.expectGET(expectedURL).respond(200, {});

      scope.credentials = {
        username: 'fakeUser',
        password: 'fakePass'
      };

      scope.loginForm = {
        $invalid: false
      };

      expect(scope.login()).toBeUndefined();
    });

  });

});
