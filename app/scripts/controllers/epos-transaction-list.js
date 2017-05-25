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
      $scope.viewName = 'Epos Syncronizations';
      $scope.isCollapsed = false;
      $scope.eposTransactions = []; 
      
      $scope.statuses = {
        B: 'All, but PreSync',
        OMICF: 'Success',
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
        C:'OK, Commission Paid.',
        F:'OK, Fixed Duplicates',
        //X':'OK, reserved not used',
        H:'S3 double triggered'
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
          offset: $this.meta.offset,
        };
        var st = $scope.search.status;
        $scope.search.status = '';
        if(st === undefined || st == 'B'){
        	payload.notstatuses = 'B';        	
        } else{
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
        	formatEposTransaction(transaction); //          formatDateIfDefined(transaction, 'utcDatetime');
        });
      
        return transactions;
      }

      function formatEposTransaction(eposTransaction) {
    	 eposTransaction.statusName = $scope.statusName[eposTransaction.status];
         eposTransaction.statusHref = eposTransaction.status=='B'?'#':
        	 eposTransaction.url + eposTransaction.id +'/'+ eposTransaction.checksum +'/'+ eposTransaction.threadId;
    	 var msg = eposTransaction.errorMsg + eposTransaction.missedFields;
    	 if(msg == 0){
    		 msg = '';
      	 } else if(msg.length>170){
    	    msg = '...'+msg.substring(40, 170)+'...';
    	 }
         eposTransaction.msg = msg;
         eposTransaction.fileNameShort = eposTransaction.fileName.length>55?eposTransaction.fileName.substring(33, 53)+'...':'';
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
