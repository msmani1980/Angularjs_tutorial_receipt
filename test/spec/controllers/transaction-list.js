'use strict';

describe('Controller: TransactionListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/transactions.json'));
  beforeEach(module('served/transaction-types.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/company-station-globals.json'));
  beforeEach(module('served/company-cc-types.json'));

  var TransactionListCtrl,
    scope,
    transactionsJSON,
    transactionTypesJSON,
    companyCurrenciesJSON,
    companyStationsJSON,
    companyCreditCardTypesJSON,
    getTransactionListDeferred,
    getTransactionTypesDeferred,
    getCompanyCurrenciesDeferred,
    getCompanyStationsDeferred,
    getCreditCardTypesDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, transactionFactory, recordsService, currencyFactory, stationsService, companyCcTypesService) {
    inject(function (_servedTransactions_, _servedTransactionTypes_, _servedCompanyCurrencyGlobals_, _servedCompanyStationGlobals_, _servedCompanyCcTypes_) {
      transactionsJSON = _servedTransactions_;
      transactionTypesJSON = _servedTransactionTypes_;
      companyCurrenciesJSON = _servedCompanyCurrencyGlobals_;
      companyStationsJSON = _servedCompanyStationGlobals_;
      companyCreditCardTypesJSON = _servedCompanyCcTypes_;
    });

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

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Transactions');
  });


});
