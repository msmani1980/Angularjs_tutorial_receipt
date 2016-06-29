'use strict';

describe('Controller: OptionSelectionDateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var OptionSelectionDateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OptionSelectionDateCtrl = $controller('OptionSelectionDateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OptionSelectionDateCtrl.awesomeThings.length).toBe(3);
  });
});
