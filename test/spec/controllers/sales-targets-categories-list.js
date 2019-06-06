'use strict';

describe('Controller: SalesTargetsCategoriesListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SalesTargetsCategoriesListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalesTargetsCategoriesListCtrl = $controller('SalesTargetsCategoriesListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SalesTargetsCategoriesListCtrl.awesomeThings.length).toBe(3);
  });
});
