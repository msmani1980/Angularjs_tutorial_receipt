'use strict';

describe('Controller: PromotionCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionCategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCategoryCtrl = $controller('PromotionCategoryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
