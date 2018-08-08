'use strict';

describe('Controller: RouteTaxRatesCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var RouteTaxRatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RouteTaxRatesCtrl = $controller('RouteTaxRatesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RouteTaxRatesCtrl.awesomeThings.length).toBe(3);
  });
});
