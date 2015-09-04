'use strict';

describe('Controller: StoreInstanceReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var StoreInstanceReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StoreInstanceReviewCtrl = $controller('StoreInstanceReviewCtrl', {
      $scope: scope
    });
  }));
});
