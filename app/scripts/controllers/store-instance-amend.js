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


    $scope.showRearrangeSectorModal = function () {
      angular.element('#rearrangeSectorModal').modal('show');
    };

    $scope.showMoveCashBagModal = function (cashBag) {
      $scope.cashBagToMove = cashBag;
      angular.element('#moveCashBagModal').modal('show');
    };

    $scope.closeRearrangeSectorModal = function () {
      $scope.sectorsToMove = [];
      $scope.rearrangeOriginCashBag = null;
      $scope.rearrangeTargetCashBag = null;
    };

    $scope.closeMoveCashBagModal = function () {
      $scope.moveCashBagAction = 'none';
      $scope.moveCashBagSearchResults = null;
      $scope.cashBagToMove = null;
    };

    $scope.clearRearrangeSelections = function () {
      $scope.sectorsToMove = [];
    };

    $scope.clearMoveSearchResults = function () {
      $scope.moveSearch = {};
      $scope.moveCashBagSearchResults = null;
      $scope.targetRecordForMoveCashBag = null;
    };

    $scope.canSaveRearrange = function () {
      return ($scope.sectorsToMove.lenghth && $scope.targetRecordForMoveCashBag);
    };

    $scope.toggleSelectSectorToRearrange = function (sector) {
      var matchIndex = lodash.findIndex($scope.sectorsToMove, sector);
      if(matchIndex < 0 ) {
        $scope.sectorsToMove.push(sector);
      } else {
        $scope.sectorsToMove.splice(matchIndex, 1);
      }
    };

    $scope.selectRecordForMoveCashBag = function (record) {
      $scope.targetRecordForMoveCashBag = record;
    };

    $scope.getClassesForRearrangeSectors = function (sector, tagType) {
      var selectedClasses = {background: 'bg-danger', buttonIcon: 'fa fa-check-circle', button: 'btn btn-danger btn-sm'};
      var deselectedClasses = {background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default btn-sm'};

      var objectMatch = lodash.findWhere($scope.sectorsToMove, {id: sector.id});
      var correctClassObj = (angular.isDefined(objectMatch)) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

    $scope.getClassesForMoveSelectedRow = function (record, tagType) {
      var selectedClasses = {background: 'bg-success', buttonIcon: 'fa fa-check-circle', button: 'btn btn-success'};
      var deselectedClasses = {background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default'};

      var correctClassObj = (record === $scope.targetRecordForMoveCashBag) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

    $scope.getClassForTableAccordion = function (visibilityFlag) {
      return (visibilityFlag) ? 'fa fa-minus-square' : 'fa fa-plus-square-o';
    };

    $scope.getClassForAccordionArrows = function (accordionFlag) {
      return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
    };

    $scope.doesSectorHaveCrewData = function (flightSector) {
      return flightSector.crewData.length;
    };

    $scope.shouldShowCashBag = function (cashBag) {
      return ($scope.showDeletedCashBags) ? true : !cashBag.isDeleted;
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

    $scope.toggleVerifiedCashBag = function (cashBag) {
      cashBag.isVerified = !cashBag.isVerified;
    };

    $scope.isSalesAndRevenueDetailsOpen = function (cashBag) {
      return (cashBag.salesTableOpen || cashBag.revenueTableOpen);
    };

    $scope.toggleSalesAndRevenueDetails = function (cashBag, shouldExpand) {
      cashBag.salesTableOpen = shouldExpand;
      cashBag.revenueTableOpen = shouldExpand;
    };

    $scope.isCrewDataOpen = function (cashBag) {
      var crewRecordOpen = false;
      angular.forEach(cashBag.flightSectors, function (sector) {
        crewRecordOpen = sector.rowOpen || crewRecordOpen;
      });
      return crewRecordOpen;
    };

    $scope.toggleCrewDetails = function (cashBag, shouldExpand) {
      angular.forEach(cashBag.flightSectors, function (sector) {
        if(sector.crewData.length) {
          sector.rowOpen = shouldExpand;
        }
      });
    };

    this.getCashBagListSuccess = function (dataFromAPI) {
      $scope.cashBagList = angular.copy(dataFromAPI);
    };

    this.getCashBagList = function () {
      storeInstanceAmendFactory.getCashBagListMockData().then($this.getCashBagListSuccess);
    };

    this.initViewDefaults = function () {
      $scope.moveCashBagAction = 'none';
      $scope.showDeletedCashBags = false;
      $scope.sectorsToMove = [];
      angular.element('#checkbox').bootstrapSwitch();
    };

    this.init = function () {
      $this.initViewDefaults();
      $this.getCashBagList();
    };

    $this.init();

  });
