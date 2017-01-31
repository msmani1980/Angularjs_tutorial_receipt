'use strict';

describe('Controller: TransactionListCtrl', function () {

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
  var getTransactionTypesDeferred;
  var getCompanyCurrenciesDeferred;
  var getCompanyStationsDeferred;
  var getCreditCardTypesDeferred;
  var filter;
  var dateUtility;

  beforeEach(inject(function ($controller, $rootScope, $q, $filter, _transactionFactory_, recordsService, currencyFactory,
                              stationsService, companyCcTypesService, $injector) {
    inject(function (_servedTransactions_, _servedTransactionTypes_, _servedCompanyCurrencyGlobals_,
                     _servedCompanyStationGlobals_, _servedCompanyCcTypes_) {
      transactionsJSON = _servedTransactions_;
      transactionTypesJSON = _servedTransactionTypes_;
      companyCurrenciesJSON = _servedCompanyCurrencyGlobals_;
      companyStationsJSON = _servedCompanyStationGlobals_;
      companyCreditCardTypesJSON = _servedCompanyCcTypes_;
    });

    transactionFactory = _transactionFactory_;
    dateUtility = $injector.get('dateUtility');
    filter = $filter;
    scope = $rootScope.$new();
    getTransactionTypesDeferred = $q.defer();
    getTransactionTypesDeferred.resolve(transactionTypesJSON);
    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(companyCurrenciesJSON);
    getCompanyStationsDeferred = $q.defer();
    getCompanyStationsDeferred.resolve(companyStationsJSON);
    getCreditCardTypesDeferred = $q.defer();
    getCreditCardTypesDeferred.resolve(companyCreditCardTypesJSON);

    spyOn(transactionFactory, 'getTransactionList').and.callFake(function() {
      var defer = $q.defer();
      defer.resolve(transactionsJSON);

      return defer.promise;
    });


    spyOn(recordsService, 'getTransactionTypes').and.returnValue(getTransactionTypesDeferred.promise);
    spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
    spyOn(stationsService, 'getGlobalStationList').and.returnValue(getCompanyStationsDeferred.promise);
    spyOn(companyCcTypesService, 'getCCtypes').and.returnValue(getCreditCardTypesDeferred.promise);

    TransactionListCtrl = $controller('TransactionListCtrl', {
      $scope: scope
    });
    scope.getTransactions();
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Transactions');
  });

  describe('search.paymentMethods change will ', function () {
    it('set isCreditCardPaymentSelected to false in case credit card is not selected', function () {
      scope.search = {
        paymentMethods: ['Cash']
      };
      scope.$digest();

      expect(scope.isCreditCardPaymentSelected).toBe(false);
    });

    it('set isCreditCardPaymentSelected to true in case credit card is selected', function () {
      scope.search = {
        paymentMethods: ['Cash']
      };

      scope.search.paymentMethods.push('Credit Card');
      scope.$digest();

      expect(scope.isCreditCardPaymentSelected).toBe(true);
    });

    it('reset credit card search fields in case credit card is deselected', function () {
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

  it('toggleColumnView will set field view value to true', function () {
    scope.toggleColumnView('storeInstance');

    expect(scope.displayColumns.storeInstance).toBe(true);
  });

  describe('setCompanyCurrencies will', function () {
    it('should set the companyCurrencies to the distinct values', function() {
      var uniqueCompanyCurrencies = filter('unique')(companyCurrenciesJSON.response, 'id');
      expect(scope.companyCurrencies).toEqual(uniqueCompanyCurrencies);
    });
  });

  describe('getTransactions will', function () {
    it('call getTransactionList if offset is not greater than count', function () {
      scope.getTransactions();

      expect(transactionFactory.getTransactionList).toHaveBeenCalled();
    });

    it('update meta offset', function () {
      var offset = TransactionListCtrl.meta.offset;
      scope.getTransactions();

      expect(TransactionListCtrl.meta.offset).toBe(offset + 100);
    });
  });

  describe('isNotSaleChangeTransaction will', function () {
    it('filter out transactions with change due amount', function () {
      var transactionsWithChangeDue = scope.transactions.filter(function (transaction) {
        return transaction.transactionTypeName === 'SALE' &&
          transaction.transactionChangeDue  &&
          transaction.transactionChangeDue > 0;
      });
      expect(transactionsWithChangeDue.length).toEqual(0);
    });
  });

  describe('filterNotFullyPaidOffDiscount will', function () {
    it('filter out transactions with discounts that are not fully paid off', function () {
      var transactionsNotFullyPaidOffDiscount = scope.transactions.filter(function (transaction) {
        return (transaction.transactionTypeName === 'SALE' && (transaction.paymentMethod === 'Discount' || transaction.paymentMethod === 'Voucher')) &&
          (
            (transaction.totalAmount !== 0 && transaction.discountTypeName === 'Comp') ||
            (transaction.totalAmount > 0 && transaction.transactionAmount> 0 && (transaction.totalAmount -  transaction.transactionAmount) >= 0)
          );
      });

      expect(transactionsNotFullyPaidOffDiscount.length).toEqual(9);
    });
  });

  describe('clearSearch will', function () {
    it('clear search object', function () {
      scope.search = {
        storeInstanceId: 1
      };

      scope.clearSearch();
      expect(scope.search).toEqual({});
    });

    it('should clear transactions', function () {
      scope.clearSearch();
      expect(scope.transactions).toEqual([]);
    });
  });

  describe('searchTransactions will', function () {
    it('set isSearch to true', function () {
      scope.searchTransactions();
      expect(TransactionListCtrl.isSearch).toBe(true);
    });

    it('call getTransactionList method', function () {
      scope.clearSearch();
      expect(transactionFactory.getTransactionList).toHaveBeenCalled();
    });
  });

  describe('printPropertyIfItIsCreditCardPayment will', function () {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        id: 31237,
        arrivalStationCode: 'LAX',
        cardHolderName: null,
        cardType: null,
        carrierNumber: null,
        ccAuthorizationStatus: null,
        ccProcessedDate: '2015-08-29 14:13:08.333',
        ccTransactionStatus: 'New',
        companyCarrierInstanceId: 6481,
        companyId: 403,
        currencyCode: 'GBP',
        currencyId: 8,
        departureStationCode: 'ORD',
        instanceDate: '2015-08-28',
        lastFour: null,
        passengerName: 'William White',
        paymentMethod: 'Credit Card',
        scheduleNumber: '115',
        totalAmount: '2.50',
        transactionAmount: '1.50',
        transactionCurrencyCode: 'GBP',
        paymentId: '2f1186a3-9342-4df1-a226-6ee70c3a4827',
        tranCreatedBy: '1002',
        transactionDate: '2015-08-28 16:24:27.196',
        transactionId: '00ba1022-0d95-4129-af56-0aa51dda0dd2',
        transactionTypeId: 1,
        transactionTypeName: 'SALE',
        parentId: null,
        ccTypeCode: null,
        ccTypeId: null,
        storeInstanceId: null,
        storeId: null,
        storeNumber: null
      };
    });

    it('print CCTransactionID for Credit Card transaction', function () {
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'paymentId')).toEqual(transactionMock.paymentId);
    });

    it('print empty string for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';

      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'paymentId')).toEqual('');
    });

    it('print empty string for undefined paymentMethod field', function () {
      transactionMock.paymentMethod = undefined;

      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'paymentId')).toEqual('');
    });

    it('do not print field cardType for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'cardType')).toEqual('');
    });

    it('do not print field lastFour for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'lastFour')).toEqual('');
    });

    it('should have store date formatted', function () {
      expect(scope.transactions[0].storeDate).toEqual(dateUtility.formatDateForApp(transactionsJSON.transactions[0].storeDate));
    });

    it('should have transactionDate formatted', function () {
      expect(scope.transactions[0].transactionDate).toEqual(dateUtility.formatDateForApp(transactionsJSON.transactions[0].transactionDate));
    });

    it('should have scheduleDate formatted', function () {
      expect(scope.transactions[0].scheduleDate).toEqual(dateUtility.formatDateForApp(transactionsJSON.transactions[0].scheduleDate));
    });

    it('should have instanceDate formatted', function () {
      expect(scope.transactions[0].instanceDate).toEqual(dateUtility.formatDateForApp(transactionsJSON.transactions[0].instanceDate));
    });

    it('should have ccProcessedDate formatted', function () {
      expect(scope.transactions[0].ccProcessedDate).toEqual(dateUtility.formatDateForApp(transactionsJSON.transactions[0].ccProcessedDate));
    });

    it('do not print field ccProcessedDate for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'ccProcessedDate')).toEqual('');
    });

    it('do not print field ccTransactionStatus for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'ccTransactionStatus')).toEqual('');
    });

    it('do not print field paymentId for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'paymentId')).toEqual('');
    });

    it('do not print field ccAuthorizationStatus for non Credit Card transaction', function () {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPropertyIfItIsCreditCardPayment(transactionMock, 'ccAuthorizationStatus')).toEqual('');
    });
  });

  describe('printTransactionTypeName will', function () {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        transactionTypeName: 'SALE'
      };
    });

    it('print transactionTypeName if it is not VOIDED transaction', function () {
      expect(scope.printTransactionTypeName(transactionMock)).toEqual(transactionMock.transactionTypeName);
    });

    it('print transactionTypeName as SALE if it is VOIDED transaction', function () {
      transactionMock.transactionTypename = 'VOIDED';
      expect(scope.printTransactionTypeName(transactionMock)).toEqual('SALE');
    });
  });

  describe('printTransactionAmount will', function () {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        transactionAmount: 1.50,
        transactionCurrencyCode: 'GBP'
      };
    });

    it('print transactionAmount if printTransactionAmount is defined', function () {
      expect(scope.printTransactionAmount(transactionMock)).toEqual(transactionMock.transactionAmount + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print transactionAmount as 0 if printTransactionAmount is not defined', function () {
      transactionMock.transactionAmount = null;
      expect(scope.printTransactionAmount(transactionMock)).toEqual(0 + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print netTransactionAmount if transactionTypeName is SALE and paymentMethod is Cash', function () {
      transactionMock.transactionAmount = 1;
      transactionMock.netTransactionAmount = 1;
      transactionMock.paymentMethod = 'Cash';
      transactionMock.transactionTypeName = 'SALE'
      ;
      expect(scope.printTransactionAmount(transactionMock)).toEqual(transactionMock.transactionAmount + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print transactionAmount if netTransactionAmount is not defined and transactionAmount is', function () {
      transactionMock.netTransactionAmount = null;
      transactionMock.paymentMethod = 'Cash';
      transactionMock.transactionTypeName = 'SALE'
      ;
      expect(scope.printTransactionAmount(transactionMock)).toEqual(transactionMock.transactionAmount + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print as 0 if netTransactionAmount is not defined and transactionAmount is not defined', function () {
      transactionMock.netTransactionAmount = null;
      transactionMock.transactionAmount = null;
      transactionMock.paymentMethod = 'Cash';
      transactionMock.transactionTypeName = 'SALE'
      ;
      expect(scope.printTransactionAmount(transactionMock)).toEqual(0 + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print as 0 transactionTypeName if Comp Discount fully paid off transaction ', function () {
      transactionMock.netTransactionAmount = 10;
      transactionMock.transactionAmount = 20;
      transactionMock.totalAmount = 0;
      transactionMock.paymentMethod = 'SALE';
      transactionMock.discountTypeName = 'Comp';
      transactionMock.transactionTypeName = 'Discount'
      ;
      expect(scope.printTransactionAmount(transactionMock)).toEqual(0 + ' ' + transactionMock.transactionCurrencyCode);
    });

    it('print as negative totalAmount if transactionTypeName is "REFUND" and totalAmount is negative value', function () {
      transactionMock.netTransactionAmount = -10;
      transactionMock.transactionAmount = -20;
      transactionMock.totalAmount = -10;
      transactionMock.paymentMethod = 'Cash';
      transactionMock.transactionTypeName = 'REFUND';
      expect(scope.printTransactionAmount(transactionMock)).toEqual(transactionMock.totalAmount + ' ' + transactionMock.transactionCurrencyCode);
    });
  });

  describe('printPaymentMethodName will', function() {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        paymentMethod: 'Discount',
        discountTypeName: 'Comp'
      };
    });

    it('print paymentMethod if paymentMethod is not Discount', function() {
      transactionMock.paymentMethod = 'Cash';
      expect(scope.printPaymentMethodName(transactionMock)).toEqual(transactionMock.paymentMethod);
    });
    it('print as discountTypeName if paymentMethod is Discount and discountTypeName is defined', function() {
      expect(scope.printPaymentMethodName(transactionMock)).toEqual(transactionMock.discountTypeName);
    });
    it('print as paymentMethod if paymentMethod is Discount and discountTypeName is not defined', function() {
      transactionMock.discountTypeName = null;
      expect(scope.printPaymentMethodName(transactionMock)).toEqual(transactionMock.paymentMethod);
    });
  });

  describe('printStoreNumber will', function() {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        storeNumber: 'X123',
        originStoreNumber: null
      };
    });

    it('print storeNumber if storeNumber is defined', function() {
      expect(scope.printStoreNumber(transactionMock)).toEqual(transactionMock.storeNumber);
    });
    it('print originStoreNumber if storeNumber is not defined', function() {
      transactionMock.storeNumber = null;
      transactionMock.originStoreNumber = 'Y321';
      expect(scope.printStoreNumber(transactionMock)).toEqual(transactionMock.originStoreNumber);
    });
  });

  describe('printStoreInstanceId will', function() {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        storeInstanceId: 6408,
        originStoreInstanceId: null
      };
    });

    it('print storeInstanceId if storeInstanceId is defined', function() {
      expect(scope.printStoreInstanceId(transactionMock)).toEqual(transactionMock.storeInstanceId);
    });
    it('print originStoreInstanceId if storeInstanceId is not defined', function() {
      transactionMock.storeInstanceId = null;
      transactionMock.originStoreInstanceId = 6407;
      expect(scope.printStoreInstanceId(transactionMock)).toEqual(transactionMock.originStoreInstanceId);
    });
  });

  describe('printScheduleDate will', function() {
    var transactionMock;
    beforeEach(function () {
      transactionMock = {
        scheduleDate: '31/08/2016',
        originScheduleDate: null
      };
    });

    it('print scheduleDate if scheduleDate is defined', function() {
      expect(scope.printScheduleDate(transactionMock)).toEqual(transactionMock.scheduleDate);
    });
    it('print originScheduleDate if scheduleDate is not defined', function() {
      transactionMock.scheduleDate = null;
      transactionMock.originScheduleDate = '31/08/2016';
      expect(scope.printScheduleDate(transactionMock)).toEqual(transactionMock.originScheduleDate);
    });
  });
});
