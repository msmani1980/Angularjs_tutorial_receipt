'use strict';

describe('Controller: CompanyEmailReceiptCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyEmailReceiptCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyEmailReceiptCreateCtrl = $controller('CompanyEmailReceiptCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyEmailReceiptCreateCtrl.awesomeThings.length).toBe(3);
  });
});
