'use strict';

describe('Controller: CompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var CompanyRelationshipCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompanyRelationshipCtrl = $controller('CompanyRelationshipCtrl', {
      $scope: scope
    });
  }));
});
