'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$http,baseUrl) {
    
    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {};

        // Submit form 
        $scope.submitForm = function(formData) {

        	// set the formData models in the view to the scope.formData object
        	$scope.formData = angular.copy(formData);

          	// forcing price right now, FIX ME
          	$scope.formData.prices = [{startDate: '20150515', endDate: '20150715', typeId: '1', priceCurrencies: [], taxIs: 'Included',}];

          	// Request Object
			var req = {
			  method: 'POST',
			  url: baseUrl + '/api/retail-items1',
			  headers: {
			      'Content-Type': 'application/json',
			      'userId': 1,
			      'companyId': 326
			  },
			  data: {
			    retailItem: $scope.formData
			  }
			};

			// Post Data to server
			$http(req).success(function() {

				angular.element('#create-success').modal('show');

			}).error(function(data) {

				$scope.displayError = true;
			  
			  	$scope.formErrors = data;

			});

          };

  });
