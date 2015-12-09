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

    $scope.toggleSelectSectorToMove = function (sector) {
      var matchIndex = lodash.findIndex($scope.sectorsToMove, sector);
      if(matchIndex < 0 ) {
        $scope.sectorsToMove.push(sector);
      } else {
        $scope.sectorsToMove.splice(matchIndex, 1);
      }
    };

    $scope.clearRearrangeSelections = function () {
      $scope.sectorsToMove = [];
    };

    $scope.closeRearrangeSectorModal = function () {
      $scope.sectorsToMove = [];
      $scope.rearrangeOriginCashBag = null;
      $scope.rearrangeTargetCashBag = null;
    };

    $scope.getClassesForRearrangeSectors = function (sector, tagType) {
      var selectedClasses = {background: 'bg-danger', buttonIcon: 'fa fa-check-circle', button: 'btn btn-danger btn-sm'};
      var deselectedClasses = {background: '', buttonIcon: 'fa fa-circle-thin', button: 'btn btn-default btn-sm'};

      var objectMatch = lodash.findWhere($scope.sectorsToMove, {id: sector.id});
      var correctClassObj = (angular.isDefined(objectMatch)) ? selectedClasses : deselectedClasses;
      return correctClassObj[tagType];
    };

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

    $scope.getClassForAccordionArrows = function (accordionFlag) {
      return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
    };

    this.getCashBagListSuccess = function (dataFromAPI) {
      $scope.cashBagList = angular.copy(dataFromAPI);
    };

    this.getCashBagList = function () {
      storeInstanceAmendFactory.getCashBagListMockData().then($this.getCashBagListSuccess);
    };

    this.initViewDefaults = function () {
      $scope.moveCashBagAction = 'none';
    };

    this.init = function () {
      $this.initViewDefaults();
      angular.element('#checkbox').bootstrapSwitch();
      $scope.showDeletedCashBags = false;
      $this.getCashBagList();
      $scope.sectorsToMove = [];
    };

    $this.init();

  });
