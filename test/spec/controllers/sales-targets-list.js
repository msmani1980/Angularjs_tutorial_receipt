'use strict';

describe('Controller: SalesTargetsListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SalesTargetsListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesTargetsListCtrl = $controller('SalesTargetsListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesTargetsListCtrl.awesomeThings.length).toBe(3);
  });
});
