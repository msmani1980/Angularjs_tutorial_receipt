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

    // TODO: documentation here:
    // http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
    };

    // TODO: change BACK button to back/save when models change

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
      reference: 'PHN4',
      itemName: 'iPhone 5s'
    }, {
      colorCode: '#CCC',
      companyName: 'One more here too',
      reference: 'NMHRT2',
      itemName: 'iPad Mini Retina'
    }];

  });
