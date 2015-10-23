'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should have a login function attached to scope', function () {
    expect(scope.login).toBeDefined();
  });
});
