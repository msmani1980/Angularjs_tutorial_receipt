'use strict';

describe('Controller: ItemCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ItemCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemCreateCtrl = $controller('ItemCreateCtrl', {
      $scope: scope
    });
  }));
});
