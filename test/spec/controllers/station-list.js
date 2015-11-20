'use strict';

describe('Controller: StationListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StationListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StationListCtrl = $controller('StationListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StationListCtrl.awesomeThings.length).toBe(3);
  });
});
