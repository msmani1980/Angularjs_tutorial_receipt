'use strict';

describe('Controller: EposTransactionListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var EposTransactionListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EposTransactionListCtrl = $controller('EposTransactionListCtrl', {
      $scope: scope
    });
  }));

  
});
