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
    .controller('ItemListCtrl', function ($scope,$http,itemsFactory) {

        itemsFactory.getItemTypesList().then(function(itemTypes) {
            $scope.itemTypes = itemTypes;
        });

        $scope.listSize = 10;

        itemsFactory.getItemsList({}).then(function (itemList) {
            $scope.items = itemList.retailItems;
            $scope.itemsCount = itemList.meta.count;
            var pagination =  generatePagination($scope.itemsCount,$scope.listSize);
            $scope.pagination = pagination;

        });

        $scope.$watch('listSize', function() {
            var pagination =  generatePagination($scope.itemsCount, parseInt(this.last));
            $scope.pagination = pagination;
        });

        function generatePagination(itemCount,itemsPerPage) {
            var pageCount = Math.ceil( itemCount / itemsPerPage );
            var pages = [0];

            for(var i = 1; i < pageCount; i++) {
                pages.push(i);
            }

            return {
                pages: pages,
                pageCount: pageCount
            };
        }
    });
