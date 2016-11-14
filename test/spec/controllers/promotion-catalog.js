'use strict';

describe('Controller: PromotionCatalogCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionCatalogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCatalogCtrl = $controller('PromotionCatalogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
