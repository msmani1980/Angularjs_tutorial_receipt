'use strict';

describe('Controller: DiscountListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var DiscountListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscountListCtrl = $controller('DiscountListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiscountListCtrl.awesomeThings.length).toBe(3);
  });
});
