'use strict';

describe('Controller: ManualEposPromotionCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ManualEposPromotionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManualEposPromotionCtrl = $controller('ManualEposPromotionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ManualEposPromotionCtrl.awesomeThings.length).toBe(3);
  });
});
