'use strict';

/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:ItemsCtrl
 * @description
 * # ItemsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('ItemsCtrl', function ($scope,$http) {

        // QA (for all dem yummy items)
        var url = 'https://ec2-52-6-49-188.compute-1.amazonaws.com';

        // Dev environment
        // var url = 'https://54.87.153.42';

        // Request Object
        var req = {
            method: 'GET',
            url: url + '/api/retail-items1',
            headers: {
                'Content-Type': 'application/json',
                'userId': 1,
                'companyId': 326
            }
        };

        // set the list size
        $scope.listSize = 10;

        // Request Items from API
        $http(req).success(function(data) {

            $scope.items = data.retailItems;

            $scope.itemsCount = data.meta.count;

            var pagination =  generatePagniation($scope.itemsCount,$scope.listSize);

            $scope.pagination = pagination;


        }).error(function() {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
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
