'use strict';

describe('Controller: TaxRatesCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var TaxRatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxRatesCtrl = $controller('TaxRatesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TaxRatesCtrl.awesomeThings.length).toBe(3);
  });
});
