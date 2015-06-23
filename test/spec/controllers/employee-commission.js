'use strict';

describe('Controller: EmployeeCommissionCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/price-types.json'));


  var EmployeeCommissionCtrl,
    employeeCommissionFactory,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    itemsListJSON,
    priceTypeListJSON,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {
    inject(function (_servedItemsList_, _servedPriceTypes_) {
      itemsListJSON = _servedItemsList_;
      priceTypeListJSON = _servedPriceTypes_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemsListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);

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

    it('should have a list of price types attached to scope', function(){
      expect(scope.priceTypesList).toBeDefined();
    });
  });

});
