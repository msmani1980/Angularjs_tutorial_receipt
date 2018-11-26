'use strict';

describe('Controller: PackingplanListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PackingplanListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PackingplanListCtrl = $controller('PackingplanListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PackingplanListCtrl.awesomeThings.length).toBe(3);
  });
});
