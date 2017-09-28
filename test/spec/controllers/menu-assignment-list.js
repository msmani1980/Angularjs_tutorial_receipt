'use strict';

describe('Controller: MenuAssignmentListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuAssignmentListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuAssignmentListCtrl = $controller('MenuAssignmentListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MenuAssignmentListCtrl.awesomeThings.length).toBe(3);
  });
});
