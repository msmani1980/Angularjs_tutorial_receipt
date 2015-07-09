'use strict';

describe('Controller: EmployeeCommissionListCtrl', function () {

  beforeEach(module('ts5App'));

  var EmployeeCommissionListCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployeeCommissionListCtrl = $controller('EmployeeCommissionListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBeDefined();
  });

  it('should have startDate defined', function () {
    expect(scope.startDate).toBeDefined();
  });
});
