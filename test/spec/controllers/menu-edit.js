'use strict';

describe('Controller: MenuEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuEditCtrl = $controller('MenuEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
