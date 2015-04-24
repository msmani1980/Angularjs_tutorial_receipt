'use strict';

/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:ItemListCtrl
 * @description
 * # ItemsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemListCtrl', function ($scope, $http, itemsFactory) {

    $http.defaults.headers.common.userId = 1;
    $http.defaults.headers.common.companyId = 326;

    // set the list size
    $scope.listSize = 10;

    // Get a list from the API
    var itemList = itemsFactory.query(function () {
      $scope.items = itemList.retailItems;
      $scope.itemsCount = itemList.meta.count;
      var pagination = generatePagniation($scope.itemsCount, $scope.listSize);
      $scope.pagination = pagination;
    });

    // Watch the listSize model change (items per page dropdown for pagination)
    $scope.$watch('listSize', function () {
      var pagination = generatePagniation($scope.itemsCount, parseInt(this.last));
      $scope.pagination = pagination;
    });

    //Generates pagination information
    function generatePagniation(itemCount, itemsPerPage) {
      var pageCount = Math.ceil(itemCount / itemsPerPage);
      var pages = [0];
      for (var i = 1; i < pageCount; i++) {
        pages.push(i);
      }

      return {
        pages: pages,
        pageCount: pageCount
      };

    }

  });
