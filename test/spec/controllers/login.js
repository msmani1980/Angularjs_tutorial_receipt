'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var LoginCtrl;
  var scope;
  var identityAccessFactory;
  var loginDeferred;
  var getCompanyDataDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');

    loginDeferred = $q.defer();
    spyOn(identityAccessFactory, 'login').and.returnValue(loginDeferred.promise);

    getCompanyDataDeferred = $q.defer();
    spyOn(identityAccessFactory, 'getCompanyData').and.returnValue(getCompanyDataDeferred.promise);

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
        var mockSessionJSON = {fakeSessionToken: 'someRandomTextHere'};
        var mockCompanyJSON = {companyData: 'fakeCompany'};

        loginDeferred.resolve(mockSessionJSON);
        getCompanyDataDeferred.resolve(mockCompanyJSON);


        var expectedPayload = angular.copy(mockSessionJSON);
        expectedPayload.companyData = mockCompanyJSON;

        scope.$digest();
        expect(identityAccessFactory.setSessionData).toHaveBeenCalledWith(expectedPayload);
      });

      it('should show errors in bad request', function () {
        loginDeferred.reject(400);
        scope.$digest();
        expect(scope.displayError).toBeTruthy();
      });

      it('should set the error response', function () {
        var errorMock = {
          status: 400,
          data: [
            {
              field: 'Username or Password',
              value: 'does not match our records.'
            }
          ]
        };
        loginDeferred.reject(errorMock);
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

    });
  });
});
