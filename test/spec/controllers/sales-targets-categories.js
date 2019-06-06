'use strict';

describe('Controller: SalesTargetsCategoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SalesTargetsCategoriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesTargetsCategoriesCtrl = $controller('SalesTargetsCategoriesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesTargetsCategoriesCtrl.awesomeThings.length).toBe(3);
  });
});
