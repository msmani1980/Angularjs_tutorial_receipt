'use strict';

describe('Controller: TransactionListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var TransactionListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TransactionListCtrl = $controller('TransactionListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
