'use strict';

describe('Controller: ManualStoreInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ManualStoreInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualStoreInstanceCtrl = $controller('ManualStoreInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ManualStoreInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
