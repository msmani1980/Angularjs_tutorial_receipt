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

  describe('search object', function(){

    it('should exists in scope', function () {
      expect(scope.search).toBeDefined();
    });

    it('should have required properties', function () {
      expect(Object.keys(scope.search)).toEqual(['startDate', 'itemList', 'priceTypesList', 'taxRateTypesList']);
    });

  });
});
