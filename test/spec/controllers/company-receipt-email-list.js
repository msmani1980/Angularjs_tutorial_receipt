'use strict';

describe('Controller: CompanyReceiptEmailListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReceiptEmailListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReceiptEmailListCtrl = $controller('CompanyReceiptEmailListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReceiptEmailListCtrl.awesomeThings.length).toBe(3);
  });
});
