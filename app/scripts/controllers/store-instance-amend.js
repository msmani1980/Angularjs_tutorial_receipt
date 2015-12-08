'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceAmendCtrl
 * @description
 * # StoreInstanceAmendCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceAmendCtrl', function ($q, $scope, $routeParams, $filter, storeInstanceAmendFactory, dateUtility, lodash) {
    var $this = this;


    $scope.showMoveCashBagModal = function (cashBag) {
      $scope.cashBagToMove = cashBag;
      angular.element('#moveCashBagModal').modal('show');
    };

    $scope.dismissMoveCashBagModal = function () {
      $scope.moveCashBagAction = 'none';
      $scope.moveCashBagSearchResults = null;
      $scope.cashBagToMove = null;
    };

    $scope.clearMoveSearchResults = function () {
      $scope.moveSearch = {};
      $scope.moveCashBagSearchResults = null;
      $scope.targetRecordForMoveCashBag = null;
    };

    this.searchForMoveCashBagSuccess = function (dataFromAPI) {
      $scope.moveCashBagSearchResults = angular.copy(dataFromAPI);
      if ($scope.moveCashBagSearchResults.length === 1) {
        $scope.targetRecordForMoveCashBag = $scope.moveCashBagSearchResults[0];
      }
    };

    $scope.searchForMoveCashBag = function () {
      if ($scope.moveCashBagAction === 'merge') {
        storeInstanceAmendFactory.getCashBagListMockData($scope.moveSearch).then($this.searchForMoveCashBagSuccess);
      } else if ($scope.moveCashBagAction === 'reallocate') {
        storeInstanceAmendFactory.getStoreInstancesMockData($scope.moveSearch).then($this.searchForMoveCashBagSuccess);
      }
    };

    $scope.selectRecordForMoveCashBag = function (record) {
      $scope.targetRecordForMoveCashBag = record;
    };

    $scope.getClassesForMoveSelectedRow = function (record, tagType) {
      var selectedClasses = {background: 'bg-success', buttonIcon: 'fa fa-check-circle', button: 'btn btn-success'};
      var deselectedClasses = {background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default'};

      var correctClassObj = (record === $scope.targetRecordForMoveCashBag) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

    $scope.getClassForOpenRow = function (visibilityFlag) {
      return (visibilityFlag) ? 'fa fa-minus-square' : 'fa fa-plus-square-o';
    };

    $scope.shouldShowCashBag = function (cashBag) {
      return ($scope.showDeletedCashBags) ? true : !cashBag.isDeleted;
    };

    $scope.doesSectorHaveCrewData = function (flightSector) {
      return flightSector.crewData.length;
    };

    this.getCashBagListSuccess = function (dataFromAPI) {
      $scope.cashBagList = angular.copy(dataFromAPI);
    };

    this.getCashBagList = function () {
      storeInstanceAmendFactory.getCashBagListMockData().then($this.getCashBagListSuccess);
    };

    this.init = function () {
      angular.element('#checkbox').bootstrapSwitch();
      $scope.showDeletedCashBags = false;
      $this.getCashBagList();
    };

    $this.init();

  });
