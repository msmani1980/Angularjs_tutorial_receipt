'use strict';

describe('Controller: ManualEposEntryCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ManualEposEntryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualEposEntryCtrl = $controller('ManualEposEntryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ManualEposEntryCtrl.awesomeThings.length).toBe(3);
  });
});
