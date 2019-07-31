'use strict';

describe('Controller: PreOrderCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PreOrderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreOrderCtrl = $controller('PreOrderCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreOrderCtrl.awesomeThings.length).toBe(3);
  });
});
