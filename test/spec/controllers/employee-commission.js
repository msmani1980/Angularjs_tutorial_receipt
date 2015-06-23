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
    scope.$digest();
  }));

  describe('initialize', function(){

    it('should have a list of items attached to scope', function(){
      expect(scope.itemsList).toBeDefined();
    });
  });

});
