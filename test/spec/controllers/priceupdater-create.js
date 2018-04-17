'use strict';

describe('Controller: PriceupdaterCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PriceupdaterCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PriceupdaterCreateCtrl = $controller('PriceupdaterCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PriceupdaterCreateCtrl.awesomeThings.length).toBe(3);
  });
});
