'use strict';

describe('Controller: CashBagEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json','served/company.json'));

  var CashBagEditCtrl,
    scope,
    cashBagFactory,
    cashBagResponseJSON,
    getCashBagDeferred,
    companyId,
    companyResponseJSON,
    getCompanyDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedCashBag_, _servedCompany_) {
      cashBagResponseJSON = _servedCashBag_;
      companyResponseJSON = _servedCompany_;
    });

    cashBagFactory = $injector.get('cashBagFactory');

    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagResponseJSON);
    spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    CashBagEditCtrl = $controller('CashBagEditCtrl', {
      $scope: scope,
      $routeParams: {state:'edit', id:95}
    });

    scope.$digest();
    companyId = cashBagFactory.getCompanyId();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Cash Bag');
  });

  describe('cashBag object in scope', function () {
    it('should call getCashBag', function () {
      expect(cashBagFactory.getCashBag).toHaveBeenCalled();
    });
    it('should have cashBag attached to scope after API call', function () {
      expect(!!scope.cashBag).toBe(true);
    });
  });

  describe('company object in scope', function(){
    it('should call getCompany with companyId', function(){
      expect(cashBagFactory.getCompany).toHaveBeenCalledWith(companyId);
    });
    it('should have company attached to scope after API call', function(){
      expect(!!scope.company).toBe(true);
    });
  });

});
