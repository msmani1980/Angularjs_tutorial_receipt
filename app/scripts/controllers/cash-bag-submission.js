'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagSubmissionCtrl
 * @description
 * # CashBagSubmissionCtrl
 * Controller of the ts5App
 */

angular.module('ts5App').controller('CashBagSubmissionCtrl',
  function ($scope, $http, GlobalMenuService, cashBagFactory, $filter, dateUtility, ngToast, lodash) {
    $scope.viewName = 'Cash Bag Submission';
    $scope.search = {};

    var $this = this;
    this.companyId = null;
    this.loadingProgress = false;
    this.isSearching = false;

    function initializeData() {
      $scope.submissionDate = dateUtility.nowFormatted();
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
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
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
      cashBag.submittedDate = (cashBag.isSubmitted === 'true') ? dateUtility.formatDateForApp(cashBag.updatedOn) : '-';
      cashBag.scheduleDate = dateUtility.formatDateForApp(cashBag.scheduleDate);
      cashBag.submittedBy = (cashBag.originationSource === 2) ? 'Auto' : (cashBag.cashbagSubmittedBy || '-');
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

    function generateStatusPayloadForSearch(formSearchObject) {
      var searchParams = angular.copy(formSearchObject);
      if (searchParams.searchForSubmitted && !searchParams.searchForNotSubmitted) {
        searchParams.isSubmitted = true;
      }

      if (!searchParams.searchForSubmitted && searchParams.searchForNotSubmitted) {
        searchParams.isSubmitted = false;
      }

      delete searchParams.searchForSubmitted;
      delete searchParams.searchForNotSubmitted;

      return searchParams;
    }

    function generatePayload() {
      var searchParams = generateStatusPayloadForSearch($scope.search);

      if (angular.isDefined(searchParams.isSubmitted) && searchParams.isSubmitted.length === 0) {
        delete searchParams.isSubmitted;
      }

      var payload = {
        submission: 'submit',
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        companyId: $this.companyId
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
      cashBagFactory.getCashBagList(null, payload).then($this.getCashBagListSuccessHandler, errorHandler);
      $this.meta.offset += $this.meta.limit;
    };

    var getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    function getBaseCurrencies() {
      cashBagFactory.getCompanyGlobalCurrencies().then(function (companyBaseCurrencyData) {
        $scope.companyBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response, $scope.companyData.baseCurrencyId);
        $scope.chBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response, $scope.CHCompany.baseCurrencyId);
      });
    }

    function getCompanySuccessHandler(companyDataFromAPI) {
      $scope.companyData = angular.copy(companyDataFromAPI);
      getBaseCurrencies();
    }

    function getCHCompanySuccessHandler(chCompanyDataFromAPI) {
      $this.companyId = GlobalMenuService.company.get();
      cashBagFactory.getCompany($this.companyId).then(getCompanySuccessHandler, errorHandler);
      angular.element('#bankReferenceNumber').focus();
      $scope.CHCompany = angular.copy(chCompanyDataFromAPI);
    }

    function setCashBagListToSubmit() {
      $scope.cashBagListToSubmit = [];
      var bankReferenceList = [];
      var cashBagListToSubmit = lodash.filter($scope.cashBagList, function (cashBag) {
        return cashBag.selected;
      });

      angular.forEach(cashBagListToSubmit, function (cashBag) {
        $scope.cashBagListToSubmit.push({
          bankReferenceNumber: cashBag.bankReferenceNumber,
          cashBagNumber: cashBag.cashBagNumber,
          dailyExchangeRateId: cashBag.dailyExchangeRateId,
          isSubmitted: cashBag.isSubmitted,
          scheduleDate: dateUtility.formatDateForAPI(cashBag.scheduleDate),
          scheduleNumber: cashBag.scheduleNumber,
          retailCompanyId: cashBag.retailCompanyId
        });
        bankReferenceList.push(cashBag.bankReferenceNumber);
      });

      $scope.bankReferenceListToSubmit = lodash.uniq(lodash.compact(bankReferenceList), true);
    }

    $scope.toggleCheckbox = setCashBagListToSubmit;

    $scope.shouldDisableSubmitButton = function () {
      return $scope.cashBagListToSubmit.length === 0;
    };

    $scope.shouldDisableSubmission = function (cashBag) {
      return cashBag.isSubmitted === 'true' || !cashBag.bankReferenceNumber || cashBag.bankReferenceNumber.length === 0;
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
      setCashBagListToSubmit();
      angular.element('.submit-cashBag-modal').modal('show');
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $this.isSearching = false;
      initializeData();
      $scope.updateCashBagList();
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

    $scope.submitCashBag = function () {
      angular.element('.submit-cashBag-modal').modal('hide');
      if ($scope.cashBagListToSubmit.length === 0) {
        return;
      }

      $this.displayLoadingModal('Submitting Cash Bags');
      var payload = {
        cashBags: $scope.cashBagListToSubmit
      };
      var parameters = {
        submission: 'submit'
      };
      cashBagFactory.updateCashBag(null, payload, parameters).then(updateCashBagSuccessHandler, errorHandler);
    };

    cashBagFactory.getCompany(362).then(getCHCompanySuccessHandler, errorHandler);
    initializeData();

    angular.element('#searchCollapse').on('shown.bs.collapse', function () {
      angular.element('#bankReferenceNumber').focus();
    });

  });
