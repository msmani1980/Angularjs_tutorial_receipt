'use strict';

describe('Controller: StoreInstanceStep1Ctrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StoreInstanceStep1Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoreInstanceStep1Ctrl = $controller('StoreInstanceStep1Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StoreInstanceStep1Ctrl.awesomeThings.length).toBe(3);
  }); 
});
