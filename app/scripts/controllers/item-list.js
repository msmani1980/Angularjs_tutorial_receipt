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

        // set the list size
        $scope.listSize = 10;

        itemsFactory.getList().then(function (data) {

            $scope.items = data.retailItems;

            $scope.itemsCount = data.meta.count;

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

            console.log(pages);

            return {
                pages: pages,
                pageCount: pageCount
            };

        }

    });
