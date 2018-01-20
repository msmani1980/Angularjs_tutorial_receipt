'use strict';

describe('Controller: ReportExchangeRateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ReportExchangeRateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportExchangeRateCtrl = $controller('ReportExchangeRateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ReportExchangeRateCtrl.awesomeThings.length).toBe(3);
  });
});
