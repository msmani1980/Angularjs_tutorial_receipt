'use strict';

describe('Controller: StoreInstancePackingCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StoreInstancePackingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoreInstancePackingCtrl = $controller('StoreInstancePackingCtrl', {
      $scope: scope
    });
  }));

});
