'use strict';

describe('Controller: ItemsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ItemsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemsCtrl = $controller('ItemsCtrl', {
      $scope: scope
    });
  }));

  it('should have $scope.items defined but object does not exist!', function () {
    expect(scope.items).toBeDefined();
  });

  it('expects $scope.items to have data in the array but it has nothing!', function () {
    expect(scope.items.length).toBeGreaterThan(0);
  });

});
