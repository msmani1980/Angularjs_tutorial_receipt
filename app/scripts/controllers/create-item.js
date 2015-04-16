'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CreateItemCtrl
 * @description
 * # CreateItemCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CreateItemCtrl', function ($scope,$http) {

  	 // QA (for all dem yummy items)
    var url = 'https://ec2-52-6-49-188.compute-1.amazonaws.com';
    $scope.viewName = 'Create Items'; 

    // Request Object
    var req = {
        method: 'POST',
        url: url + '/api/retail-items1',
        headers: {
            'Content-Type': 'application/json',
            'userId': 1,
            'companyId': 326
        }
    };

  	angular.element('.save-btn').click(function() {

  			// Request Items from API
        $http(req).success(function(data) {

        	console.log(data);
           // success

        }).error(function() {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        });


  	});
    

  	

  });
