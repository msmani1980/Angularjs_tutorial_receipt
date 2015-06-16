'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */

angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagFactory, $location) {
  	var companyId = cashBagFactory.getCompanyId();
    $scope.viewName = 'Manage Cash Bag';
    $scope.search = {};
    $scope.schedulesList = {};
    $scope.newCashBag = {};
    $scope.displayError = false;
    $scope.createCashBagError = 'Error!'

    cashBagFactory.getCashBagList(companyId).then(function(response){
      $scope.cashBagList = response.cashBags;
      $scope.bankRefList = getBankRefList(response.cashBags);
    });

    cashBagFactory.getStationList(companyId).then(function(response){
      $scope.stationList = response.response;
    });

    cashBagFactory.getSchedulesList(companyId).then(function(response){
      $scope.schedulesList = response.distinctSchedules;
    });

    $scope.viewCashBag = function (cashBag) {
      $location.path('cash-bag/' + cashBag.id);
    };

    $scope.editCashBag = function (cashBag) {
      $location.path('cash-bag/' + cashBag.id + '/edit');
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

    $scope.showCreatePopup = function () {
      angular.element('#addCashBagModal').modal('show');
    };

    $scope.submitCreate = function() {
      if ($scope.newCashBag.scheduleDate == undefined || $scope.newCashBag.scheduleNumber == undefined){
        showError('Please select both a schedule number and a schedule date');
        return;
      }
      cashBagFactory.getDailySchedulesList(companyId, $scope.newCashBag.scheduleNumber, $scope.newCashBag.scheduleDate).then(function(response){
        if(response.schedules.length < 1) {
          showError('Not a valid schedule');
        } else {
          // TODO: show new form
        }
      });
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
      $scope.createCashBagError = 'Please select both a schedule number and a schedule date';
    }


  });
