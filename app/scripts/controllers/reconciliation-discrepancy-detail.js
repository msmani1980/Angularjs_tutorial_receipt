'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($scope, $routeParams, ngToast, $location, lodash) {

    $scope.showModal = function () {
      angular.element("#t6Modal").modal('show');
    };

    $scope.showEditViewForItem = function (item, isLMPStockItem) {
      if(isLMPStockItem) {
        return item.isEditing || $scope.editLMPStockTable;
      } else {
        return item.isEditing || $scope.editEposSalesTable;
      }
    };

    $scope.editLMPStockItem = function (index) {
      $scope.LMPStockRevisions = angular.copy($scope.LMPStock);
      $scope.LMPStock[index].isEditing = true;
    };

    $scope.saveLMPStockItem = function (index) {
      $scope.LMPStock[index].isEditing = false;
      $scope.LMPStock[index] = angular.copy($scope.LMPStockRevisions[index]);
    };

    $scope.revertLMPStockItem = function (index) {
      $scope.LMPStockRevisions[index] = angular.copy($scope.LMPStock[index]);
    };

    $scope.cancelEditingLMPStockItem = function (index) {
      $scope.LMPStock[index].isEditing = false;
      $scope.revertLMPStockItem(index);
    };

    $scope.enableEditLMPStockTable = function () {
      $scope.editLMPStockTable = true;

      angular.forEach($scope.LMPStock, function (item) {
        item.isEditing = false;
      });
      $scope.LMPStockRevisions = angular.copy($scope.LMPStock);
    };

    $scope.saveLMPStockTable = function () {
      $scope.editLMPStockTable = false;
      $scope.LMPStock = angular.copy($scope.LMPStockRevisions);
    };

    $scope.cancelEditingLMPStockTable = function () {
      $scope.editLMPStockTable = false;
    };

    $scope.initLMPStockRevisionsForEditing = function () {
      $scope.LMPStockRevisions = angular.copy($scope.LMPStock);
    };

    function init() {
      angular.element("#checkbox").bootstrapSwitch();
      $scope.switchModel = true;
      $scope.editLMPStockTable = false;
      $scope.editEposSalesTable = false;

      $scope.LMPStock = [{
        id: 1,
        itemName: 'Chocolate',
        dispatchedCount: 50,
        inboundCount: 50,
        ePOSSales: 20,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 7.0,
        isDiscrepancy: true,
        isEditing: false
      }, {
        id: 2,
        itemName: 'Coke',
        dispatchedCount: 20,
        inboundCount: 35,
        ePOSSales: 12,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 14.0,
        isDiscrepancy: false,
        isEditing: false
      }, {
        id: 3,
        itemName: 'Pepsi',
        dispatchedCount: 150,
        inboundCount: 30,
        ePOSSales: 25,
        varianceQuantity: 11,
        retailValue: 6,
        varianceValue: 12.0,
        isDiscrepancy: true,
        isEditing: false
      }];
    }
    init();




  });
