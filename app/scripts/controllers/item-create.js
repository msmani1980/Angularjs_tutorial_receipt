// TODO: Write tests for this controller
// TODO: Make all dates relate to each other

'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$compile,ENV,$resource,$location,$anchorScroll,itemsFactory,companiesFactory) {

      // first price type data object
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
        prices: [priceData],
        taxes:[],
        tags: [],
        allergens:[],
        characteristics:[],
        substitutions:[],
        recommendations: [],
        globalTradeNumbers: []
      };

      // Get a list of items
      itemsFactory.getItemsList({}).then(function (data) {
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

       // get tax types
      companiesFactory.getTaxTypesList(function(data) {
        $scope.taxTypes = data.response;
      });

      // get stations
      companiesFactory.getStationsList(function(data) {
        $scope.stations = data.response;
      });

      // Adds a new Price Group object to the formData
      $scope.addPriceGroup = function() {

        // TODO: Move this to the currency Service
        companyCurrenciesResource.query(function(data){

          var priceCurrencies = [];

          for(var key in data.response) {

            var currency = data.response[key];

            priceCurrencies.push({
              price: '1.00',
              companyCurrencyId: currency.id
            });

          }

          $scope.formData.prices.push({
            priceCurrencies:priceCurrencies
          });

        });

      };

      // TODO: Move currencies logic to service
      var actions = {
        query: {
          method: 'GET',
          isArray: false,
        }
      };

      var companyCurrenciesURL = ENV.apiUrl + '/api/company-currency-globals';
      var companyCurrenciesResource = $resource(companyCurrenciesURL, {userId:1,companyId: 2, startDate: '20150515', endDate: '20150715', },actions);

      // TODO: Move this to the currency Service
      companyCurrenciesResource.query(function(data){

        for(var key in data.response) {

          var currency = data.response[key];

          $scope.formData.prices[0].priceCurrencies.push({
            price: '1.00',
            companyCurrencyId: currency.id
          });

        }

      });

      // Submit function to proces form and hit the api
      $scope.submitForm = function(formData) {

        // TODO: move these loops to functions

        // loop through tags in form data
        for(var tagKey in formData.tags) {

          var tagId = formData.tags[tagKey];

          // set tag as object and set tagId property
          formData.tags[tagKey] = {
            tagId: tagId
          };

        }

        // loop through allergens in form data
        for(var allergenKey in formData.allergens) {

          var allergenId = formData.allergens[allergenKey];

          // set tag as object and set allergenId property
          formData.allergens[allergenKey] = {
            allergenId: allergenId
          };

        }

        // loop through characteristics in form data
        for(var characteristicKey in formData.characteristics) {

          var characteristicId = formData.characteristics[characteristicKey];

          // set tag as object and set characteristicId property
          formData.characteristics[characteristicKey] = {
            characteristicId: characteristicId
          };

        }

      	// If the local form is not valid
      	if(!$scope.form.$valid) {

      		// set display error flag to true (used in template)
				  $scope.displayError = true;

  				return false;

  			}

        // create a new item
      	var newItem = {
      		retailItem: formData
      	};

      	// Create newItem in API
      	itemsFactory.createItem(newItem).then(function(response) {

          console.log(response);

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
