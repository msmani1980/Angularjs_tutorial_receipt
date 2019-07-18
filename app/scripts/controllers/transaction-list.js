'use strict';
/*jshint maxcomplexity:10*/
/**
 * @ngdoc function
 * @name ts5App.controller:TransactionListCtrl
 * @description
 * # TransactionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TransactionListCtrl', function ($scope, $q, $filter, transactionFactory, recordsService, currencyFactory,
                                               stationsService, globalMenuService, dateUtility, payloadUtility, messageService) {
    var $this = this;
    $scope.windowRef = null;
    $scope.viewName = 'Transactions';
    $scope.transactions = [];
    $scope.transactionTypes = ['SALE', 'REFUND', 'EmployeePurchase'];
    $scope.companyCurrencies = [];
    $scope.companyStations = [];
    $scope.paymentMethods = ['Cash', 'Credit Card', 'Discount'];
    $scope.creditCardTypes = [{ ccTypeName:'AmEx' }, { ccTypeName:'ELO' }, { ccTypeName:'MasterCard' }, { ccTypeName:'Visa' }];
    $scope.creditCardTransactionStatuses = ['New', 'Processed'];
    $scope.creditCardAuthStatuses = ['Approved', 'Not Approved'];
    $scope.overrideTransactionTypeNames = {
      CLEARED: 'Cleared',
      CREWMEAL: 'Crew Meal',
      DAMAGED: 'Damaged',
      DEFECTIVE: 'Defective',
      EmployeePurchase: 'Employee Purchase',
      PREPACK: 'Prepack',
      REFUND: 'Refund',
      REFUNDDAMAGED: 'Refund Damaged',
      REFUNDDEFECTIVE: 'Refund Defective',
      REFUNDNOCHANGE: 'Refund No Change',
      REMOVE: 'Remove',
      SALE: 'Sale',
      STOCKOUT: 'Stockout',
      TOPUP: 'Topup',
      TRANSFER: 'Transfer',
      VOIDED: 'Voided'
    };
    $scope.displayColumns = {
      paymentId: true,
      transactionId: true,
      scheduleNumber: false,
      scheduleDate: false,
      storeNumber: false,
      storeDate: false,
      storeInstance: false
    };

    $scope.search = {};
    $scope.isSearchLoading = false;
    $scope.isCreditCardPaymentSelected = false;
    $scope.search.transactionStartDate = dateUtility.yesterdayFormattedDatePicker();
    $scope.search.transactionEndDate = dateUtility.tomorrowFormattedDatePicker();
    $scope.isSearch = false;
    $scope.isAllChecked = false;

    $scope.printStoreNumber = function (transaction) {
      if (transaction.storeNumber) {
        return transaction.storeNumber;
      }

      return transaction.originStoreNumber;
    };

    $scope.printStoreInstanceId = function (transaction) {
      if (transaction.storeInstanceId) {
        return transaction.storeInstanceId;
      }

      return transaction.originStoreInstanceId;
    };

    $scope.printScheduleDate = function (transaction) {
      if (transaction.scheduleDate) {
        return transaction.scheduleDate;
      }

      return transaction.originScheduleDate;
    };

    $scope.printPropertyIfItIsCreditCardPayment = function (transaction, propertyName) {
      if (transaction.paymentMethod && transaction.paymentMethod === 'Credit Card' && transaction.hasOwnProperty(propertyName)) {
        return transaction[propertyName];
      }

      return '';
    };

    $scope.printTransactionTypeName = function (transaction) {
      if (transaction.orderTypeId === 3) {
        return 'EMPLOYEE PURCHASE';
      }
      
      if (transaction.transactionTypeName && transaction.transactionTypeName === 'VOIDED') {
        return 'SALE';
      }

      return transaction.transactionTypeName;
    };

    function calculateRefundTransactionAmount(transaction) {
      if (transaction.paymentMethod === 'Credit Card') {
        return transaction.transactionAmount + ' ' + transaction.currencyCode;
      }

      if (transaction.paymentMethod === 'Cash') {
        return transaction.tenderedAmount + ' ' + transaction.currencyCode;
      }

      return transaction.totalAmount + ' ' + transaction.currencyCode;
    }

    $scope.printTransactionAmount = function (transaction) {
      if (transaction.transactionTypeName === 'REFUND') {
        return calculateRefundTransactionAmount(transaction);
      }

      if ((transaction.totalAmount === 0 && transaction.discountTypeName === 'Comp')) {
        return transaction.totalAmount + ' ' + transaction.currencyCode;
      }

      if (isPaymentMethodVoucherOrDiscount(transaction)) {
        return 0 + ' ' + transaction.transactionCurrencyCode;
      }

      return nanToZero(transaction.transactionAmount) + ' ' + transaction.transactionCurrencyCode;
    };

    function nanToZero(number) {
      return number || 0;
    }

    $scope.printPaymentMethodName = function (transaction) {
      if (transaction.paymentMethod && transaction.paymentMethod === 'Discount' && transaction.discountTypeName) {
        return transaction.discountTypeName;
      }

      return transaction.paymentMethod;
    };

    $this.meta = {};

    function isNotVoidedSaleTransaction(transaction) {
      var isVoidedSaleTransaction = transaction.parentId &&
        transaction.transactionTypeName === 'SALE';

      return !isVoidedSaleTransaction;
    }

    function isNotSaleChangeTransaction(transaction) {
      var isSaleChangeTransaction = (transaction.transactionTypeName === 'SALE' || transaction.transactionTypeName === 'SALE (Crew)' || transaction.transactionTypeName === 'VOIDED') &&
        transaction.transactionChangeDue  &&
        transaction.transactionChangeDue !== 0;

      return !isSaleChangeTransaction;
    }

    function isTransactionCashOrCC(transaction) {
      return transaction.paymentMethod === 'Cash' || transaction.paymentMethod === 'Credit Card';
    }

    function isPaymentMethodVoucherOrDiscount(transaction) {
      return transaction.paymentMethod === 'Discount' || transaction.paymentMethod === 'Voucher';
    }

    function isDiscountTransactionFullyPaidOff(transaction) {
      return (transaction.totalAmount === 0 && transaction.discountTypeName === 'Comp') ||
        (
          transaction.transactionAmount > 0 &&
          transaction.totalAmount > 0 &&
          (transaction.totalAmount -  transaction.transactionAmount) >= 0
        );
    }

    function filterNotFullyPaidOffDiscount(transaction) {
      return isTransactionCashOrCC(transaction) ||
        (
          isPaymentMethodVoucherOrDiscount(transaction) &&
          isDiscountTransactionFullyPaidOff(transaction)
        );
    }

    function isCreditCardPaymentSelected(paymentMethods) {
      if (!paymentMethods) {
        return false;
      }

      return paymentMethods.indexOf('Credit Card') > -1;
    }
    
    this.showResponseError = function(response) {
      var errorVar = response.data;
      $scope.isSearchLoading = false;
      if (errorVar.indexOf('not a valid') !== -1) {
        hideLoadingBar();
      } else {
        hideLoadingBar();
        $scope.displayError = true;
        $scope.errorResponse = errorVar;  
      }
    };

    this.showFilterPanel = function() {
      angular.element('#search-collapse').removeClass('collapse');
    };

    function resetCreditCardSearchInputs() {
      $scope.search.cardHolderName = null;
      $scope.search.cardTypes = null;
      $scope.search.lastFour = null;
      $scope.search.ccTransactionStatuses = null;
      $scope.search.ccAuthorizationStatuses = null;
    }

    $scope.$watch('search.paymentMethods', function (paymentMethods) {
      if (isCreditCardPaymentSelected(angular.copy(paymentMethods))) {
        $scope.isCreditCardPaymentSelected = true;
      } else {
        $scope.isCreditCardPaymentSelected = false;
        resetCreditCardSearchInputs();
      }
    }, true);

    $scope.toggleColumnView = function (columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.getOverriddenTransactionTypeName = function (transactionTypeName) {
      if (transactionTypeName in $scope.overrideTransactionTypeNames) {
        return $scope.overrideTransactionTypeNames[transactionTypeName];
      }

      return transactionTypeName;
    };

    $scope.getTransactions = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();

      transactionFactory.getTransactionList(generateGetTransactionsPayload()).then(appendTransactions, $this.showResponseError);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.clearSearch = function () {
      $scope.search = {};
      $scope.isSearch = false;
      $scope.transactions = [];
      $scope.isSearchLoading = false;
      $scope.isAllChecked = false;
    };

    $scope.searchTransactions = function () {
      $scope.isSearchLoading = true;
      $scope.isSearch = true;
      clearTransactions();
      setDefaultMetaPayload();

      $scope.getTransactions();
    };

    $scope.getSeatNumber = function (seatNumber) {
      var result = (seatNumber === 0 ? '' : seatNumber);
      return result; 
    };

    $scope.showTransactionDetails = function (transaction) {
      window.open('/transactions/index.html?transactionId=' + transaction.transactionId);
    };
    
    $scope.showSelectedTransactionDetails = function () {
      if ($scope.windowRef !== null) {
        $scope.windowRef.close();
      }
        
      var data = '';
      for (var i = 0; i < $scope.transactions.length; i++) {
        if ($scope.transactions[i].selected) {
          data += $scope.transactions[i].transactionId + ',';
        }
      }

      data = data.replace(/,\s*$/, '');
      if (data.length === 0) {
        showMessage('Please Select at least one ePOS Receipts...', 'info');
        return;
      }
      
      localStorage.removeItem('receiptTxnIds');
      localStorage.setItem('receiptTxnIds', data);
      
      var requestParam = 'startDate=' + generateGetTransactionsPayload().transactionStartDate + '&endDate=' + generateGetTransactionsPayload().transactionEndDate;

      if (generateGetTransactionsPayload().transactionId) {
        requestParam += '&transactionId=' + generateGetTransactionsPayload().transactionId;
      }
      
      if (generateGetTransactionsPayload().paymentId) {
        requestParam += '&paymentId=' + generateGetTransactionsPayload().paymentId;
      }
      
      if (generateGetTransactionsPayload().scheduleNumber) {
        requestParam += '&scheduleNumber=' + generateGetTransactionsPayload().scheduleNumber;
      }
      
      if (generateGetTransactionsPayload().storeInstanceId) {
        requestParam += '&storeInstanceId=' + generateGetTransactionsPayload().storeInstanceId;
      }
      
      if (generateGetTransactionsPayload().storeNumber) {
        requestParam += '&storeNumber=' + generateGetTransactionsPayload().storeNumber;
      }
      
      $scope.windowRef = window.open('/transactions/epos-sales-receipts.html?' + requestParam);
    };
    
    $scope.checkUncheckHeader = function () {
      $scope.isAllChecked = true;
      for (var i = 0; i < $scope.transactions.length; i++) {
        if (!$scope.transactions[i].selected) {
          $scope.isAllChecked = false;
          break;
        }
      }
    };

    $scope.checkUncheckHeader();

    $scope.checkUncheckAll = function () {
      for (var i = 0; i < $scope.transactions.length; i++) {
        $scope.transactions[i].selected = $scope.isAllChecked;
      }
    };
    
    function showMessage(message, messageType) {
      messageService.display(messageType, '<strong>EPOS Receipts</strong>: ' + message);
    }
    
    function sanitizeSearchPayload(payload) {
      payloadUtility.sanitize(payload);

      if (payload.paymentMethods) {
        payload.paymentMethods = payload.paymentMethods.join(',');
      }

      if (payload.transactionType && payload.transactionType === 'SALE') {
        payload.transactionType = 'SALE,VOIDED';
      }

      if (payload.transactionType && payload.transactionType === 'EmployeePurchase') {
        payload.transactionType = 'SALE,VOIDED';
        payload.orderTypeId = 3;
      }
    }

    function generateGetTransactionsPayload() {
      var payload = {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        'withoutTransactionTypes[0]': 'ABANDONED',
        'withoutPaymentMethods[0]': 'Promotion'
      };

      if ($scope.isSearch) {
        angular.extend(payload, $scope.search);
      }
      
      payload.transactionStartDate = payloadUtility.serializeDate(payload.transactionStartDate ? payload.transactionStartDate : dateUtility.yesterdayFormattedDatePicker());
      payload.transactionEndDate = payloadUtility.serializeDate(payload.transactionEndDate ? payload.transactionEndDate : dateUtility.tomorrowFormattedDatePicker());

      sanitizeSearchPayload(payload);
      return payload;
    }

    function setDefaultMetaPayload() {
      $scope.isSearch = true;
      $this.meta = {
        limit: 100,
        offset: 0
      };
    }

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function showLoadingModal(text) {
      angular.element('.loading-more').show();
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('.loading-more').hide();
      angular.element('#loading').modal('hide');
    }

    function normalizeTransactions(transactions) {
      angular.forEach(transactions, function (transaction) {
        formatTimestampIfDefined(transaction, 'transactionDate');
        formatDateIfDefined(transaction, 'scheduleDate');
        formatDateIfDefined(transaction, 'storeDate');
        formatDateIfDefined(transaction, 'instanceDate');
        formatTimestampIfDefined(transaction, 'ccProcessedDate');
      });

      return transactions;
    }

    function formatDateIfDefined(transaction, dateFieldName) {
      if (transaction.hasOwnProperty(dateFieldName) && transaction[dateFieldName]) {
        transaction[dateFieldName] = dateUtility.formatDateForApp(transaction[dateFieldName]);
      }
    }
    
    function formatTimestampIfDefined(transaction, dateFieldName) {
        if (transaction.hasOwnProperty(dateFieldName) && transaction[dateFieldName]) {
          transaction[dateFieldName] = dateUtility.formatTimestampForApp(transaction[dateFieldName]);
        }
      }

    function appendTransactions(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var transactions = angular.copy(dataFromAPI.transactions)
        .filter(isNotVoidedSaleTransaction)
        .filter(isNotSaleChangeTransaction)
        .filter(filterNotFullyPaidOffDiscount);

      $scope.transactions = $scope.transactions.concat(normalizeTransactions(transactions));
      if ($scope.transactions.length === 0) {
        $this.showFilterPanel();
      }

      hideLoadingBar();
      $scope.isSearchLoading = false;
    }

    function clearTransactions() {
      $scope.transactions = [];
      $scope.isAllChecked = false;
    }

    function setCompanyCurrencies(dataFromAPI) {
      var distinctCurrencies = $filter('unique')(dataFromAPI.response, 'id');
      $scope.companyCurrencies = angular.copy(distinctCurrencies);
    }

    function setCompanyStations(dataFromAPI) {
      $scope.companyStations = angular.copy(dataFromAPI.response);
    }

    function getCompanyCurrencies() {
      currencyFactory.getCompanyCurrencies().then(setCompanyCurrencies);
    }

    function getCompanyStations() {
      stationsService.getGlobalStationList().then(setCompanyStations);
    }

    function makeDependencyPromises() {
      return [
        getCompanyCurrencies(),
        getCompanyStations()
      ];
    }

    function dependenciesSuccess() {
      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Transactions.');
      setDefaultMetaPayload();

      $q.all(makeDependencyPromises()).then(dependenciesSuccess);
    }

    init();

  });