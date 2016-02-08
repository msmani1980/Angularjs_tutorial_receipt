'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:TransactionListCtrl
 * @description
 * # TransactionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('TransactionListCtrl', function ($scope, $q, transactionFactory, recordsService, currencyFactory, stationsService, companyCcTypesService, GlobalMenuService, dateUtility) {
    var $this = this;

    $scope.transactions = [];
    $scope.transactionTypes = [];
    $scope.companyCurrencies = [];
    $scope.companyStations = [];
    $scope.paymentMethods = ['Cash', 'Credit Card'];
    $scope.creditCardTypes = [];
    $scope.creditCardTransactionStatuses = ['New', 'Processed'];
    $scope.creditCardAuthStatuses = ['Approved', 'Declined'];

    $scope.search = {
      paymentMethod: []
    };

    $this.meta = {
      limit: 100,
      offset: 0
    };

    $scope.getTransactionList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();

      transactionFactory.getTransactionList(getMetaPayload()).then(appendTransactionList);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.isCreditCardPaymentSelected = function () {
      return $scope.search.paymentMethod.indexOf('Credit Card') > -1;
    };

    function getMetaPayload() {
      return {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };
    }

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function showLoadingModal (text) {
      angular.element('.loading-more').show();
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal () {
      angular.element('.loading-more').hide();
      angular.element('#loading').modal('hide');
    }

    function normalizeTransactionList (transactions) {
      angular.forEach(transactions, function (transaction) {
        transaction.transactionDate = dateUtility.formatDateForApp(transaction.transactionDate);
      });

      return transactions;
    }

    function appendTransactionList (dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var transactions = angular.copy(dataFromAPI.transactions);

      $scope.transactions = $scope.transactions.concat(normalizeTransactionList(transactions));

      hideLoadingBar();
    }

    /*function setTransactionList (dataFromAPI) {
      var transactions = angular.copy(dataFromAPI.transactions);

      $scope.transactions = normalizeTransactionList(transactions);
      hideLoadingBar();
    }*/

    function setTransactionTypes (dataFromAPI) {
      var transactionTypes = angular.copy(dataFromAPI);

      $scope.transactionTypes = transactionTypes;
    }

    function setCompanyCurrencies (dataFromAPI) {
      var companyCurrencies = angular.copy(dataFromAPI.response);

      $scope.companyCurrencies = companyCurrencies;
    }

    function setCompanyStations (dataFromAPI) {
      var companyStations = angular.copy(dataFromAPI.response);

      $scope.companyStations = companyStations;
    }

    function setCreditCardTypes (dataFromAPI) {
      var creditCardTypes = angular.copy(dataFromAPI.companyCCTypes);

      $scope.creditCardTypes = creditCardTypes;
    }

    function getTransactionTypes () {
      recordsService.getTransactionTypes().then(setTransactionTypes);
    }

    function getCompanyCurrencies () {
      currencyFactory.getCompanyCurrencies({ isOperatedCurrency: true }).then(setCompanyCurrencies);
    }

    function getCompanyStations () {
      stationsService.getGlobalStationList().then(setCompanyStations);
    }

    function getCreditCardTypes() {
      var companyId = GlobalMenuService.company.get();
      companyCcTypesService.getCCtypes(companyId).then(setCreditCardTypes);
    }

    function makeDependencyPromises () {
      return [
        getTransactionTypes(),
        getCompanyCurrencies(),
        getCompanyStations(),
        getCreditCardTypes()
      ];
    }

    function dependenciesSuccess () {
      hideLoadingModal();
    }

    function init () {
      showLoadingModal('Loading Transactions.');

      $q.all(makeDependencyPromises()).then(dependenciesSuccess);
    }

    init();
  });
