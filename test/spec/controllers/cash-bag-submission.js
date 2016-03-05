'use strict';

describe('Controller: CashBagSubmissionCtrl', function() {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company.json'));
  beforeEach(module('served/company-data.json'));
  beforeEach(module('served/currency-globals.json'));
  beforeEach(module('served/cash-bag-list-submit.json'));
  beforeEach(module('served/update-cash-bag-submit.json'));

  var CashBagSubmissionCtrl;
  var scope;
  var cashBagFactory;
  var globalMenuService;
  var servedCompanyDataJSON;
  var getCompanyDeferred;
  var getCompanyJSON;
  var getCashBagListDeferred;
  var getCashBagListJSON;
  var updateCashBagJSON;
  var updateCashBagDeferred;
  var getCompanyGlobalCurrenciesJSON;
  var getCompanyGlobalCurrenciesDeferred;

  beforeEach(inject(function($controller, $rootScope, $injector, $q) {

    scope = $rootScope.$new();
    cashBagFactory = $injector.get('cashBagFactory');

    servedCompanyDataJSON = $injector.get('servedCompanyData');
    globalMenuService = $injector.get('globalMenuService');
    spyOn(globalMenuService, 'getCompanyData').and.returnValue(servedCompanyDataJSON);

    getCompanyDeferred = $q.defer();
    getCompanyJSON = $injector.get('servedCompany');
    getCompanyDeferred.resolve(getCompanyJSON);
    spyOn(cashBagFactory, 'getCompany').and.returnValue(getCompanyDeferred.promise);

    getCashBagListDeferred = $q.defer();
    getCashBagListJSON = $injector.get('servedCashBagListSubmit');
    getCashBagListDeferred.resolve(getCashBagListJSON);
    spyOn(cashBagFactory, 'getCashBagList').and.returnValue(getCashBagListDeferred.promise);

    updateCashBagDeferred = $q.defer();
    updateCashBagJSON = $injector.get('servedUpdateCashBagSubmit');
    updateCashBagDeferred.resolve(updateCashBagJSON);
    spyOn(cashBagFactory, 'updateCashBag').and.returnValue(updateCashBagDeferred.promise);

    getCompanyGlobalCurrenciesDeferred = $q.defer();
    getCompanyGlobalCurrenciesJSON = $injector.get('servedCurrencyGlobals');
    getCompanyGlobalCurrenciesDeferred.resolve(getCompanyGlobalCurrenciesJSON);
    spyOn(cashBagFactory, 'getCompanyGlobalCurrencies').and.returnValue(getCompanyGlobalCurrenciesDeferred.promise);

    CashBagSubmissionCtrl = $controller('CashBagSubmissionCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  describe('controller init', function() {
    it('should exist', function() {
      expect(CashBagSubmissionCtrl).toBeDefined();
    });

    describe('API call to getCompany', function() {
      it('should call getCompany', function() {
        expect(cashBagFactory.getCompany).toHaveBeenCalledWith(362);
      });

      it('should attach cashHandler response to scope', function() {
        expect(scope.CHCompany).toEqual(getCompanyJSON);
      });

      it('should attach airline company response to scope', function() {
        expect(scope.companyData).toEqual(getCompanyJSON);
      });

      it('should attach BaseCurrency to scope', function() {
        var expectedCurrency = jasmine.objectContaining({
          code: 'GBP'
        });
        expect(CashBagSubmissionCtrl.globalCurrencyList[0]).toEqual(expectedCurrency);
      });

    });
  });

  describe('getCashBagList', function() {

    describe('success handler and formatting cash bag list', function() {
      it('should call getCashBagList', function() {
        scope.updateCashBagList();
        expect(cashBagFactory.getCashBagList).toHaveBeenCalled();
      });

      it('should update meta to match response', function() {
        scope.updateCashBagList();
        scope.$digest();
        expect(CashBagSubmissionCtrl.meta.count).toBe(getCashBagListJSON.meta.count);
      });
    });

    it('should not call getCashBagList if meta is not consistent', function() {
      CashBagSubmissionCtrl.meta.offset = 10;
      CashBagSubmissionCtrl.meta.count = 1;
      scope.updateCashBagList();
      expect(cashBagFactory.getCashBagList).not.toHaveBeenCalled();
    });

    it('should not call getCashBagList if call in progress', function() {
      CashBagSubmissionCtrl.meta.offset = 0;
      CashBagSubmissionCtrl.meta.count = 1;
      CashBagSubmissionCtrl.loadingProgress = true;
      scope.updateCashBagList();
      expect(cashBagFactory.getCashBagList).not.toHaveBeenCalled();
    });

    describe('search functionality', function() {

      it('should set cashBagList to empty when clearing search', function() {
        scope.clearForm();
        expect(scope.cashBagList).toEqual([]);
      });

      it('should call getCashBagList searching', function() {
        scope.search = {
          bankReferenceNumber: 'fakeBankReferenceNumber'
        };
        scope.searchCashBags();
        var expectedCompanyId = servedCompanyDataJSON.chCompany.companyId;
        var expectedParameter = jasmine.objectContaining({
          bankReferenceNumber: 'fakeBankReferenceNumber'
        });
        expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(expectedCompanyId, expectedParameter);
      });
    });
  });

  describe('submitCashBag', function() {
    beforeEach(function() {
      scope.updateCashBagList();
      scope.$digest();
    });

    it('should call updateCashBag', function() {
      scope.cashBagList[0].selected = true;
      scope.toggleCheckbox();
      scope.submitCashBag();
      var expectedParameter = {
        cashBags: [jasmine.objectContaining({
          bankReferenceNumber: '12345'
        })]
      };
      var expectedCompanyId = servedCompanyDataJSON.chCompany.companyId;
      expect(cashBagFactory.updateCashBag).toHaveBeenCalledWith(expectedCompanyId, expectedParameter, {
        submission: 'submit'
      });
    });

    it('should not call updateCashBag', function() {
      scope.submitCashBag();
      expect(cashBagFactory.updateCashBag).not.toHaveBeenCalled();
    });

    it('should call getCashBagList after success', function() {
      scope.cashBagList[0].selected = true;
      scope.toggleCheckbox();
      scope.submitCashBag();
      scope.$digest();
      expect(cashBagFactory.getCashBagList).toHaveBeenCalled();
    });

    it('should call getCashBagList after success with search params', function() {
      scope.cashBagList[0].selected = true;
      CashBagSubmissionCtrl.isSearching = true;
      scope.search = {
        bankReferenceNumber: 'fakeBankReferenceNumber'
      };
      var expectedParameter = jasmine.objectContaining(scope.search);
      var expectedCompanyId = servedCompanyDataJSON.chCompany.companyId;

      scope.toggleCheckbox();
      scope.submitCashBag();
      scope.$digest();
      expect(cashBagFactory.getCashBagList).toHaveBeenCalledWith(expectedCompanyId, expectedParameter);
    });
  });

});
