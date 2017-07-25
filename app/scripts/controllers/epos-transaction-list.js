'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposTransactionListCtrl
 * @description
 * # EposTransactionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('EposTransactionListCtrl', function ($scope, $q, $filter, eposTransactionFactory) {
      var $this = this;
      $scope.viewName = 'Epos Syncronizations';
      $scope.isCollapsed = false;
      $scope.eposTransactions = []; 

      $scope.statuses = {
        B: 'All, but PreSync',
        OMICFG: 'Success',
        AJSDH: 'Error',
        NRP: 'In Progress',
        XB: 'PreSync',
      };

      $scope.statusName = {
        N:'New record',
        O:'OK',
        B:'OK, No data',
        P:'Processing Started',
        R:'Ready to Re-Start',
        S:'JSON Structure Validation Failed',
        V:'Validation Failed',
        D:'Database Constraint Failed',
        J:'Java Error (500)',
        A:'APIException Error (500)',
        E:'eMail Notification Failed',
        U:'OK, Updated',
        M:'OK, Merged',
        I:'OK, Ignored',
        C:'OK/Skipped, Commission Paid',
        F:'OK, Fixed Duplicates',
        G:'OK/Skipped, Test Schedule',
        H:'S3 double triggered'
      };
      
      $scope.displayColumns = {
        fileName: false,
        storeNumber: false,
        storeDate: false,
        threadId: false
      };
    
      $scope.search = {};
      $scope.search.status = 'B';
      $scope.search.storeDays = 3;
    
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
          offset: $this.meta.offset,
        };
        var st = $scope.search.status;
        if (st === undefined || st === 'B') {
          payload.notstatuses = 'B';            
        } else {
          payload.statuses = st;
        }
        
        if ($this.isSearch) {
          angular.extend(payload, $scope.search);
        }
        
        return payload;
      }
    
      function setDefaultMetaPayload() {
        $this.meta = {
          limit: 20,
          offset: 0,
          notstatuses: 'B'
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
          formatEposTransaction(transaction);
        });
      
        return transactions;
      }

      function formatEposTransaction(eposTransaction) {
        eposTransaction.statusName = $scope.statusName[eposTransaction.status];
        eposTransaction.statusHref = eposTransaction.status === 'B' ? '#' :
             eposTransaction.url + eposTransaction.id + '/' + eposTransaction.checksum + '/' + eposTransaction.threadId;
        eposTransaction.msg = shrink(eposTransaction.errorMsg + eposTransaction.missedFields, 40, 150);
        eposTransaction.fileNameShort = shrink(eposTransaction.fileName, 33, 55);        
      }
      
      function shrink(value, from, to) {
        if (value === undefined || value === null) {
          return '';
        } else if (value.length > to) {
          var _val = '...' + value.substring(from, to) + '...';
          return _val;
        } else {
          return value;
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