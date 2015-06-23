'use strict';

describe('Controller: EmployeeCommissionCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json'));


  var EmployeeCommissionCtrl,
    employeeCommissionFactory,
    getItemsListDeferred,
    itemsListJSON,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, _employeeCommissionFactory_) {
    inject(function (_servedItemsList_) {
      itemsListJSON = _servedItemsList_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemsListJSON);

    employeeCommissionFactory = _employeeCommissionFactory_;
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);

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
