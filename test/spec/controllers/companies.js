'use strict';

describe('Controller: CompaniesCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompaniesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompaniesCtrl = $controller('CompaniesCtrl', {
      $scope: scope
    });
  }));
});
