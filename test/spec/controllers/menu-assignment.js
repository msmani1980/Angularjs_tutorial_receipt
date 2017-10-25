'use strict';

describe('Controller: MenuAssignmentCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuAssignmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuAssignmentCtrl = $controller('MenuAssignmentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MenuAssignmentCtrl.awesomeThings.length).toBe(3);
  });
});
