'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($scope, $routeParams, ngToast, $location) {

    $scope.showModal = function () {
      angular.element("#t6Modal").modal('show');
    };

    $scope.shouldAllowEditingForItem = function (item, isLMPStockItem) {
      if(isLMPStockItem) {
        return item.isEditing || $scope.editLMPStockTable;
      } else {
        return item.isEditing || $scope.editEposSalesTable;
      }
    };

    $scope.toggleEditLMPStockTable = function () {
      $scope.editLMPStockTable = !$scope.editLMPStockTable;
      angular.forEach($scope.LMPStock, function (item) {
        item.isEditing = false;
      });
    };

    $scope.editItem = function (item) {
      item.isEditing = true;
    };

    function init() {
      $scope.switchModel = true;
      angular.element("#checkbox").bootstrapSwitch();

      $scope.editLMPStockTable = false;
      $scope.editEposSalesTable = false;


      $scope.LMPStock = [{
        itemName: 'Chocolate',
        dispatchedCount: 50,
        inboundCount: 50,
        ePOSSales: 20,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 7.0,
        isEditing: false
      }, {
        itemName: 'Coke',
        dispatchedCount: 20,
        inboundCount: 35,
        ePOSSales: 12,
        varianceQuantity: 0,
        retailValue: 5,
        varianceValue: 14.0,
        isEditing: false
      }, {
        itemName: 'Pepsi',
        dispatchedCount: 150,
        inboundCount: 30,
        ePOSSales: 25,
        varianceQuantity: 11,
        retailValue: 6,
        varianceValue: 12.0,
        isEditing: false
      }];
    }
    init();




  });
