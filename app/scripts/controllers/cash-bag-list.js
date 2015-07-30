'use strict';
/*global moment*/
/*global $*/


/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagFactory, $location, $routeParams, $q, ngToast) {

    var _companyId = null,
      _services = null;

    $scope.viewName = 'Manage Cash Bag';
    $scope.displayModalError = false;
    $scope.displayError = false;
    $scope.createCashBagError = 'temp error message';
    $scope.search = {};

    // Constructor
    (function constructor() {
      // set global controller properties
      _companyId = cashBagFactory.getCompanyId();
      _services = {
        promises: [],
        call: function (servicesArray) {
          angular.forEach(servicesArray, function (_service) {
            _services.promises.push(_services[_service]());
          });
        },
        getCashBagList: function () {
          return cashBagFactory.getCashBagList(_companyId,{isDelete:'false'}).then(
            function (response) {
              $scope.cashBagList = response.cashBags;
              angular.forEach($scope.cashBagList, function(_cb){
                if($scope.isNew(_cb.id)){
                  showSuccessMessage('successfully created');
                }
              });
              $scope.bankRefList = getSortedBankRefList(response.cashBags);
            }
          );
        },
        getStationList: function () {
          return cashBagFactory.getStationList(_companyId).then(
            function (response) {
              $scope.stationList = response.response;
              $('.stations-multi-select').select2({ width: '100%' });

            }
          );
        },
        getSchedulesList: function () {
          return cashBagFactory.getSchedulesList(_companyId).then(
            function (response) {
              $scope.schedulesList = response.distinctSchedules;
            }
          );
        }
      };
      _services.call(['getCashBagList', 'getStationList', 'getSchedulesList']);
    })();

    // helpers
    function showSuccessMessage(error) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Cash bag</strong>:' + error
      });
      $scope.formErrors = {};
    }

    function showModalErrors(errorMessage) {
      $scope.displayModalError = true;
      $scope.createCashBagError = errorMessage;
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

    // scope methods
    $scope.viewCashBag = function (cashBag) {
      $location.path('cash-bag/view/' + cashBag.id);
    };

    $scope.editCashBag = function (cashBag) {
      $location.path('cash-bag/edit/' + cashBag.id);
    };

    $scope.searchCashBag = function () {
      if ($scope.search.startDate) {
        $scope.search.startDate = moment($scope.search.startDate, 'MM/DD/YYYY').format('YYYYMMDD').toString();
        $scope.search.endDate = $scope.search.startDate;
      }
      cashBagFactory.getCashBagList(_companyId, $scope.search).then(function (response) {
        $scope.cashBagList = response.cashBags;
        if($scope.search.startDate) {
          $scope.search.startDate = moment($scope.search.startDate, 'YYYYMMDD').format('MM/DD/YYYY').toString();
          $scope.search.endDate = $scope.search.endDate;
        }
      });
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $('.stations-multi-select').select2('data', null);
      $scope.searchCashBag();
    };

    $scope.isNew = function(cashBagId){
      return ($routeParams.newId === cashBagId);
    };

    $scope.showCreatePopup = function () {
      angular.element('#addCashBagModal').modal('show');
    };

    $scope.updateScheduleDate = function () {
      $scope.scheduleMinDate = moment($scope.schedulesList[$scope.scheduleIndex].minEffectiveStart, 'YYYY-MM-DD').format('MM/DD/YYYY').toString();
      $scope.scheduleMaxDate = moment($scope.schedulesList[$scope.scheduleIndex].maxEffectiveEnd, 'YYYY-MM-DD').format('MM/DD/YYYY').toString();
    };

    $scope.submitCreate = function () {
      if (!$scope.createCashBagForm.$valid) {
        showModalErrors('Please select both a schedule number and a schedule date');
        return;
      }
      var formattedDate = moment($scope.scheduleDate, 'MM/DD/YYYY').format('YYYYMMDD').toString();
      cashBagFactory.getDailySchedulesList(_companyId, $scope.schedulesList[$scope.scheduleIndex].scheduleNumber, formattedDate).then(function (response) {
        if (response.schedules.length < 1) {
          showModalErrors('Not a valid schedule');
        } else {
          $scope.displayError = false;
          $('#addCashBagModal').removeClass('fade').modal('hide');
          $location.path('cash-bag/create').search({
            scheduleNumber: $scope.schedulesList[$scope.scheduleIndex].scheduleNumber,
            scheduleDate: formattedDate
          });
        }
      });
    };

    $scope.isCashBagEditable = function (cashBag) {
      return (cashBag && !cashBag.isSubmitted && cashBag.isDelete === 'false');
    }

  });
