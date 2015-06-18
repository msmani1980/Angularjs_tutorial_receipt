'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagFactory, $location, $routeParams, ngToast) {
  	var companyId = cashBagFactory.getCompanyId();
    $scope.viewName = 'Manage Cash Bag';
    $scope.search = {};
    $scope.schedulesList = {};
    $scope.displayError = false;
    $scope.newCashBag = {};
    $scope.scheduleMinDate = '01/01/2000';
    $scope.scheduleMaxDate = '12/31/3000';
    $scope.displayError = false;
    $scope.createCashBagError = 'Error!';

    cashBagFactory.getCashBagList(companyId).then(function(response){
      $scope.cashBagList = response.cashBags;
      angular.forEach($scope.cashBagList, function(_cb){
        if($scope.isNew(_cb.id)){
          ngToast.create({
            className: 'success',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: successfully created!'
          });
          $scope.displayError = false;
          $scope.formErrors = {};
        }
      });
      $scope.bankRefList = getBankRefList(response.cashBags);
    });

    cashBagFactory.getStationList(companyId).then(function(response){
      $scope.stationList = response.response;
    });

    cashBagFactory.getSchedulesList(companyId).then(function(response){
      $scope.schedulesList = response.distinctSchedules;
    });

    $scope.viewCashBag = function (cashBag) {
      $location.path('cash-bag/view/' + cashBag.id);
    };

    $scope.editCashBag = function (cashBag) {
      $location.path('cash-bag/edit/' + cashBag.id);
    };

    $scope.searchCashBag = function () {
      // TODO: serialize scheduleDate parameter
      cashBagFactory.getCashBagList(companyId, $scope.search).then(function(response){
        $scope.cashBagList = response.cashBags;
      });
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchCashBag();
    };

    $scope.isNew = function(cashBagId){
      return ($routeParams.newId == cashBagId);
    };

    $scope.deleteCashBag = function(cashBag){
        // TODO validate that the cashBag is eligible for deletion.
        if($scope.canDelete(cashBag)) {
          cashBagFactory.deleteCashBag(cashBag.id).then(function () {
              alert('deleted');
            },
            showErrors);
        }
    };

    $scope.canDelete = function(cashBag){
      // TODO, BLOCKER, need access to the following values,
      // TODO These not available in the cash bag listing json object
      // cashBag.cashBagCurrencies[i].paperAmountManual
      // cashBag.cashBagCurrencies[i].coinAmountManual
      // cashBag.cashBagCurrencies[i].bankAmount
      // if all are null then can delete
      var canDelete = true;
      angular.forEach(cashBag.cashBagCurrencies, function(currency){
        if(canDelete){
          if(currency.paperAmountManual != null
            || currency.coinAmountManual != null
            || currency.coinAmountManual != null){
            canDelete = false;
          }
        }
      });
      return canDelete;
    };

    function showErrors(error){
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: error!'
      });
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    $scope.showCreatePopup = function () {
      angular.element('#addCashBagModal').modal('show');
    };

    $scope.submitCreate = function() {
      if(!$scope.createCashBagForm.$valid) {
        showError('Please select both a schedule number and a schedule date');
        return;
      }
      cashBagFactory.getDailySchedulesList(companyId, $scope.schedulesList[$scope.newCashBag.scheduleIndex].scheduleNumber, $scope.newCashBag.scheduleDate).then(function(response){
        if(response.schedules.length < 1) {
          showError('Not a valid schedule');
        } else {
          $scope.displayError = false;
          // TODO: show new form
        }
      });
    };

    $scope.updateScheduleDate = function() {
      var minDateComponents = $scope.schedulesList[$scope.newCashBag.scheduleIndex].minEffectiveStart.split('-');
      var maxDateComponents = $scope.schedulesList[$scope.newCashBag.scheduleIndex].maxEffectiveEnd.split('-');
      $scope.scheduleMinDate = minDateComponents[1] + '/' + minDateComponents[2] + '/' + minDateComponents[3];
      $scope.scheduleMaxDate = maxDateComponents[1] + '/' + maxDateComponents[2] + '/' + maxDateComponents[3];
    };

    function getBankRefList(cashBagList) {
      var bankRefList = [];
      cashBagList.forEach(function(element){
        if(element.bankReferenceNumber !== null && bankRefList.indexOf(element.bankReferenceNumber) < 0) {
          bankRefList.push(element.bankReferenceNumber);
        }
      });
      return bankRefList;
    }

    function showError(errorMsg) {
      $scope.displayError = true;
      $scope.createCashBagError = errorMsg;
    }

  });
