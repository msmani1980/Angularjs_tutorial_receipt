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


    $scope.showModal = function () {
      angular.element('#reallocateModal').modal('show');
    };

    $scope.getClassForOpenRow = function (visbilityFlag) {
      return (visbilityFlag) ? 'fa fa-minus-square' : 'fa fa-plus-square-o';
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
