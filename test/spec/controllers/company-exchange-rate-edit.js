'use strict';

describe('Controller: CompanyExchangeRateEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyExchangeRateEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyExchangeRateEditCtrl = $controller('CompanyExchangeRateEditCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyExchangeRateEditCtrl.awesomeThings.length).toBe(3);
  });
});
