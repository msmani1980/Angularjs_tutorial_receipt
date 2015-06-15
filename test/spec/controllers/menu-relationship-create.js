'use strict';

describe('Controller: MenuRelationshipCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var MenuRelationshipCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MenuRelationshipCreateCtrl = $controller('MenuRelationshipCreateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
