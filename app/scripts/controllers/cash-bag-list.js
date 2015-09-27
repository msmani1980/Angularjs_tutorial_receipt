'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagFactory, $location, $routeParams, $q, ngToast, dateUtility) {

    var _companyId = null;
    var _services  = null;

    $scope.viewName           = 'Manage Cash Bag';
    $scope.createCashBagError = 'temp error message';
    $scope.displayModalError  = false;
    $scope.displayError       = false;
    $scope.search             = {};
    $scope.storeList          = [];
    $scope.storeInstanceList  = [];

    function showSuccessMessage(error) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: ' + error
      });
      $scope.formErrors = {};
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
      containingArray.map(function (obj) {
        if (obj.scheduleDate) {
          obj.scheduleDate = dateUtility.formatDateForApp(obj.scheduleDate);
        }
      });
      return containingArray;
    }

    function getCashBagResponseHandler(response) {
      $scope.cashBagList = formatScheduleDateForApp(angular.copy(response.cashBags));
      angular.forEach($scope.cashBagList, function (cashBag) {
        if ($scope.isNew(cashBag.id)) {
          showSuccessMessage('successfully created');
        }
      });
      $scope.bankRefList = getSortedBankRefList(response.cashBags);
    }

    function setFilteredScheduleList(dataFromAPI) {
      var scheduleArray            = dataFromAPI.distinctSchedules || dataFromAPI.schedules;
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
      // set global controller properties
      _companyId = cashBagFactory.getCompanyId();
      _services  = {
        promises: [],
        call: function (servicesArray) {
          angular.forEach(servicesArray, function (_service) {
            _services.promises.push(_services[_service]());
          });
        },
        getCashBagList: function () {
          return cashBagFactory.getCashBagList(_companyId, {isDelete: 'false'}).then(getCashBagResponseHandler);
        },
        getStationList: function () {
          return cashBagFactory.getStationList(_companyId).then(getStationListResponseHandler);
        },
        getSchedulesList: function () {
          return cashBagFactory.getSchedulesList(_companyId).then(getSchedulesListResponseHandler);
        }
      };
      _services.call(['getCashBagList', 'getStationList', 'getSchedulesList']);
    })();

    // helpers
    function showModalErrors(errorMessage) {
      $scope.displayModalError  = true;
      $scope.createCashBagError = errorMessage;
    }

    // scope methods
    $scope.viewCashBag = function (cashBag) {
      $location.path('cash-bag/view/' + cashBag.id);
    };

    $scope.editCashBag = function (cashBag) {
      $location.path('cash-bag/edit/' + cashBag.id);
    };

    $scope.searchCashBag = function () {
      var payload = angular.copy($scope.search);
      if (payload.startDate) {
        payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
        payload.endDate   = payload.startDate;
      }
      cashBagFactory.getCashBagList(_companyId, payload).then(getCashBagResponseHandler);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      angular.element('.stations-multi-select').select2('data', null);
      $scope.searchCashBag();
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
        //scheduleDate: dateUtility.formatDateForAPI($scope.scheduleDate);
      };

      if ($scope.selectedSchedule) {
        payload.scheduleNumber = $scope.selectedSchedule;
      }

      if ($scope.selectedStoreNumber) {
        payload.storeId = $scope.selectedStoreNumber;
      }
      return payload;
    }

    var getStoreInstanceListHandler = function (dataFromAPI) {
      var storeListFromAPI = angular.copy(dataFromAPI.response);
        $scope.storeInstanceList = formatScheduleDateForApp(storeListFromAPI);
    };

    $scope.findStoreInstance = function () {
      $scope.storeInstanceList = [];
      var payload              = createPayloadForStoreInstance();
      cashBagFactory.getStoreInstanceList(payload).then(getStoreInstanceListHandler);
    };

    $scope.clearSelectedSchedule = function () {
      delete $scope.selectedSchedule;
    };

    $scope.clearStoreNumber = function () {
      delete $scope.selectedStoreNumber;
    };

    $scope.$watch('scheduleDate', function () {
      if (!$scope.scheduleDate) {
        return;
      }
      var searchDate = dateUtility.formatDateForAPI($scope.scheduleDate);
      var payload    = {
        startDate: searchDate,
        endDate: searchDate
      };
      cashBagFactory.getStoreList(payload).then(getStoreListResponseHandler);
      cashBagFactory.getSchedulesInDateRange(_companyId, searchDate, searchDate).then(setFilteredScheduleList);

    });

    $scope.submitCreate = function () {
      if (!$scope.createCashBagForm.$valid) {
        showModalErrors('Please select both a schedule number and a schedule date');
        return;
      }
      var formattedDate = dateUtility.formatDateForAPI($scope.scheduleDate);
      cashBagFactory.getDailySchedulesList(_companyId, $scope.selectedSchedule.scheduleNumber, formattedDate).then(function (response) {
        if (response.schedules.length < 1) {
          showModalErrors('Not a valid schedule');
        } else {
          $scope.displayError = false;
          angular.element('#addCashBagModal').removeClass('fade').modal('hide');
          $location.path('cash-bag/create').search({
            scheduleNumber: $scope.selectedSchedule.scheduleNumber,
            scheduleDate: formattedDate
          });
        }
      });
    };

    $scope.isCashBagEditable = function (cashBag) {
      return (cashBag && !cashBag.isSubmitted && cashBag.isDelete === 'false');
    };

  });
