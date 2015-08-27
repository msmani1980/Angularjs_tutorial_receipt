'use strict';

describe('Controller: CommissionDataCtrl', function () {
  beforeEach(module('ts5App', 'template-module'));
  var CommissionDataCtrl,
    location,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $location) {
    location = $location;
    scope = $rootScope.$new();

    CommissionDataCtrl = $controller('CommissionDataCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


});
