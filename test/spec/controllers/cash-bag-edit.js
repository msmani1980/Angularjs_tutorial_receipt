'use strict';

describe('Controller: CashBagEditCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/cash-bag.json','served/company.json', 'served/company-currency-globals.json'));

  var CashBagEditCtrl,
    scope,
    cashBagFactory,
    cashBagResponseJSON,
    getCashBagDeferred,
    companyId,
    companyResponseJSON,
    getCompanyDeferred,
    companyCurrencyGlobalsResponseJSON,
    getCompanyCurrenciesDeffered;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    scope = $rootScope.$new();
    inject(function (_servedCashBag_, _servedCompany_, _servedCompanyCurrencyGlobals_) {
      cashBagResponseJSON = _servedCashBag_;
      companyResponseJSON = _servedCompany_;
      companyCurrencyGlobalsResponseJSON = _servedCompanyCurrencyGlobals_;
    });

    cashBagFactory = $injector.get('cashBagFactory');

    getCashBagDeferred = $q.defer();
    getCashBagDeferred.resolve(cashBagResponseJSON);
    spyOn(cashBagFactory, 'getCashBag').and.returnValue(getCashBagDeferred.promise);

    getCompanyDeferred = $q.defer();
    getCompanyDeferred.resolve(companyResponseJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCompanyCurrenciesDeffered = $q.defer();
    getCompanyCurrenciesDeffered.resolve(companyCurrencyGlobalsResponseJSON);
    spyOn(cashBagFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeffered.promise);

    spyOn(cashBagFactory, 'updateCashBag').and.callThrough();

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

  describe('companyCurrencies in scope', function(){
    it('should call getCompanyCurrencies', function(){
      expect(cashBagFactory.getCompanyCurrencies).toHaveBeenCalled();
    });
    it('should have companyCurrencies attached to scope after API call', function(){
      expect(!!scope.companyCurrencies).toBe(true);
    });
    it('should have currencyCodes attached to scope after API call', function(){
      expect(!!scope.currencyCodes).toBe(true);
    });
  });

  describe('update cash bag', function () {
    it('should have an update method attached to the scope', function(){
      expect(!!scope.update).toBe(true);
    });
    it('should call updateCashBag', function(){
      scope.update(cashBagResponseJSON);
      expect(cashBagFactory.updateCashBag).toHaveBeenCalled();
    });
  });

});
