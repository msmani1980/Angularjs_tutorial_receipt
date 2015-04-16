'use strict';

describe('Controller: CreateItemCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CreateItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateItemCtrl = $controller('CreateItemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
