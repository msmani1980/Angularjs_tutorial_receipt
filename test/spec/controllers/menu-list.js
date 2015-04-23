'use strict';

describe('Controller: MenuListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuListCtrl = $controller('MenuListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Menu Management');
  });
});
