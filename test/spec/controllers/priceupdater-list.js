'use strict';

describe('Controller: PriceupdaterListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var PriceupdaterListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PriceupdaterListCtrl = $controller('PriceupdaterListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PriceupdaterListCtrl.awesomeThings.length).toBe(3);
  });
});
