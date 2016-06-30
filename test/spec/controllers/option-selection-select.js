'use strict';

describe('Controller: OptionSelectionSelectCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var OptionSelectionSelectCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OptionSelectionSelectCtrl = $controller('OptionSelectionSelectCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
	 // place here mocked dependencies
  });
});
