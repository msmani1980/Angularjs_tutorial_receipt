'use strict';

describe('Controller: CompanyReceiptListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReceiptListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReceiptListCtrl = $controller('CompanyReceiptListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReceiptListCtrl.awesomeThings.length).toBe(3);
  });
});
