'use strict';

describe('Controller: ForgotUsernamePasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ForgotUsernamePasswordCtrl;
  var scope;
  var identityAccessFactory;
  var sendEmailDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    identityAccessFactory = $injector.get('identityAccessFactory');

    sendEmailDeferred = $q.defer();
    spyOn(identityAccessFactory, 'sendEmail').and.returnValue(sendEmailDeferred.promise);

    ForgotUsernamePasswordCtrl = $controller('ForgotUsernamePasswordCtrl', {
      $scope: scope
    });
  }));

  it('should have a sendEmail function attached to scope', function () {
    expect(scope.sendEmail).toBeDefined();
  });

  describe('sendEmail process', function () {

    it('should not do anything if form is invalid', function () {
      scope.forgotForm = {
        $invalid: true
      };
      expect(scope.sendEmail()).toBeUndefined();
    });

    describe('SendEmail', function () {
      beforeEach(function () {
        scope.forgot = {
          email: 'fakeEmail',
          field: 'fakeField'
        };

        scope.forgotForm = {
          $invalid: false
        };

        scope.sendEmail();
      });

      it('should call sendEmail API', function () {
        sendEmailDeferred.resolve({});
        expect(identityAccessFactory.sendEmail).toHaveBeenCalledWith(scope.forgot.email, undefined);
      });

      it('should show errors in bad request', function () {
        sendEmailDeferred.reject(400);
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
        sendEmailDeferred.reject(errorMock);
        scope.$digest();
        expect(scope.errorResponse).toEqual(errorMock);
      });

    });
  });
});
