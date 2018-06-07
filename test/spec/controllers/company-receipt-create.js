'use strict';

describe('Controller: CompanyReceiptCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReceiptCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReceiptCreateCtrl = $controller('CompanyReceiptCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReceiptCreateCtrl.awesomeThings.length).toBe(3);
  });
});
