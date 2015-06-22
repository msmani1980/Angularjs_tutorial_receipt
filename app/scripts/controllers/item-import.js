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
    $scope.stockOwnerList = [
      {name: 'GRO'},
      {name: 'Easy Jet'},
      {name: 'Delta'}
    ];

    // TODO: pull data from API
    $scope.stockOwnerItemsList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'CHP0524',
      itemName: 'Bananas'
    }, {
      colorCode: '#FFF',
      companyName: 'Another one',
      reference: 'NTHR1',
      itemName: 'Apple'
    }];

    // TODO: pull data from API
    $scope.itemList = [{
      colorCode: '#00FF00',
      companyName: 'GRO',
      reference: 'CHP0524',
      itemName: 'Bananas'
    },{
      colorCode: '#CCC',
      companyName: 'One more here too',
      reference: 'NMHRT2',
      itemName: 'iPad Mini Retina'
    }];

  });
