'use strict';

describe('Controller: CompanyEmailReceiptListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyEmailReceiptListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyEmailReceiptListCtrl = $controller('CompanyEmailReceiptListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyEmailReceiptListCtrl.awesomeThings.length).toBe(3);
  });
});
