'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReceiptRulesCtrl
 * @description
 * # ReceiptRulesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReceiptRulesCtrl', function ($scope, $location, $routeParams,  lodash, $q, dateUtility, messageService, receiptsFactory, accessService) {

    var $this = this;

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Manage Rules';
    $scope.search = {};
    $scope.receiptRules = [];
    $scope.countriesList = [];
    $scope.globalStationList = [];
    $scope.multiSelectedValues = {};
    $scope.loadingBarVisible = false;
    $scope.isSearch = false;

    $scope.loadReceiptRules = function() {
      angular.element('#search-collapse').addClass('collapse');
      loadReceiptRules();
    };

    $scope.searchReceiptRuleData = function() {
      $scope.receiptRules = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.isSearch = true;

      $scope.loadReceiptRules();
    };

    $scope.clearSearchForm = function() {
      $scope.isSearch = false;
      $scope.search = {};
      $scope.multiSelectedValues = {};
      $scope.receiptRules = [];
      receiptsFactory.getCompanyGlobalStationList($this.getOnLoadingPayload).then($this.getCompanyGlobalStationSuccess);
    };

    $scope.onCounrtyChange = function() {
      $scope.multiSelectedValues = {};
      var payload = {
          startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
          countryId: $scope.search.countryId
        };
      return receiptsFactory.getCompanyGlobalStationList(payload).then($this.getCompanyGlobalStationSuccess);
    };

    $scope.removeRecord = function(receiptRule) {
      if (receiptRule === undefined || receiptRule.id === undefined) {
        $this.deleteReceiptRuleFailure();
        return;
      }

      receiptsFactory.deleteReceiptRule(receiptRule.id).then(
        $this.deleteReceiptRuleSuccess,
        $this.deleteReceiptRuleFailure
      );

    };

    $scope.getUpdateBy = function (rule) {
      if (rule.updatedByPerson) {
        return rule.updatedByPerson.userName;
      }

      if (rule.createdByPerson) {
        return rule.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (rule) {
      return rule.updatedOn ? dateUtility.formatTimestampForApp(rule.updatedOn) : dateUtility.formatTimestampForApp(rule.createdOn);
    };

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function loadReceiptRules() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      $this.formatMultiSelectedValuesForSearch();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      receiptsFactory.getReceiptRules(payload).then($this.getReceiptRulesSuccess);
      $this.meta.offset += $this.meta.limit;
    }

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.deleteReceiptRuleFailure = function() {
        $this.showToastMessage('danger', 'Receipt Rule', 'Schedule could not be deleted');
      };

    this.deleteReceiptRuleSuccess = function() {
        $this.showToastMessage('success', 'Receipt Rule', 'Schedule successfully deleted');
        $scope.receiptRules = [];
        $this.meta = {
          count: undefined,
          limit: 100,
          offset: 0
        };
        $scope.loadReceiptRules();
      };

    this.formatMultiSelectedValuesForSearch = function() {
      $this.addSearchValuesFromMultiSelectArray('companyStationIdStr', $scope.multiSelectedValues.globalStationList, 'id');
    };

    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
        if (!multiSelectArray || multiSelectArray.length <= 0) {
          return;
        }

        var searchArray = [];
        angular.forEach(multiSelectArray, function(element) {
          searchArray.push(element[multiSelectElementKey]);
        });

        $scope.search[searchKeyName] = searchArray.toString();
      };

    this.getCompanyGlobalStationSuccess = function(response) {
      $scope.globalStationList = angular.copy(response.response);
    };

    this.getCountireSuccess = function(response) {
      $scope.countriesList = angular.copy(response.countries);
    };

    this.getReceiptRulesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.receiptRules = response.receiptRules;
      hideLoadingBar();
    };

    this.getOnLoadingPayload = function() {
      var onLoadPayload = lodash.assign(angular.copy($scope.search), {
            startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
          });
      return onLoadPayload;
    };

    $scope.redirectToReceiptRule = function(id, state) {
      $location.search({});
      $location.path('receipt-rules/' + state + '/' + id).search();
    };

    this.makeInitPromises = function() {
      var promises = [
        receiptsFactory.getCountriesList().then($this.getCountireSuccess),
        receiptsFactory.getCompanyGlobalStationList($this.getOnLoadingPayload).then($this.getCompanyGlobalStationSuccess)
      ];

      return promises;
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('RECEIPT', 'RECEIPTRULE', 'CRUDRRULE');
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
  });
