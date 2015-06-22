'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope) {
    $scope.viewName = 'Import Stock Owner Items';

    // TODO: pull data from API
    $scope.stockOwnerList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'CHP0524',
      itemName: 'Bananas'
    }];

    // TODO: pull data from API
    $scope.itemList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'CHP0524',
      itemName: 'Bananas'
    }];

  });
