'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposTransactionListCtrl
 * @description
 * # EposTransactionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('EposTransactionListCtrl', function ($scope, $q, $filter, eposTransactionFactory, dateUtility) {
      var $this = this;
      $scope.viewName = 'Epos Transactions';
      
      $scope.eposTransactions = []; 
      
      $scope.statuses = {
        All: 'All',
        OM: 'Success',
        AJSD: 'Error',
        NRP: 'InProgress',
        B: 'NotStatus'
      };
      
      $scope.displayColumns = {
        fileName: false,
        storeNumber: false,
        storeDate: false,
        threadId: false
      };
    
      $scope.search = {};
    
      $scope.printStoreNumber = function (eposTransactions) {
        if (eposTransactions.storeNumber) {
          return eposTransactions.storeNumber;
        }
        
        return eposTransactions.originStoreNumber;
      };
    
      $scope.printStoreInstanceId = function (eposTransaction) {
        if (eposTransaction.storeInstanceId) {
          return eposTransaction.storeInstanceId;
        }
        
        return eposTransaction.originStoreInstanceId;
      };
    
      $scope.printScheduleDate = function (eposTransaction) {
        if (eposTransaction.scheduleDate) {
          return eposTransaction.scheduleDate;
        }
        
        return eposTransaction.originScheduleDate;
      };
     
      $this.meta = {};
      
      $this.isSearch = false;    
      
      $scope.toggleColumnView = function (columnName) {
        if (angular.isDefined($scope.displayColumns[columnName])) {
          $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
        }
        
      };
    
      $scope.getEposTransactions = function () {
        if ($this.meta.offset >= $this.meta.count) {
          return;
        }
        
        showLoadingBar();
    
        eposTransactionFactory.getEposTransactionList(generateGetTransactionsPayload()).then(appendTransactions);
        $this.meta.offset += $this.meta.limit;
      };
    
      $scope.clearSearch = function () {
        $scope.search = {};
        $scope.eposTransactions = [];
      };
    
      $scope.searchEposTransactions = function () {
        $this.isSearch = true;
        clearEposTransactions();
        setDefaultMetaPayload();
        
        $scope.getEposTransactions();
      };
    
      function generateGetTransactionsPayload() {
        var payload = {
          limit: $this.meta.limit,
          offset: $this.meta.offset
        };

        if ($this.isSearch) {
          angular.extend(payload, $scope.search);
        }

        return payload;
      }
    
      function setDefaultMetaPayload() {
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
      
      function normalizeTransactions(transactions) {
        angular.forEach(transactions, function (transaction) {
          formatDateIfDefined(transaction, 'utcDatetime');
        });
      
        return transactions;
      }
      
      function formatDateIfDefined(transaction, dateFieldName) {
        if (transaction.hasOwnProperty(dateFieldName) && transaction[dateFieldName]) {
          transaction[dateFieldName] = dateUtility.formatDateForApp(transaction[dateFieldName]);
        }
      }
      
      function appendTransactions(dataFromAPI) {
        $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
        var eposTransactions = angular.copy(dataFromAPI.response);    
        $scope.eposTransactions = $scope.eposTransactions.concat(normalizeTransactions(eposTransactions));
        hideLoadingBar();
      }
      
      function clearEposTransactions() {
        $scope.eposTransactions = [];
      }
      
      function init() {
        setDefaultMetaPayload();
      }
      
      init();

    });
