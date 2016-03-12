'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function($scope, cashBagFactory, $location, $routeParams, $q, $localStorage,
    messageService,
    dateUtility, lodash, socketIO, $timeout) {

    var companyId;
    var services = [];
    var $this = this;
    $scope.cashBagList = [];
    this.shouldShowEmptyResult = false;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.isEmptyResultSet = function() {
      return $this.shouldShowEmptyResult && $scope.cashBagList.length === 0;
    };

    $scope.viewName = 'Manage Cash Bag';
    $scope.createCashBagError = 'temp error message';
    $scope.displayModalError = false;
    $scope.displayError = false;
    $scope.search = {};
    $scope.storeList = [];
    $scope.storeInstanceList = [];
    delete $localStorage.isEditFromList;

    function showSuccessMessage(error) {
      messageService.display('success', '<strong>Cash bag</strong>:' + error);
      $scope.formErrors = {};
    }

    function showLoadingModal() {
      $scope.displayError = false;
      angular.element('.loading-more').show();
    }

    function hideLoadingModal() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
      angular.element('#cashBagNumber').focus();
    }

    function formatScheduleDateForApp(containingArray) {
      if (!angular.isArray(containingArray)) {
        return;
      }

      containingArray.map(function(obj) {
        if (obj.scheduleDate) {
          obj.scheduleDate = dateUtility.formatDateForApp(obj.scheduleDate);
        }
      });

      return containingArray;
    }

    function getCashBagResponseHandler(response) {
      hideLoadingModal();
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.cashBagList = $scope.cashBagList.concat(formatScheduleDateForApp(angular.copy(response.cashBags)));
      angular.forEach($scope.cashBagList, function(cashBag) {
        if ($scope.isNew(cashBag.id)) {
          showSuccessMessage('successfully created');
        }
      });

      if ($this.meta.count === 1 && $scope.search.cashBagNumber) {
        $localStorage.isEditFromList = true;
        socketIO.emit('echo-cashBag', {
          cashBag: $scope.cashBagList[0]
        });
        $scope.editCashBag($scope.cashBagList[0]);
      }
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
      angular.element('.stations-multi-select').select2({
        width: '100%'
      });
    }

    (function constructor() {
      showLoadingModal();
      companyId = cashBagFactory.getCompanyId();
      services = {
        promises: [],
        call: function(servicesArray) {
          angular.forEach(servicesArray, function(_service) {
            services.promises.push(services[_service]());
          });
        },

        getStationList: function() {
          return cashBagFactory.getStationList(companyId).then(getStationListResponseHandler);
        },

        getSchedulesList: function() {
          return cashBagFactory.getSchedulesList(companyId).then(getSchedulesListResponseHandler);
        }
      };
      services.call(['getStationList', 'getSchedulesList']);
      $q.all(services.promises).then(hideLoadingModal);
    })();

    function formatUiSelectPayload(data) {
      var payload = [];
      angular.forEach(data, function(station) {
        payload.push(station.stationCode);
      });

      return payload;
    }

    function loadCashBagList() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = angular.copy($scope.search);
      showLoadingModal();
      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
        payload.endDate = payload.startDate;
      }

      if (payload.arrivalStationCode) {
        payload.arrivalStationCode = formatUiSelectPayload(payload.arrivalStationCode);
      }

      if (payload.departureStationCode) {
        payload.departureStationCode = formatUiSelectPayload(payload.departureStationCode);
      }

      payload = lodash.assign(payload, {
        isDelete: 'false',
        isSubmitted: 'false',
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      cashBagFactory.getCashBagList(companyId, payload).then(getCashBagResponseHandler);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadCashBagList = loadCashBagList;

    $scope.searchCashBag = function() {
      $scope.cashBagList = [];
      $this.shouldShowEmptyResult = true;
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      loadCashBagList();
    };

    socketIO.on('cashBag', function(message) {
      $scope.search.cashBagNumber = message.message;
      $timeout(function() {
        $scope.searchCashBag();
      });
    });

    $scope.clearForm = function() {
      $scope.search = {};
      angular.element('.stations-multi-select').select2('data', null);
      $scope.cashBagList = [];
    };

    // helpers
    function showModalErrors(errorMessage) {
      $scope.displayModalError = true;
      $scope.createCashBagError = errorMessage;
    }

    function clearPopupSearch() {
      if (angular.isDefined($scope.search)) {
        delete $scope.search.selectedSchedule;
        delete $scope.search.selectedStoreNumber;
        delete $scope.search.scheduleDate;
      }

      if (angular.isDefined($scope.storeInstanceList)) {
        $scope.storeInstanceList = [];
      }

      $scope.displayModalError = false;

    }

    // scope methods
    $scope.viewCashBag = function(cashBag) {
      $location.path('cash-bag/view/' + cashBag.id);
    };

    $scope.editCashBag = function(cashBag) {
      var buttonSelector = sprintf('.edit-cash-bag-%s-btn', cashBag.id);
      angular.element(buttonSelector).button('loading');
      $scope.checkForDailyExchangeRate().then(function() {
        angular.element(buttonSelector).button('reset');
        $location.path('cash-bag/edit/' + cashBag.id);
      });
    };

    $scope.isNew = function(cashBagId) {
      return ($routeParams.newId === cashBagId);
    };

    $scope.showCreatePopup = function() {
      var buttonSelector = '.add-cash-bag-btn';
      angular.element(buttonSelector).button('loading');
      $scope.checkForDailyExchangeRate().then(function() {
        angular.element(buttonSelector).button('reset');
        angular.element('#addCashBagModal').modal('show');
      });
    };

    $scope.hideCreatePopup = function() {
      angular.element('#addCashBagModal').modal('hide');
      clearPopupSearch();
    };

    function getStoreListResponseHandler(storeListFromAPI) {
      $scope.storeList = angular.copy(storeListFromAPI.response);
    }

    $scope.isDateSelected = function() {
      return !$scope.search.scheduleDate;
    };

    function createPayloadForStoreInstance() {
      var payload = {};
      if ($scope.search.scheduleDate) {
        payload.scheduleDate = dateUtility.formatDateForAPI($scope.search.scheduleDate);
      }

      if ($scope.search.selectedSchedule) {
        payload.scheduleNumber = $scope.search.selectedSchedule.scheduleNumber;
      }

      if ($scope.search.selectedStoreNumber) {
        payload.storeId = $scope.search.selectedStoreNumber.id;
      }

      return payload;
    }

    $scope.shouldShowInstanceTable = function() {
      return ($scope.storeInstanceList.length > 0);
    };

    function validateStoreInstanceResponse(response) {
      return (response && response.length > 0);
    }

    var getStoreInstanceListHandler = function(dataFromAPI) {
      var isResponseValid = validateStoreInstanceResponse(dataFromAPI.response);
      if (isResponseValid) {
        var storeListFromAPI = angular.copy(dataFromAPI.response);
        $scope.storeInstanceList = formatScheduleDateForApp(storeListFromAPI);
        $scope.listLoading = false;
        return;
      }

      $scope.listLoading = false;
      showModalErrors('No Store Instance found, please check search criteria');
    };

    $scope.findStoreInstance = function() {
      $scope.storeInstanceList = [];
      $scope.displayModalError = false;
      var payload = createPayloadForStoreInstance();
      if (payload.scheduleDate || payload.scheduleNumber || payload.storeId) {
        $scope.listLoading = true;
        cashBagFactory.getStoreInstanceList(payload, companyId).then(getStoreInstanceListHandler);
      }
    };

    $scope.clearSelectedSchedule = function() {
      delete $scope.search.selectedSchedule;
    };

    $scope.clearStoreNumber = function() {
      delete $scope.search.selectedStoreNumber;
    };

    $scope.$watch('search.scheduleDate', function() {
      if (!$scope.search.scheduleDate) {
        return;
      }

      $scope.clearSelectedSchedule();
      $scope.clearStoreNumber();
      var searchDate = dateUtility.formatDateForAPI($scope.search.scheduleDate);
      var payload = {
        startDate: searchDate,
        endDate: searchDate
      };

      cashBagFactory.getStoreList(payload, companyId).then(getStoreListResponseHandler);
      cashBagFactory.getSchedulesInDateRange(companyId, searchDate, searchDate).then(setFilteredScheduleList);
    });

    $scope.submitCreate = function(storeInstance) {
      if (!storeInstance) {
        showModalErrors('Please select a store instance');
        return;
      }

      angular.element('#addCashBagModal').removeClass('fade').modal('hide');
      $location.path('cash-bag/create').search({
        storeInstanceId: storeInstance.id
      });
    };

    $scope.isCashBagEditable = function(cashBag) {
      return (cashBag && !cashBag.isSubmitted && cashBag.isDelete === 'false');
    };

    $scope.isListFromEdit = function() {
      return !!$localStorage.isListFromEdit;
    };

    // http://v4-alpha.getbootstrap.com/components/collapse/#events
    angular.element('#searchCollapse').on('shown.bs.collapse', function() {
      angular.element('#cashBagNumber').focus();
    });

  });
