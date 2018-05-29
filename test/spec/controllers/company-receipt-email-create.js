'use strict';

describe('Controller: CompanyReceiptEmailCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReceiptEmailCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReceiptEmailCreateCtrl = $controller('CompanyReceiptEmailCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReceiptEmailCreateCtrl.awesomeThings.length).toBe(3);
  });
});
