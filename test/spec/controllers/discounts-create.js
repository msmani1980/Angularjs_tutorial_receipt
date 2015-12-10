'use strict';

describe('Controller: DiscountsCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var DiscountsCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiscountsCreateCtrl = $controller('DiscountsCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DiscountsCreateCtrl.awesomeThings.length).toBe(3);
  });
});
