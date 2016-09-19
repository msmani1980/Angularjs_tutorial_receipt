'use strict';

describe('Controller: PromotionCategoryListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionCategoryListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionCategoryListCtrl = $controller('PromotionCategoryListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
