'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,baseUrl,$location,$anchorScroll,itemsFactory,companiesService) {

    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {
        startDate: '20150515',
        endDate: '20150715',
        qrCodeValue: 'qrCode',
        images: [],
        prices: [],
        taxes:[],
        tags: [],
        allergens:[],
        characteristics:[],
        substitutions:[],
        recommendations: [],
        globalTradeNumbers: []
      };

      // Not complete
      $scope.addPrice = function() {

          // TODO: Currently adding 2 types at first, need to dynamically push items into this array

          $scope.formData.prices.push({
            startDate: $scope.formData.prices[0].startDate, 
            endDate:  $scope.formData.prices[0].endDate, 
            typeId: $scope.formData.prices[0].typeId, 
            priceCurrencies: [], 
            taxIs: $scope.formData.prices[0].taxIs
          });

          console.log($scope.formData);

      };

      // Submit function to proces form and hit the api 
      $scope.submitForm = function(formData) {

      	// If the local form is not valid
      	if(!$scope.form.$valid) {

      		// set display error flag to true (used in template)
				$scope.displayError = true;

  				return false;

  			}

      	// set the formData models in the view to the scope.formData object
      	$scope.formData = angular.copy(formData);

      	// FIXME forcing price right now
      	//$scope.formData.prices = [{startDate: '20150515', endDate: '20150715', typeId: '1', priceCurrencies: [], taxIs: 'Included',}];

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

      // Makes API requests  for item record dependencies likes itemTypes or allergens
      // TODO: Move this to the factory?
      function getItemDependencies() {

        // Get a list from the API
        itemsFactory.items.query(function (data) {
          $scope.items = data.retailItems;
        });

        // get items types
        itemsFactory.itemTypes.query(function(itemTypes) {
          $scope.itemTypes = itemTypes;
        });

        // get allergens
        itemsFactory.allergens.query(function(allergens) {
          $scope.allergens = allergens;
        });

        // get price types
        itemsFactory.priceTypes.query(function(priceTypes) {
          $scope.priceTypes = priceTypes;
        });

        // get characteristics
        itemsFactory.characteristics.query(function(characteristics) {
          $scope.characteristics = characteristics;
        });

        // get dimension units
        itemsFactory.units.dimension.query(function(data) {
          $scope.dimensionUnits = data.units;
        });

        // get weight units
        itemsFactory.units.weight.query(function(data) {
          $scope.weightUnits = data.units;
        });

        // get volume units
        itemsFactory.units.volume.query(function(data) {
          $scope.volumeUnits = data.units;
        });

      }

      // Makes API requests  for companyu record dependencies likes tags or sales-categories
      // TODO: Move this to the factory?
      function getCompanyDependencies() {

        // get tags
        companiesService.tags.query(function(data) {
          $scope.tags = data.response;
        });

        // get currencies
        companiesService.currencies.query(function(currencies) {
          $scope.currencies = currencies;
        });

        // get sales categories
        companiesService.salesCategories.query(function(data) {
          $scope.salesCategories = data.salesCategories;
        });

        // get tax types
        companiesService.taxTypes.query(function(data) {
          $scope.taxTypes = data.response;
        });

        // get stations
        companiesService.stations.query(function(data) {
          $scope.stations = data.response;
        });

      }

       // get item dependencies 
      getItemDependencies();

      // get company dependencies
      getCompanyDependencies();

  });