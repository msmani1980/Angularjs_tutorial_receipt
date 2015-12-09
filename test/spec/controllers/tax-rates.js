'use strict';

fdescribe('Controller: TaxRatesCtrl', function() {

  // load the controller's module
  beforeEach(module('ts5App'));

  var TaxRatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxRatesCtrl = $controller('TaxRatesCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
  }));

  it('it should set the $scope.viewName to Tax Management', function() {
    expect(scope.viewName).toBe('Tax Management');
  });
});
