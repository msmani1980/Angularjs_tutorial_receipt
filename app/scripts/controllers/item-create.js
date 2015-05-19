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
        startDate: '', //moment().add(1,'days').format('L'), // set to tomorrow, for your health!
        endDate: '',// moment().add(90,'days').format('L'), // 90 days into the future
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

      // TODO: Move to global function
      function formatDate(dateString, formatFrom, formatTo) {
        return moment(dateString, formatFrom).format(formatTo).toString();
      }

      // when the form data changes
      $scope.$watch('formData', function(newData, oldData){

        // check item dates and make sure all dates fall within the acceptable dates
        checkItemDates(newData,oldData);

        // if a price group date or station exception changes, update currencies list
        refreshPriceGroups(newData,oldData);


      }, true);

      // when the form to become valide
      $scope.$watch('form.$valid', function(validity) {

        // when it does hide the displayError ui component
        if(validity) {
          $scope.displayError = false;
        }

      });


      // when a price date is change for a price groupd or station, need to update currencies
      function refreshPriceGroups(newData,oldData) {

        // if the prices data has changed
        if(newData.prices !== oldData.prices) {

          // loop through all the price groups
          for(var priceIndex in $scope.formData.prices) {

            // the new and old price groups
            var newPriceGroup = newData.prices[priceIndex];
            var oldPriceGroup = oldData.prices[priceIndex];

            // if threre isn't old data yet, exit out of loop
            if(oldPriceGroup.startDate === '' || oldPriceGroup.endDate === '') {
              return false;
            }

            // if the startDate or endDate is different
            if(newPriceGroup.startDate !== oldPriceGroup.startDate || newPriceGroup.endDate !== oldPriceGroup.endDate) {

              // update the price group
              updatePriceGroup(priceIndex);

            }

            // loop through all the stations exceptions
            for(var stationExceptionIndex in $scope.formData.prices[priceIndex].stationExceptions) {

              var newStationException = newData.prices[priceIndex].stationExceptions[stationExceptionIndex];
              var oldStationException = oldData.prices[priceIndex].stationExceptions[stationExceptionIndex];

              // if threre isn't old data yet, exit out of loop
              if(!oldStationException || oldStationException.endDate === '') {
                return false;
              }

              // if the startDate or endDate is different
              if(newStationException.startDate !== oldStationException.startDate || newStationException.endDate !== oldStationException.endDate) {

                // update the price group
                updateStationException(priceIndex,stationExceptionIndex);

              }

            } // end loop on stationExceptions

          } // end loop on price groups

        }

      }

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
              price.startDate = newData.endDate;

            }

            // if new item start date is after price start date
            if( moment(newData.startDate).isAfter(price.startDate) ) {

              // set price start date as new item start date
              price.startDate = newData.startDate;

            }

            // loop through all the station exceptions
            for(var stationIndex in $scope.formData.prices[priceIndex].stationExceptions) {

              var stationException = $scope.formData.prices[priceIndex].stationExceptions[stationIndex];

              // if new item end date is before station exception start date
              if( moment(newData.endDate).isBefore(stationException.startDate) ) {

                // set station exception start date as new item end date
                stationException.startDate = newData.endDate;

              }

              // if new item start date is after station exception start date
              if( moment(newData.startDate).isAfter(stationException.startDate) ) {

                // set station exception start date as new item start date
                stationException.startDate = newData.startDate;

              }

            }

          } // end price for loop

        } // end if newData.startDate is different

      } // end checkItemDates

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

      // Adds a new StationException object
      $scope.addStationException = function(priceIndex) {

        // create a new station exception object and add to scope
        $scope.formData.prices[priceIndex].stationExceptions.push({
          startDate:'',
          endDate:'',
          stationExceptionCurrencies: []
        });

      };

      // Updates the station exception with stations list and currencies list
      function updateStationException(priceIndex,stationExceptionIndex) {

        var stationException = $scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex];

        var startDate = formatDate(stationException.startDate, 'L',  'YYYYMMDD');
        var endDate = formatDate(stationException.endDate, 'L',  'YYYYMMDD');

        // stations filter
        var stationsFilter = {
          startDate: startDate,
          endDate: endDate
        };

        // get stations
        companiesFactory.getStationsList(stationsFilter).then(function(data) {
          stationException.stations = data.response;
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
              companyCurrencyId: currency.id,
              code: currency.code
            });

          }

          // create a new station exception object and add to scope
          stationException.stationExceptionCurrencies = stationExceptionCurrencies;

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
          startDate: '',
          endDate: '',
          priceCurrencies:[],
          stationExceptions:[]
        });

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
              companyCurrencyId: currency.id,
              code: currency.code
            });

          }

          // create a new station exception object and add to scope
          $scope.formData.prices[priceIndex].priceCurrencies = priceCurrencies;

        });

      }

      // Add the first price group
      $scope.addPriceGroup();

      // Remove a Price Group object
      $scope.removePriceGroup = function(key) {
        $scope.formData.prices.splice(key,1);
      };

      // Formats the dates when sending the payload to the API
      function formatPayloadDates(newItem){

        // format stary and end date
        newItem.startDate = formatDate(newItem.startDate, 'L',  'YYYYMMDD');
        newItem.endDate = formatDate(newItem.endDate, 'L',  'YYYYMMDD');

        // Loop through prices
        for(var priceIndex in newItem.prices) {

          var price = newItem.prices[priceIndex];

          // format start and end dates
          price.startDate = formatDate(price.startDate, 'L',  'YYYYMMDD');
          price.endDate = formatDate(price.endDate, 'L',  'YYYYMMDD');

          // loop through station exceptions
          for(var stationExceptionIndex in newItem.prices[priceIndex].stationExceptions) {

            var station = newItem.prices[priceIndex].stationExceptions[stationExceptionIndex];

            // format start and end dates
            station.startDate = formatDate(station.startDate, 'L',  'YYYYMMDD');
            station.endDate = formatDate(station.endDate, 'L',  'YYYYMMDD');

          }

        }

      }

      // cleans up invalid properties of payload before submitting
      function cleanUpPayload(newItem) {

        // Loop through prices
        for(var priceIndex in newItem.prices) {

          // loop through each price currency collection
          for(var currencyIndex in newItem.prices[priceIndex].priceCurrencies) {

            var currency = newItem.prices[priceIndex].priceCurrencies[currencyIndex];

            // remove code from currency collection before adding to payload
            delete currency.code;

          }

          // loop through station exceptions
          for(var stationExceptionIndex in newItem.prices[priceIndex].stationExceptions) {

            var stationException = newItem.prices[priceIndex].stationExceptions[stationExceptionIndex];

            // remove stations collection for stations exception before  adding to payload
            delete stationException.stations;

            // loop through each station exception  currency collection
            for(var stationCurrencyIndex in stationException.stationExceptionCurrencies) {

              // remove code from stations exceptions currencies item  adding to payload
              delete stationException.stationExceptionCurrencies[stationCurrencyIndex].code;

            }

          }

        }

      }

      // formats the tags for payload
      function formatTags(newItem) {

        // loop through tags in form data
        for(var tagKey in newItem.tags) {

          var tagId = newItem.tags[tagKey];

          // set tag as object and set tagId property
          newItem.tags[tagKey] = {
            tagId: tagId
          };

        }

      }

      // formats the allergens for payload
      function formatAllergens(newItem) {

        // loop through allergens in form data
        for(var allergenKey in newItem.allergens) {

          var allergenId = newItem.allergens[allergenKey];

          // set tag as object and set allergenId property
          newItem.allergens[allergenKey] = {
            allergenId: allergenId
          };

        }

      }

      // formats the characteristics for payload
      function formatCharacteristics(newItem) {

        // loop through characteristics in form data
        for(var characteristicKey in newItem.characteristics) {

          var characteristicId = newItem.characteristics[characteristicKey];

          // set tag as object and set characteristicId property
          newItem.characteristics[characteristicKey] = {
            characteristicId: characteristicId
          };

        }

      }


      // Submit function to proces form and hit the api
      $scope.submitForm = function(formData) {

        console.log($scope.form);

        // If the local form is not valid
      	if(!$scope.form.$valid) {

      		// set display error flag to true (used in template)
				  $scope.displayError = true;

  				return false;

  			}

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are creating your item');

        // copy the form data to the newItem
        var newItem = angular.copy(formData);

        formatTags(newItem);

        formatCharacteristics(newItem);

        formatAllergens(newItem);

        formatPayloadDates(newItem);

        cleanUpPayload(newItem);

        // create a new item
      	var newItemPayload = {
      		retailItem: newItem
      	};

      	// Create newItem in API
      	itemsFactory.createItem(newItemPayload).then(function(response) {

          // hide loading modal
          angular.element('#loading').modal('hide');

          console.log(response);

          // show the success
          angular.element('#create-success').modal('show');

        // API error
        }, function(error){

          // hide loading modal
          angular.element('#loading').modal('hide');

          // set flags for error UI to display
        	$scope.displayError = true;
		  	  $scope.formErrors = error.data;

        });

      };

      // TODO: MOVE ME GLOBAL
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
