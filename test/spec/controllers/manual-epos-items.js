'use strict';

describe('Controller: ManualEposItemsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ManualEposVirtualCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualEposVirtualCtrl = $controller('ManualEposItemsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
