// TODO: Write tests for this controller

'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope,$compile,ENV,$resource,$location,$anchorScroll,itemsFactory,companiesFactory,currencyFactory) {

    	// View Name
  		$scope.viewName = 'Create Item';

  		// Form Data to be passed to API
  		$scope.formData = {
        startDate: moment().add(1,'days').format('L'), // set to tomorrow, for your health!
        endDate: moment().add(90,'days').format('L'), // 90 days into the future
        qrCodeValue: '',
        qrCodeImgUrl: null,
        images: [],
        taxes:[],
        tags: [],
        allergens:[],
        characteristics:[],
        substitutions:[],
        recommendations: [],
        globalTradeNumbers: [],
        prices: []
      };

      function formatDate(dateString, formatFrom, formatTo) {
        return moment(dateString, formatFrom).format(formatTo).toString();
      }

      // when the form data changes
      $scope.$watch('formData', function(newData, oldData){

        // check item dates and make sure all dates fall within the acceptable dates
        checkItemDates(newData,oldData);

      }, true);

      // check date ranges on items, price groups and station exceptions
      function checkItemDates(newData,oldData) {

        // if the start date has changed
        if(newData.startDate !== oldData.startDate || newData.endDate !== oldData.endDate) {

          // loop through all the price groups
          for(var priceIndex in $scope.formData.prices) {

            var price = $scope.formData.prices[priceIndex];

            // if new item end date is before price start date
            if( moment(newData.endDate).isBefore(price.startDate) ) {

              // set price start date as new item end date
              $scope.formData.prices[priceIndex].startDate = newData.endDate;

            }

            // if new item start date is after price start date
            if( moment(newData.startDate).isAfter(price.startDate) ) {

              // set price start date as new item start date
              $scope.formData.prices[priceIndex].startDate = newData.startDate;

            }

            // loop through all the station exceptions
            for(var stationIndex in $scope.formData.prices[priceIndex].stationExceptions) {

              var stationException = $scope.formData.prices[priceIndex].stationExceptions[stationIndex];

              // if new item end date is before station exception start date
              if( moment(newData.endDate).isBefore(stationException.startDate) ) {

                // set station exception start date as new item end date
                $scope.formData.prices[priceIndex].stationExceptions[stationIndex].startDate = newData.endDate;

              }

              // if new item start date is after station exception start date
              if( moment(newData.startDate).isAfter(stationException.startDate) ) {

                // set station exception start date as new item start date
                $scope.formData.prices[priceIndex].stationExceptions[stationIndex].startDate = newData.startDate;

              }

            }

          } // end price for loop

        } // end if newData.startDate is different

      } // end checkItemDates

      // Get a list of items for substitutions and recommendations
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


      // Adds a new Tax Type object
      $scope.addTaxType = function() {
        $scope.formData.taxes.push({});
      };

      // Remove a Tax Type object
      $scope.removeTaxType = function(key) {
        $scope.formData.taxes.splice(key,1);
      };

      // Adds a new GTIN object
      $scope.addGTIN = function() {
        $scope.formData.globalTradeNumbers.push({});
      };

      // Remove a GTIN object
      $scope.removeGTIN = function(key) {
        $scope.formData.globalTradeNumbers.splice(key,1);
      };

      // TODO: Make AJAX calls on start date and end date change
      // Adds a new StationException object
      $scope.addStationException = function(priceIndex) {

        // create a new station exception object and add to scope
        $scope.formData.prices[priceIndex].stationExceptions.push({
          startDate: $scope.formData.prices[priceIndex].startDate,
          endDate: $scope.formData.prices[priceIndex].endDate,
          stationExceptionCurrencies: []
        });

        // get stationExceptionIndex
        var stationExceptionIndex = $scope.formData.prices[priceIndex].stationExceptions.length - 1;

        // set to up
        updateStationException(priceIndex,stationExceptionIndex);

      };

      // Updates the station exception with stations list and currencies list
      function updateStationException(priceIndex,stationExceptionIndex) {

        var startDate = formatDate($scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex].startDate, 'L',  'YYYYMMDD');
        var endDate = formatDate($scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex].endDate, 'L',  'YYYYMMDD');

        // stations filter
        var stationsFilter = {
          startDate: startDate,
          endDate: endDate
        };

        // get stations
        companiesFactory.getStationsList(stationsFilter).then(function(data) {
          $scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex].stations = data.response;
        });

        // currency filter
        var currencyFilters = {
          startDate: startDate,
          endDate: endDate,
          isOperatedCurrency: true
        };

        currencyFactory.getCompanyCurrencies(currencyFilters).then(function (data) {

          // create a currencies collection
          var stationExceptionCurrencies = [];

          // loop through the response
          for(var key in data.response) {

            var currency = data.response[key];

            // push a new currency object into the currencies collection
            stationExceptionCurrencies.push({
              price: '1.00',
              companyCurrencyId: currency.id
            });

          }

          // create a new station exception object and add to scope
          $scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex].stationExceptionCurrencies = stationExceptionCurrencies;

        });

      }

      // Remove a GTStationExceptionIN object
      $scope.removeStationException = function(priceIndex,key) {
        $scope.formData.prices[priceIndex].stationExceptions.splice(key,1);
      };

      // Adds a new Price Group object to the formData
      $scope.addPriceGroup = function() {

        // push a new object into the prices collection
        $scope.formData.prices.push({
          startDate: $scope.formData.startDate,
          endDate: $scope.formData.endDate,
          priceCurrencies:[],
          stationExceptions:[]
        });

        // get stationExceptionIndex
        var priceIndex = $scope.formData.prices.length - 1;

        // set to up
        updatePriceGroup(priceIndex);

      };

      // pulls a list of currencies from the API and updates the price group
      function updatePriceGroup(priceIndex) {

        var startDate = formatDate($scope.formData.prices[priceIndex].startDate, 'L',  'YYYYMMDD');
        var endDate = formatDate($scope.formData.prices[priceIndex].endDate, 'L',  'YYYYMMDD');

        // currency filter
        var currencyFilters = {
          startDate: startDate,
          endDate: endDate,
          isOperatedCurrency: true
        };

        currencyFactory.getCompanyCurrencies(currencyFilters).then(function (data) {

          // create a currencies collection
          var priceCurrencies = [];

          // loop through the response
          for(var key in data.response) {

            var currency = data.response[key];

            // push a new currency object into the currencies collection
            priceCurrencies.push({
              price: '1.00',
              companyCurrencyId: currency.id
            });

          }

          // create a new station exception object and add to scope
          $scope.formData.prices[priceIndex].priceCurrencies = priceCurrencies;

        });

      }

      $scope.addPriceGroup();

      // Remove a Price Group object
      $scope.removePriceGroup = function(key) {
        $scope.formData.prices.splice(key,1);
      };

      // Submit function to proces form and hit the api
      $scope.submitForm = function(formData) {

        // If the local form is not valid
      	if(!$scope.form.$valid) {

      		// set display error flag to true (used in template)
				  $scope.displayError = true;

  				return false;

  			}

        // TODO: Add waiting modal

        // copy the form data to the newItem
        var newItem = angular.copy(formData);

        // TODO: move these loops to functions
        // TODO: Need to uppdate these to use Select2 Directive

        // loop through tags in form data
        for(var tagKey in newItem.tags) {

          var tagId = newItem.tags[tagKey];

          // set tag as object and set tagId property
          newItem.tags[tagKey] = {
            tagId: tagId
          };

        }

        // loop through allergens in form data
        for(var allergenKey in newItem.allergens) {

          var allergenId = newItem.allergens[allergenKey];

          // set tag as object and set allergenId property
          newItem.allergens[allergenKey] = {
            allergenId: allergenId
          };

        }

        // loop through characteristics in form data
        for(var characteristicKey in newItem.characteristics) {

          var characteristicId = newItem.characteristics[characteristicKey];

          // set tag as object and set characteristicId property
          newItem.characteristics[characteristicKey] = {
            characteristicId: characteristicId
          };

        }

        // format stary and end date
        newItem.startDate = formatDate(newItem.startDate, 'L',  'YYYYMMDD');
        newItem.endDate = formatDate(newItem.endDate, 'L',  'YYYYMMDD');

        // Loop through prices
        for(var priceIndex in newItem.prices) {

          var price = newItem.prices[priceIndex];

          // format start and end dates
          newItem.prices[priceIndex].startDate = formatDate(price.startDate, 'L',  'YYYYMMDD');
          newItem.prices[priceIndex].endDate = formatDate(price.endDate, 'L',  'YYYYMMDD');

          // loop through station exceptions
          for(var stationIndex in newItem.prices[priceIndex].stationExceptions) {

            var station = newItem.prices[stationIndex];

            // format start and end dates
            newItem.prices[stationIndex].startDate = formatDate(station.startDate, 'L',  'YYYYMMDD');
            newItem.prices[stationIndex].endDate = formatDate(station.endDate, 'L',  'YYYYMMDD');

          }

        }

        // create a new item
      	var newItemPayload = {
      		retailItem: newItem
      	};

      	// Create newItem in API
      	itemsFactory.createItem(newItemPayload).then(function(response) {

          console.log(response);

          // show the success
          angular.element('#create-success').modal('show');

        // API error
        }, function(error){

          // set flags for error UI to display
        	$scope.displayError = true;
		  	  $scope.formErrors = error.data;

        });

      };

      // TODO MOVE ME GLOBAL
  		$scope.formScroll = function(id, activeBtn) {

        $scope.activeBtn = id;

        var elm = angular.element('#'+id);
        var body = angular.element('body');
        var navBar = angular.element('.navbar-header').height();
        var topBar = angular.element('.top-header').height();

        body.animate({scrollTop: elm.offset().top - (navBar + topBar + 100)}, 'slow');

        return activeBtn;

	    };

  });
