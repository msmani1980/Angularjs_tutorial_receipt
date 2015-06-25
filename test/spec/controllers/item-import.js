'use strict';

describe('Controller: ItemImportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ItemImportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemImportCtrl = $controller('ItemImportCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.viewName).toBeDefined();
  });
});
