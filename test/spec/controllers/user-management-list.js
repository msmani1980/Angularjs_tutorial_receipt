'use strict';

describe('Controller: UserManagementListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var UserManagementListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserManagementListCtrl = $controller('UserManagementListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UserManagementListCtrl.awesomeThings.length).toBe(3);
  });
});
