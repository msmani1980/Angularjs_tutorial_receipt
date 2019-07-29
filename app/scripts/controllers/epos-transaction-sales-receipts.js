'use strict';
/*jshint maxcomplexity:7*/
/**
 * @ngdoc function
 * @name ts5App.controller:EposTransactionSalesReceiptsCtrl
 * @description
 * # EposTransactionSalesReceiptsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EposTransactionSalesReceiptsCtrl', function ($scope, $q, $filter, transactionFactory, dateUtility, payloadUtility) {
    var $this = this;
    $scope.viewName = 'EPOS Transaction Sales Receipts';
    $scope.windowRef = null;
    $scope.requestParam = '';
    $scope.transactions = [];
    $scope.isSearchLoading = false;
    $scope.search = {};
    
    $scope.generateTransactionSalesReceipts = function () {
      if (!$scope.search.transactionStartDate || !$scope.search.transactionEndDate) {
        $scope.displayError = true;
        $scope.errorResponse = { statusText: 'Select Date Range!' };
        return;
      }
      
      if (dateUtility.nowFormatted(payloadUtility.serializeDate($scope.search.transactionStartDate)) > dateUtility.nowFormatted(payloadUtility.serializeDate($scope.search.transactionEndDate))) {
        $scope.displayError = true;
        $scope.errorResponse = { statusText: 'End Date should be greater than or equal to Start Date.!' };
        return;
      }
      
      $scope.displayError = false;
      $scope.isSearchLoading = true;
      showLoadingBar();
      salesReceiptRequestParam();
      transactionFactory.getTransactionList(generateGetTransactionsPayload()).then(appendTransactions, $this.showResponseError);
    };
    
    function appendTransactions(dataFromAPI) {
      var transactions = angular.copy(dataFromAPI.transactions);
      $scope.transactions = normalizeTransactions(transactions);
      if ($scope.transactions.length === 0) {
        angular.element('.loading-no-data').show();
        hideLoadingBar();
        $scope.isSearchLoading = false;
        return;
      }

      showSelectedTransactionDetails();
      hideLoadingBar();
      $scope.isSearchLoading = false;
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
      
    function showLoadingBar() {
      angular.element('.loading-more').show();
    }
    
    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }
      
    function sanitizeSearchPayload(payload) {
      payloadUtility.sanitize(payload);
    }

    $scope.clearSearch = function () {
      $scope.search = {};
      $scope.isSearch = false;
      $scope.transactions = [];
      $scope.isSearchLoading = false;
      $scope.requestParam = '';
      angular.element('.loading-no-data').hide();
    };
    
    function salesReceiptRequestParam() {

      $scope.requestParam = 'startDate=' + $scope.search.transactionStartDate + '&endDate=' + $scope.search.transactionEndDate;

      if ($scope.search.transactionId) {
        $scope.requestParam += '&transactionId=' + $scope.search.transactionId;
      }
        
      if ($scope.search.paymentId) {
        $scope.requestParam += '&paymentId=' + $scope.search.paymentId;
      }
        
      if ($scope.search.scheduleNumber) {
        $scope.requestParam += '&scheduleNumber=' + $scope.search.scheduleNumber;
      }
        
      if ($scope.search.storeInstanceId) {
        $scope.requestParam += '&storeInstanceId=' + $scope.search.storeInstanceId;
      }
        
      if ($scope.search.storeNumber) {
        $scope.requestParam += '&storeNumber=' + $scope.search.storeNumber;
      }
      
      if ($scope.search.deviceId) {
        $scope.requestParam += '&deviceId=' + $scope.search.deviceId;
      }
      
    }
    
    function showSelectedTransactionDetails() {
      if ($scope.requestParam !== null && $scope.windowRef !== null) {
        $scope.windowRef.close();
      }
      
      var data = '';
      for (var i = 0; i < $scope.transactions.length; i++) {
        data += $scope.transactions[i].transactionId + ',';
      }

      data = data.replace(/,\s*$/, '');
      
      localStorage.removeItem('receiptTxnIds');
      localStorage.setItem('receiptTxnIds', data);
      
      $scope.windowRef = window.open('/transactions/epos-sales-receipts.html?' + $scope.requestParam);
    }  
  
    function generateGetTransactionsPayload() {
         
      var payload = {
        'withoutTransactionTypes[0]': 'ABANDONED',
        'withoutPaymentMethods[0]': 'Promotion'
      };
      
      angular.extend(payload, $scope.search);
      
      payload.transactionStartDate = payloadUtility.serializeDate(payload.transactionStartDate);
      payload.transactionEndDate = payloadUtility.serializeDate(payload.transactionEndDate);
      sanitizeSearchPayload(payload);      
      return payload;
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

    hideLoadingBar();

  });
