'use strict';

describe('Controller: PromotionListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PromotionListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PromotionListCtrl = $controller('PromotionListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PromotionListCtrl.awesomeThings.length).toBe(3);
  });
});
