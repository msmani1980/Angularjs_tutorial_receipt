'use strict';

describe('Controller: ExchangeRatesCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ExchangeRatesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExchangeRatesCtrl = $controller('ExchangeRatesCtrl', {
      $scope: scope
    });
  }));

  it('should have a breadcrumb property', function () {
    expect(scope.breadcrumb).toBeDefined();
  });
});
