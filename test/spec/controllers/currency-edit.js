'use strict';

describe('Controller: CompanyCurrencyEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyCurrencyEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyCurrencyEditCtrl = $controller('CompanyCurrencyEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyCurrencyEditCtrl.awesomeThings.length).toBe(3);
  });
});
