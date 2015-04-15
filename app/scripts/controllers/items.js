'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemsCtrl
 * @description
 * # ItemsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('ItemsCtrl', function ($scope,$http) {

        var req = {
            method: 'GET',
            url: 'https://ec2-52-6-49-188.compute-1.amazonaws.com/api/retail-items1',
            headers: {
                'Content-Type': 'application/json',
                'userId': 1,
                'companyId': 326
            }
        };

        $http(req).success(function(data, status, headers, config) {

            $scope.items = data.retailItems;

    
        }).error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });

    });
