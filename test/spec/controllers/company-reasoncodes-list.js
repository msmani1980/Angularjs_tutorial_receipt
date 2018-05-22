'use strict';

describe('Controller: CompanyReasoncodesListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReasoncodesListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReasoncodesListCtrl = $controller('CompanyReasoncodesListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReasoncodesListCtrl.awesomeThings.length).toBe(3);
  });
});
