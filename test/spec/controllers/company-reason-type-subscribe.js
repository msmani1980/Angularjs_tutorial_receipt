'use strict';

describe('Controller: CompanyReasonTypeSubscribeCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyReasonTypeSubscribeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyReasonTypeSubscribeCtrl = $controller('CompanyReasonTypeSubscribeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CompanyReasonTypeSubscribeCtrl.awesomeThings.length).toBe(3);
  });
});
