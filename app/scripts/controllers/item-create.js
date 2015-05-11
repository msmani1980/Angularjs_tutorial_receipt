// TODO:
// Write tests for this controller

'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$compile,baseUrl,$location,$anchorScroll,itemsFactory,companiesFactory,currencyFactory) {


      $scope.addPriceTypeBlock = function() {

        $scope.formData.prices.push(priceData);

        var el = $compile( '<input-price-type priceTypeModel="formData.prices['+$scope.formData.prices.length+']"></input-price-type>' )( $scope );

        angular.element('#price-type-container').append( el );

      };
      
      var priceData = { startDate: '20150515', endDate: '20150715', typeId: '1', priceCurrencies: [], taxIs: 'Included',};

    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {
        startDate: '20150515',
        endDate: '20150715',
        qrCodeValue: '',
        qrCodeImgUrl: null,
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


      $scope.$watchCollection('formData.prices', function(newPrices, oldNames) {

        console.log($scope.formData.prices);  console.log(newPrices);
        //$scope.formData.prices = newPrices;

      });


      //$scope.prices = {};

      // Get a list of items
      itemsFactory.getItemsList(function (data) {
        $scope.items = data.retailItems;
      });

      // Get a list of allergens
      itemsFactory.getAllergensList(function (data) {
        $scope.allergens = data;
      });

      // Get a list of item Types
      itemsFactory.getItemTypesList(function (data) {
        $scope.itemTypes = data;
      });

      // Get a list of Price Types
      itemsFactory.getPriceTypesList(function (data) {
        $scope.priceTypes = data;
      });

      // Get a list of Price Types
      itemsFactory.getCharacteristicsList(function (data) {
        $scope.characteristics = data;
      });

      // get dimension units
      itemsFactory.getDimensionList(function(data) {
        $scope.dimensionUnits = data.units;
      });

      // get weight units
      itemsFactory.getVolumeList(function(data) {
        $scope.weightUnits = data.units;
      });

      // get volume units
      itemsFactory.getWeightList(function(data) {
        $scope.volumeUnits = data.units;
      });

      // get tags
      companiesFactory.getTagsList(function(data) {
        $scope.tags = data.response;
      });

      // get sales categories
      companiesFactory.getSalesCategoriesList(function(data) {
        $scope.salesCategories = data.salesCategories;
      });

      // get curriences
      // TODO: Refactor this factory to use new standards and then update this call to be more like above
      currencyFactory.getCompanyBaseCurrency().then(function (data) {
        $scope.currencies = data;
      });

       // get tax types
      companiesFactory.getTaxTypesList(function(data) {
        $scope.taxTypes = data.response;
      });


      // get stations
      companiesFactory.getStationsList(function(data) {
        $scope.stations = data.response;
      });

      // Not complete
      $scope.addPrice = function() {

          //$scope.formData.prices.push($scope.prices);

          //$scope.prices = {};

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

  });
