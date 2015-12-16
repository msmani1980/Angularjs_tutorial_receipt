'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagFactory, $location, $routeParams, $q, ngToast, dateUtility, lodash) {

    var _companyId = null;
    var _services = null;
    $scope.cashBagList = [];
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Manage Cash Bag';
    $scope.createCashBagError = 'temp error message';
    $scope.displayModalError = false;
    $scope.displayError = false;
    $scope.search = {};
    $scope.storeList = [];
    $scope.storeInstanceList = [];

    function showSuccessMessage(error) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: ' + error
      });
      $scope.formErrors = {};
    }

    function showLoadingModal() {
      $scope.displayError = false;
      angular.element('.loading-more').show();
    }

    function hideLoadingModal() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function getSortedBankRefList(cashBagList) {
      var bankRefList = [];
      cashBagList.forEach(function (element) {
        if (element.bankReferenceNumber !== null && bankRefList.indexOf(element.bankReferenceNumber) < 0) {
          bankRefList.push(element.bankReferenceNumber);
        }
      });
      return bankRefList;
    }

    function formatScheduleDateForApp(containingArray) {
      if (!angular.isArray(containingArray)) {
        return;
      }

      containingArray.map(function (obj) {
        if (obj.scheduleDate) {
          obj.scheduleDate = dateUtility.formatDateForApp(obj.scheduleDate);
        }
      });
      return containingArray;
    }

    function getCashBagResponseHandler(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.cashBagList = $scope.cashBagList.concat(formatScheduleDateForApp(angular.copy(response.cashBags)));
      angular.forEach($scope.cashBagList, function (cashBag) {
        if ($scope.isNew(cashBag.id)) {
          showSuccessMessage('successfully created');
        }
      });
      $scope.bankRefList = getSortedBankRefList(response.cashBags);
      hideLoadingModal();
    }

    function setFilteredScheduleList(dataFromAPI) {
      var scheduleArray = dataFromAPI.distinctSchedules || dataFromAPI.schedules;
      $scope.filteredSchedulesList = angular.copy(scheduleArray);
    }

    function getSchedulesListResponseHandler(dataFromAPI) {
      $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      setFilteredScheduleList(dataFromAPI);
    }


    function getStationListResponseHandler(dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
      angular.element('.stations-multi-select').select2({width: '100%'});
    }


    (function constructor() {
      showLoadingModal();
      _companyId = cashBagFactory.getCompanyId();
      _services = {
        promises: [],
        call: function (servicesArray) {
          angular.forEach(servicesArray, function (_service) {
            _services.promises.push(_services[_service]());
          });
        },
        getStationList: function () {
          return cashBagFactory.getStationList(_companyId).then(getStationListResponseHandler);
        },
        getSchedulesList: function () {
          return cashBagFactory.getSchedulesList(_companyId).then(getSchedulesListResponseHandler);
        }
      };
      _services.call(['getStationList', 'getSchedulesList']);
      $q.all(_services.promises).then(hideLoadingModal);
    })();

    function loadCashbagList() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = angular.copy($scope.search);
      showLoadingModal();
      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
        payload.endDate = payload.startDate;
      }
      payload = lodash.assign(payload, {
        isDelete: 'false',
        isSubmitted: 'false',
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      cashBagFactory.getCashBagList(_companyId, payload).then(getCashBagResponseHandler);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadCashbagList = function() {
      loadCashbagList();
    };

    $scope.searchCashBag = function () {
      $scope.cashBagList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      loadCashbagList();
    };

    $scope.clearForm = function () {
      $scope.search = {};
      angular.element('.stations-multi-select').select2('data', null);
      $scope.searchCashBag();
    };


    // helpers
    function showModalErrors(errorMessage) {
      $scope.displayModalError = true;
      $scope.createCashBagError = errorMessage;
    }

    // scope methods
    $scope.viewCashBag = function (cashBag) {
      $location.path('cash-bag/view/' + cashBag.id);
    };

    $scope.editCashBag = function (cashBag) {
      $location.path('cash-bag/edit/' + cashBag.id);
    };

    $scope.isNew = function (cashBagId) {
      return ($routeParams.newId === cashBagId);
    };

    $scope.showCreatePopup = function () {
      angular.element('#addCashBagModal').modal('show');
    };

    function getStoreListResponseHandler(storeListFromAPI) {
      $scope.storeList = angular.copy(storeListFromAPI.response);
    }

    $scope.isDateSelected = function () {
      return !$scope.scheduleDate;
    };

    function createPayloadForStoreInstance() {
      var payload = {
        scheduleDate: dateUtility.formatDateForAPI($scope.scheduleDate)
      };

      if ($scope.search.selectedSchedule) {
        payload.scheduleNumber = $scope.search.selectedSchedule.scheduleNumber;
      }

      if ($scope.search.selectedStoreNumber) {
        payload.storeId = $scope.search.selectedStoreNumber.id;
      }
      return payload;
    }

    $scope.shouldShowInstanceTable = function () {
      return ($scope.storeInstanceList.length > 0);
    };

    function validateStoreInstanceResponse(response) {
      return (response && response.length > 0);
    }

    var getStoreInstanceListHandler = function (dataFromAPI) {
      var isResponseValid = validateStoreInstanceResponse(dataFromAPI.response);
      if (isResponseValid) {
        var storeListFromAPI = angular.copy(dataFromAPI.response);
        $scope.storeInstanceList = formatScheduleDateForApp(storeListFromAPI);
        return;
      }
      showModalErrors('No Store Instance found, please check search criteria');
    };

    $scope.findStoreInstance = function () {
      if (!$scope.scheduleDate) {
        showModalErrors('Please select date and schedule number or store number');
        return;
      }

      if (!($scope.search.selectedSchedule || $scope.search.selectedStoreNumber)) {
        showModalErrors('Please select date and schedule number or store number');
        return;
      }

      $scope.storeInstanceList = [];
      $scope.displayModalError = false;
      var payload = createPayloadForStoreInstance();
      cashBagFactory.getStoreInstanceList(payload).then(getStoreInstanceListHandler);
    };

    $scope.clearSelectedSchedule = function () {
      delete $scope.search.selectedSchedule;
    };

    $scope.clearStoreNumber = function () {
      delete $scope.search.selectedStoreNumber;
    };

    $scope.$watch('scheduleDate', function () {
      if (!$scope.scheduleDate) {
        return;
      }
      $scope.clearSelectedSchedule();
      $scope.clearStoreNumber();
      var searchDate = dateUtility.formatDateForAPI($scope.scheduleDate);
      var payload = {
        startDate: searchDate,
        endDate: searchDate
      };
      cashBagFactory.getStoreList(payload).then(getStoreListResponseHandler);
      cashBagFactory.getSchedulesInDateRange(_companyId, searchDate, searchDate).then(setFilteredScheduleList);

    });

    $scope.submitCreate = function (storeInstance) {
      if (!storeInstance) {
        showModalErrors('Please select a store instance');
        return;
      }
      angular.element('#addCashBagModal').removeClass('fade').modal('hide');
      $location.path('cash-bag/create').search({
        storeInstanceId: storeInstance.id
      });
    };

    $scope.isCashBagEditable = function (cashBag) {
      return (cashBag && !cashBag.isSubmitted && cashBag.isDelete === 'false');
    };

  });
