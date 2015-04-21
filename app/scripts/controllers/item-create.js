'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$http,baseUrl,$location,$anchorScroll) {

  		$scope.scrollTo = function(id) {
	      $location.hash(id);
	      $anchorScroll();
	    };

	    $scope.regex = {
			bit: /^(0|1)$/,
			num: /^-?([0-9]*)$/,
			alpha: /^[a-zA-z\s]+$/,
			alphanum:  /^[a-zA-Z0-9]?[\s||\'||\"||\.||\?||\!||\-||a-zA-Z0-9]+$/,
			email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
			phone: /^([0-9]{3}( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
			cc: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
			zip: /^(([0-9]{5})|([0-9]{5}[-][0-9]{4}))$/,
			decimal: /^\d+\.\d{0,4}$/,
			price: /^\$?\s?[0-9\,]+(\.\d{0,4})?$/
		};
    
    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {};

        // Submit form 
        $scope.submitForm = function(formData) {

        	// If the local form is not valid
        	if(!$scope.form.$valid) {

  				$scope.displayError = true;

  				return false;
  			}

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
