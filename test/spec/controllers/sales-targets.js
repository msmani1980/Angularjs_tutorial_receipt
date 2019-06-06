'use strict';

describe('Controller: SalesTargetsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SalesTargetsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesTargetsCtrl = $controller('SalesTargetsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesTargetsCtrl.awesomeThings.length).toBe(3);
  });
});
