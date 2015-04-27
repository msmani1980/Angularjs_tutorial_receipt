'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$http,baseUrl,$location,$anchorScroll,itemsFactory) {
    
      // TODO: make global and ingest actuall user / company ids
  		$http.defaults.headers.common.userId = 1;
    	$http.defaults.headers.common.companyId = 326;

    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {};

      // get items types
      itemsFactory.itemTypes.query(function(itemTypes) {
        $scope.itemTypes = itemTypes;
      });

      // get allergens
      itemsFactory.allergens.query(function(allergens) {
        $scope.allergens = allergens;
      });

      // get characteristics
      itemsFactory.characteristics.query(function(characteristics) {
        $scope.characteristics = characteristics;
      });

        // Submit form 

      $scope.submitForm = function(formData) {

        	// If the local form is not valid
        	if(!$scope.form.$valid) {

        		// set display error flag to true (used in template)
  				$scope.displayError = true;

    				return false;

    			}

        	// set the formData models in the view to the scope.formData object
        	$scope.formData = angular.copy(formData);

          	// forcing price right now, FIX ME
          	$scope.formData.prices = [{startDate: '20150515', endDate: '20150715', typeId: '1', priceCurrencies: [], taxIs: 'Included',}];

          	var newItem = {
          		retailItem: formData
          	};

          	// Create newItem in API
  	      	itemsFactory.items.save(newItem,function () {

  	            angular.element('#create-success').modal('show');

  	        // API error
  	        }, function(error){

  	        	$scope.displayError = true;
  			  
  			  	  $scope.formErrors = error.data;

  	        });

          };

        // TODO MOVE ME GLOBAL
  		$scope.scrollTo = function(id) {
	      $location.hash(id);
	      $anchorScroll();
	    };

  });