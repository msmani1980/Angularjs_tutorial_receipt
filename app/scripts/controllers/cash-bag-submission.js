'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagSubmissionCtrl
 * @description
 * # CashBagSubmissionCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('CashBagSubmissionCtrl',
  function ($scope, $http, globalMenuService, cashBagFactory, $filter, $window, dateUtility, lodash, messageService) {
    $scope.viewName = 'Cash Bag Submission';
    $scope.search = {};

    var $this = this;
    this.companyId = null;
    this.loadingProgress = false;
    this.isSearching = false;

    function initializeData() {
      $scope.submissionDate = dateUtility.nowFormattedDatePicker();
      $scope.cashBagListToSubmit = [];
      $scope.bankReferenceNumbers = [];
      $scope.cashBagNumberList = [];
      $scope.scheduleNumber = [];
      $scope.cashBagList = [];
      $scope.allCheckboxesSelected = false;
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    }

    function showToast(className, type, message) {
      messageService.display(className, '<strong>' + type + '</strong>: ' + message);
    }

    function showLoadingBar() {
      angular.element('.loading-more').removeClass('hide');
    }

    function hideLoadingBar() {
      angular.element('.loading-more').addClass('hide');
      angular.element('.modal-backdrop').remove();
    }

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    function errorHandler(response) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(response);
    }

    function sortByNumber(a, b) {
      return a - b;
    }

    this.setSearchFields = function () {
      var bankReferenceNumbersList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.bankReferenceNumber) {
          return cashBag.bankReferenceNumber;
        }
      });

      var cashBagNumberList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.cashBagNumber) {
          return cashBag.cashBagNumber;
        }
      });

      var scheduleNumberList = lodash.map($scope.cashBagList, function (cashBag) {
        if (!!cashBag.scheduleNumber) {
          return cashBag.scheduleNumber;
        }
      });

      $scope.bankReferenceNumbers = lodash.uniq(lodash.compact(bankReferenceNumbersList.sort(sortByNumber)), true);
      $scope.cashBagNumberList = lodash.uniq(lodash.compact(cashBagNumberList.sort()), true);
      $scope.scheduleNumberList = lodash.uniq(lodash.compact(scheduleNumberList.sort()), true);
    };

    function formatCashBag(cashBag) {
      cashBag.selected = false;
      cashBag.submittedDate = (cashBag.isSubmitted === true) ? dateUtility.formatDateForApp(cashBag.cashbagSubmittedOn || cashBag.updatedOn) : '-';
      cashBag.scheduleDate = dateUtility.formatDateForApp(cashBag.scheduleDate);
      cashBag.submittedBy = (!cashBag.cashbagSubmittedBy && cashBag.isSubmitted === true) ? 'Auto' : (!!cashBag.cashbagSubmittedByUser ? cashBag.cashbagSubmittedByUser.userName : '-');
    }

    this.getCashBagListSuccessHandler = function (dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      lodash.forEach(dataFromAPI.cashBags, function (cashBag) {
        formatCashBag(cashBag);
      });

      $scope.cashBagList = $scope.cashBagList.concat(angular.copy(dataFromAPI.cashBags));
      $this.setSearchFields();
      hideLoadingBar();
      $this.loadingProgress = false;
    };

    function generatePayload() {
      var searchParams = {};
      if ($scope.search.bankReferenceNumber && $scope.search.bankReferenceNumber.length) {
        searchParams.bankReferenceNumber = angular.copy($scope.search.bankReferenceNumber);
      }

      var payload = {
        submission: 'submit',
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };
      return ($this.isSearching) ? angular.extend(payload, searchParams) : payload;
    }

    $scope.updateCashBagList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      if ($this.loadingProgress) {
        return;
      }

      showLoadingBar();
      $this.loadingProgress = true;

      var payload = generatePayload();
      cashBagFactory.getCashBagList($this.companyId, payload).then($this.getCashBagListSuccessHandler, errorHandler);
      $this.meta.offset += $this.meta.limit;
    };

    var getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    function globalCurrenciesSuccessHandler(dataFromApi) {
      $this.globalCurrencyList = angular.copy(dataFromApi.response);
      $scope.companyBaseCurrency = getCurrencyFromArrayUsingId($this.globalCurrencyList, $scope.companyData.baseCurrencyId);
      $scope.chBaseCurrency = getCurrencyFromArrayUsingId($this.globalCurrencyList, $scope.CHCompany.baseCurrencyId);
    }

    function getCompanySuccessHandler(companyDataFromAPI) {
      $scope.companyData = angular.copy(companyDataFromAPI);
      cashBagFactory.getCompanyGlobalCurrencies().then(globalCurrenciesSuccessHandler, errorHandler);
    }

    function getCHCompanySuccessHandler(chCompanyDataFromAPI) {
      $this.companyId = globalMenuService.getCompanyData().chCompany.companyId;
      cashBagFactory.getCompany($this.companyId).then(getCompanySuccessHandler, errorHandler);
      angular.element('#bankReferenceNumber').focus();
      $scope.CHCompany = angular.copy(chCompanyDataFromAPI);
    }

    function compareNumbers(a, b) {
      return a - b;
    }

    function setCashBagListToSubmit() {
      $scope.cashBagListToSubmit = [];
      var bankReferenceList = [];
      var cashBagListToSubmit = lodash.filter($scope.cashBagList, function (cashBag) {
        return cashBag.selected;
      });

      angular.forEach(cashBagListToSubmit, function (cashBag) {
        $scope.cashBagListToSubmit.push({
          id: cashBag.id,
          bankReferenceNumber: cashBag.bankReferenceNumber,
          cashBagNumber: cashBag.cashBagNumber,
          dailyExchangeRateId: cashBag.dailyExchangeRateId,
          isSubmitted: cashBag.isSubmitted,
          scheduleDate: dateUtility.formatDateForAPI(cashBag.scheduleDate),
          scheduleNumber: cashBag.scheduleNumber,
          retailCompanyId: cashBag.retailCompanyId
        });
        bankReferenceList.push(parseInt(cashBag.bankReferenceNumber));
      });

      $scope.bankReferenceListToSubmit = lodash.uniq(lodash.compact(bankReferenceList), true).sort(compareNumbers);
    }

    $scope.toggleCheckbox = setCashBagListToSubmit;

    $scope.shouldDisableSubmitButton = function () {
      return $scope.cashBagListToSubmit.length === 0;
    };

    $scope.shouldDisableSubmission = function (cashBag) {
      return cashBag.isSubmitted === true || !cashBag.bankReferenceNumber || cashBag.bankReferenceNumber.length === 0;
    };

    $scope.toggleAllCheckboxes = function () {
      lodash.forEach($scope.cashBagList, function (cashBag) {
        if (!$scope.shouldDisableSubmission(cashBag)) {
          cashBag.selected = $scope.allCheckboxesSelected;
        }
      });

      setCashBagListToSubmit();
    };

    $scope.showSubmitPopup = function () {
      var buttonSelector = '.submit-cash-bag-btn';
      angular.element(buttonSelector).button('loading');
      $scope.checkForDailyExchangeRate().then(function () {
        angular.element(buttonSelector).button('reset');
        setCashBagListToSubmit();
        angular.element('.submit-cashBag-modal').modal('show');
      });
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $this.isSearching = false;
      $scope.cashBagList = [];
      angular.element('#bankReferenceNumber').focus();
    };

    $scope.searchCashBags = function () {
      initializeData();
      $this.isSearching = true;
      $scope.updateCashBagList();
    };

    function updateCashBagSuccessHandler() {
      showToast('success', 'Cash Bag', sprintf('Successfully submitted %d cashbag(s)', $scope.cashBagListToSubmit.length));
      $this.hideLoadingModal();
      if ($this.isSearching) {
        $scope.searchCashBags();
        return;
      }

      $scope.clearForm();
    }

    $scope.printListOfCashBag = function () {
      $window.print();
    };

    $scope.submitCashBag = function () {
      angular.element('#addCashBagModal').modal('show');
      angular.element('.submit-cashBag-modal').modal('hide');
      if ($scope.cashBagListToSubmit.length === 0) {
        return;
      }

      $this.displayLoadingModal('Submitting Cash Bags');
      
      var payload = $scope.cashBagListToSubmit;
      
      var parameters = {
        submission: 'submit'
      };
      cashBagFactory.updateCashBag($this.companyId, payload, parameters).then(updateCashBagSuccessHandler, errorHandler);
    };

    var chCompanyId = globalMenuService.getCompanyData().companyId;
    cashBagFactory.getCompany(chCompanyId).then(getCHCompanySuccessHandler, errorHandler);
    initializeData();

    angular.element('#searchCollapse').on('shown.bs.collapse', function () {
      angular.element('#bankReferenceNumber').focus();
    });

  });
