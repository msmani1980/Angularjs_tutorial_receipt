'use strict';

describe('Controller: StoreInstanceDashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StoreInstanceDashboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoreInstanceDashboardCtrl = $controller('StoreInstanceDashboardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StoreInstanceDashboardCtrl.awesomeThings.length).toBe(3);
  });
});
