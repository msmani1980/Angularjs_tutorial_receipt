'use strict';

describe('Controller: PreOrderListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PreOrderListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreOrderListCtrl = $controller('PreOrderListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PreOrderListCtrl.awesomeThings.length).toBe(3);
  });
});
