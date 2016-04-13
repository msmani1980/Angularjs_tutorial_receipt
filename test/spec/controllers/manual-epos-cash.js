'use strict';

describe('Controller: ManualEposCashCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ManualEposCashCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualEposCashCtrl = $controller('ManualEposCashCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
