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

        // get item types
        itemsFactory.itemTypes.query(function(itemTypes) {
            $scope.itemTypes = itemTypes;
        });

        // set the list size
        $scope.listSize = 10; 

        // Get a list from the API
        itemsFactory.items.query(function (itemList) {

            $scope.items = itemList.retailItems;  

            $scope.itemsCount = itemList.meta.count;

            var pagination =  generatePagniation($scope.itemsCount,$scope.listSize);

            $scope.pagination = pagination;

        });

        // Watch the listSize model change (items per page dropdown for pagination)
        $scope.$watch('listSize', function() {

            var pagination =  generatePagniation($scope.itemsCount, parseInt(this.last));

            $scope.pagination = pagination;

        });

        //Generates pagination information
        function generatePagniation(itemCount,itemsPerPage) {

            var pageCount = Math.ceil( itemCount / itemsPerPage );

            var pages = [];

            for(var i = 1; i < pageCount; i++) {
                pages.push(i);
            }

            return {
                pages: pages,
                pageCount: pageCount
            };

        }

    });
