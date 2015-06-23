'use strict';

describe('Controller: EmployeeCommissionCtrl', function () {

  beforeEach(module('ts5App'));

  var EmployeeCommissionCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmployeeCommissionCtrl = $controller('EmployeeCommissionCtrl', {
      $scope: scope
    });
  }));

});
