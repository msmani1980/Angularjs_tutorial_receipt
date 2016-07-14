'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TransactionListCtrl
 * @description
 * # TransactionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TransactionListCtrl', function($scope, $q, transactionFactory, recordsService, currencyFactory,
    stationsService, companyCcTypesService, globalMenuService, dateUtility, payloadUtility) {
    var $this = this;

    $scope.viewName = 'Transactions';
    $scope.transactions = [];
    $scope.transactionTypes = [];
    $scope.companyCurrencies = [];
    $scope.companyStations = [];
    $scope.paymentMethods = ['Cash', 'Credit Card'];
    $scope.creditCardTypes = [];
    $scope.creditCardTransactionStatuses = ['New', 'Processed'];
    $scope.creditCardAuthStatuses = ['Approved', 'Declined'];
    $scope.supportedTransactionTypes = ['SALE', 'REFUND', 'EmployeePurchase'];
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
      scheduleNumber: false,
      scheduleDate: false,
      storeNumber: false,
      storeDate: false,
      storeInstance: false
    };

    $scope.search = {};
    $scope.isCreditCardPaymentSelected = false;
    $scope.printCCTransactionId = function (transaction) {
      if (transaction.paymentMethod && transaction.paymentMethod === 'Credit Card') {
        return transaction.paymentId;
      } else {
        return '';
      }
    };

    $this.meta = {};
    $this.isSearch = false;

    var ABANDONED_TRANSACTION_TYPE_NAME = 'ABANDONED';

    function isNotAbandoned(transaction) {
      return transaction.transactionTypeName !== ABANDONED_TRANSACTION_TYPE_NAME;
    }

    function isCreditCardPaymentSelected(paymentMethods) {
      if (!paymentMethods) {
        return false;
      }

      return paymentMethods.indexOf('Credit Card') > -1;
    }

    function resetCreditCardSearchInputs() {
      $scope.search.cardHolderName = null;
      $scope.search.cardTypes = null;
      $scope.search.lastFour = null;
      $scope.search.ccTransactionStatuses = null;
      $scope.search.ccAuthorizationStatuses = null;
    }

    $scope.$watch('search.paymentMethods', function(paymentMethods) {
      if (isCreditCardPaymentSelected(angular.copy(paymentMethods))) {
        $scope.isCreditCardPaymentSelected = true;
      } else {
        $scope.isCreditCardPaymentSelected = false;
        resetCreditCardSearchInputs();
      }
    }, true);

    $scope.toggleColumnView = function(columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.filterTransactionTypes = function(transactionType) {
      return $scope.supportedTransactionTypes.indexOf(transactionType.name) > -1;
    };

    $scope.getOverriddenTransactionTypeName = function(transactionTypeName) {
      if (transactionTypeName in $scope.overrideTransactionTypeNames) {
        return $scope.overrideTransactionTypeNames[transactionTypeName];
      }

      return transactionTypeName;
    };

    $scope.getTransactions = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();

      transactionFactory.getTransactionList(generateGetTransactionsPayload()).then(appendTransactions);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.clearSearch = function() {
      $scope.search = {};
      $scope.transactions = [];
    };

    $scope.searchTransactions = function() {
      $this.isSearch = true;
      clearTransactions();
      setDefaultMetaPayload();

      $scope.getTransactions();
    };

    $scope.showTransactionDetails = function(transaction) {
      window.open('/ember/transactions/index.html?transactionId=' + transaction.transactionId);
    };

    function sanitizeSearchPayload(payload) {
      payloadUtility.sanitize(payload);
      payload.transactionStartDate = payloadUtility.serializeDate(payload.transactionStartDate);
      payload.transactionEndDate = payloadUtility.serializeDate(payload.transactionEndDate);

      if (payload.paymentMethods) {
        payload.paymentMethods = payload.paymentMethods.join(',');
      }
    }

    function generateGetTransactionsPayload() {
      var payload = {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };

      if ($this.isSearch) {
        angular.extend(payload, $scope.search);
      }

      sanitizeSearchPayload(payload);

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

    function showLoadingModal(text) {
      angular.element('.loading-more').show();
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('.loading-more').hide();
      angular.element('#loading').modal('hide');
    }

    function normalizeTransactions(transactions) {
      angular.forEach(transactions, function(transaction) {
        transaction.transactionDate = dateUtility.formatDateForApp(transaction.transactionDate);
      });

      return transactions;
    }

    function appendTransactions(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var transactions = angular.copy(dataFromAPI.transactions)
        .filter(isNotAbandoned);

      $scope.transactions = $scope.transactions.concat(normalizeTransactions(transactions));

      hideLoadingBar();
    }

    function clearTransactions() {
      $scope.transactions = [];
    }

    function setTransactionTypes(dataFromAPI) {
      var transactionTypes = angular.copy(dataFromAPI);

      $scope.transactionTypes = transactionTypes;
    }

    function setCompanyCurrencies(dataFromAPI) {
      var companyCurrencies = angular.copy(dataFromAPI.response);

      $scope.companyCurrencies = companyCurrencies;
    }

    function setCompanyStations(dataFromAPI) {
      var companyStations = angular.copy(dataFromAPI.response);

      $scope.companyStations = companyStations;
    }

    function setCreditCardTypes(dataFromAPI) {
      var creditCardTypes = angular.copy(dataFromAPI.companyCCTypes);

      $scope.creditCardTypes = creditCardTypes;
    }

    function getTransactionTypes() {
      recordsService.getTransactionTypes().then(setTransactionTypes);
    }

    function getCompanyCurrencies() {
      var payload = {
        isOperatedCurrency: true
      };

      currencyFactory.getCompanyCurrencies(payload).then(setCompanyCurrencies);
    }

    function getCompanyStations() {
      stationsService.getGlobalStationList().then(setCompanyStations);
    }

    function getCreditCardTypes() {
      var companyId = globalMenuService.company.get();
      companyCcTypesService.getCCtypes(companyId).then(setCreditCardTypes);
    }

    function makeDependencyPromises() {
      return [
        getTransactionTypes(),
        getCompanyCurrencies(),
        getCompanyStations(),
        getCreditCardTypes()
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
