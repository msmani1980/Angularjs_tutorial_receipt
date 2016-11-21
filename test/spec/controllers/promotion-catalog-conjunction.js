'use strict';

describe('Controller: PromotionCatalogConjunctionCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionCatalogConjunctionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCatalogConjunctionCtrl = $controller('PromotionCatalogConjunctionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
