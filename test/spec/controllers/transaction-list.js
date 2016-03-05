'use strict';

describe('Controller: TransactionListCtrl', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('served/transactions.json'));
  beforeEach(module('served/transaction-types.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/company-station-globals.json'));
  beforeEach(module('served/company-cc-types.json'));

  var TransactionListCtrl;
  var scope;
  var transactionFactory;
  var transactionsJSON;
  var transactionTypesJSON;
  var companyCurrenciesJSON;
  var companyStationsJSON;
  var companyCreditCardTypesJSON;
  var getTransactionListDeferred;
  var getTransactionTypesDeferred;
  var getCompanyCurrenciesDeferred;
  var getCompanyStationsDeferred;
  var getCreditCardTypesDeferred;

  beforeEach(inject(function($controller, $rootScope, $q, _transactionFactory_, recordsService, currencyFactory,
    stationsService, companyCcTypesService) {
    inject(function(_servedTransactions_, _servedTransactionTypes_, _servedCompanyCurrencyGlobals_,
      _servedCompanyStationGlobals_, _servedCompanyCcTypes_) {
      transactionsJSON = _servedTransactions_;
      transactionTypesJSON = _servedTransactionTypes_;
      companyCurrenciesJSON = _servedCompanyCurrencyGlobals_;
      companyStationsJSON = _servedCompanyStationGlobals_;
      companyCreditCardTypesJSON = _servedCompanyCcTypes_;
    });

    transactionFactory = _transactionFactory_;

    scope = $rootScope.$new();
    getTransactionListDeferred = $q.defer();
    getTransactionListDeferred.resolve(transactionsJSON);
    getTransactionTypesDeferred = $q.defer();
    getTransactionTypesDeferred.resolve(transactionTypesJSON);
    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(companyCurrenciesJSON);
    getCompanyStationsDeferred = $q.defer();
    getCompanyStationsDeferred.resolve(companyStationsJSON);
    getCreditCardTypesDeferred = $q.defer();
    getCreditCardTypesDeferred.resolve(companyCreditCardTypesJSON);

    spyOn(transactionFactory, 'getTransactionList').and.returnValue(getTransactionListDeferred.promise);
    spyOn(recordsService, 'getTransactionTypes').and.returnValue(getTransactionTypesDeferred.promise);
    spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
    spyOn(stationsService, 'getGlobalStationList').and.returnValue(getCompanyStationsDeferred.promise);
    spyOn(companyCcTypesService, 'getCCtypes').and.returnValue(getCreditCardTypesDeferred.promise);

    TransactionListCtrl = $controller('TransactionListCtrl', {
      $scope: scope
        // place here mocked dependencies
    });
    scope.getTransactions();
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function() {
    expect(scope.viewName).toBe('Transactions');
  });

  describe('search.paymentMethods change will ', function() {
    it('set isCreditCardPaymentSelected to false in case credit card is not selected', function() {
      scope.search = {
        paymentMethods: ['Cash']
      };
      scope.$digest();

      expect(scope.isCreditCardPaymentSelected).toBe(false);
    });

    it('set isCreditCardPaymentSelected to true in case credit card is selected', function() {
      scope.search = {
        paymentMethods: ['Cash']
      };

      scope.search.paymentMethods.push('Credit Card');
      scope.$digest();

      expect(scope.isCreditCardPaymentSelected).toBe(true);
    });

    it('reset credit card search fields in case credit card is deselected', function() {
      scope.search = {
        paymentMethods: ['Cash', 'Credit Card'],
        cardHolderName: 'Card Holder',
        cardTypes: 'Visa',
        lastFour: '1234',
        ccTransactionStatuses: 'New',
        ccAuthorizationStatuses: 'Approved'
      };
      scope.$digest();

      scope.search.paymentMethods.pop();
      scope.$digest();

      var expectedSearch = scope.search = {
        paymentMethods: ['Cash'],
        cardHolderName: null,
        cardTypes: null,
        lastFour: null,
        ccTransactionStatuses: null,
        ccAuthorizationStatuses: null
      };

      expect(scope.search).toBe(expectedSearch);
    });
  });

  it('toggleColumnView will set field view value to true', function() {
    scope.toggleColumnView('storeInstance');

    expect(scope.displayColumns.storeInstance).toBe(true);
  });

  describe('getTransactions will', function() {
    it('call getTransactionList if offset is not greater than count', function() {
      scope.getTransactions();

      expect(transactionFactory.getTransactionList).toHaveBeenCalled();
    });
    it('update meta offset', function() {
      var offset = TransactionListCtrl.meta.offset;
      scope.getTransactions();

      expect(TransactionListCtrl.meta.offset).toBe(offset + 100);
    });
  });

  describe('clearSearch will', function() {
    it('clear search object', function() {
      scope.search = {
        storeInstanceId: 1
      };

      scope.clearSearch();
      expect(scope.search).toEqual({});
    });
    it('call getTransactionList method', function() {
      scope.clearSearch();
      expect(transactionFactory.getTransactionList).toHaveBeenCalled();
    });
  });

  describe('searchTransactions will', function() {
    it('set isSearch to true', function() {
      scope.searchTransactions();
      expect(TransactionListCtrl.isSearch).toBe(true);
    });
    it('call getTransactionList method', function() {
      scope.clearSearch();
      expect(transactionFactory.getTransactionList).toHaveBeenCalled();
    });
  });
});
