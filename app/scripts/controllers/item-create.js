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
  .controller('ItemCreateCtrl', function ($scope,$compile,ENV,$resource,$location,$anchorScroll,itemsFactory,companiesFactory,currencyFactory,$routeParams) {

  		$scope.viewName = 'Create Item';

  		$scope.buttonText = 'Create';

      var editingItem = false;

      if($routeParams.id) {
        editingItem = true;
      }

  		$scope.formData = {
        startDate: '',
        endDate: '',
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

      // gets an item to editingItem
      function getItem(id) {

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are getting Item ' + id);

    		$scope.viewName = 'Edit Item ' + id;

    		$scope.buttonText = 'Save';

        // TODO: format dates when setting values
        itemsFactory.getItem(id).then(function (data) {

          upateFormData(data.retailItem);

          // hide loading modal
          angular.element('#loading').modal('hide');

        });

      }

      if(editingItem) {

        getItem($routeParams.id);

      }

      // deserialize tag object from api
      function deserializeTags(itemData) {

        for(var tagKey in itemData.tags) {

          var tag = itemData.tags[tagKey];

          itemData.tags[tagKey] = tag.tagId.toString();

        }

      }

      // deserialize characteristics object from api
      function deserializeCharacteristics(itemData) {

        for(var characteristicKey in itemData.characteristics) {

          var characteristic = itemData.characteristics[characteristicKey];

          itemData.characteristics[characteristicKey] = characteristic.characteristicId.toString();

        }

      }

      // deserialize allergens object from api
      function deserializeAllergens(itemData) {

        for(var allergenkey in itemData.allergens) {

          var allergen = itemData.allergens[allergenkey];

          itemData.allergens[allergenkey] = allergen.allergenId.toString();

        }

      }

      // updates the $scope.formData
      function upateFormData(itemData) {

        deserializeTags(itemData);

        deserializeCharacteristics(itemData);

        deserializeAllergens(itemData);

        itemData.startDate = formatDate(itemData.startDate, 'YYYYMMDD', 'L');
        itemData.endDate = formatDate(itemData.endDate, 'YYYYMMDD', 'L');

        // Loop through images
        for(var imageIndex in itemData.images) {

          var image = itemData.images[imageIndex];

          // format start and end dates
          image.startDate = formatDate(image.startDate, false,  'L');
          image.endDate = formatDate(image.endDate, false,  'L');

        }

        for(var priceIndex in itemData.prices) {

          var price = itemData.prices[priceIndex];

          price.startDate = formatDate(price.startDate,false,'L') ;
          price.endDate = formatDate(price.endDate,false,'L') ;

          for(var stationExceptionIndex in price.stationExceptions) {

            var stationException = price.stationExceptions[stationExceptionIndex];

            stationException.startDate = formatDate(stationException.startDate,false,'L') ;
            stationException.endDate = formatDate(stationException.endDate,false,'L') ;

          }

        }

        $scope.formData = itemData;

      }

      itemsFactory.getItemsList({}).then(function (data) {
        $scope.items = data.retailItems;
      });

      itemsFactory.getAllergensList(function (data) {
        $scope.allergens = data;
      });

      itemsFactory.getItemTypesList(function (data) {
        $scope.itemTypes = data;
      });

      itemsFactory.getPriceTypesList(function (data) {
        $scope.priceTypes = data;
      });

      itemsFactory.getCharacteristicsList(function (data) {
        $scope.characteristics = data;
      });

      itemsFactory.getDimensionList(function(data) {
        $scope.dimensionUnits = data.units;
      });

      itemsFactory.getVolumeList(function(data) {
        $scope.weightUnits = data.units;
      });

      itemsFactory.getWeightList(function(data) {
        $scope.volumeUnits = data.units;
      });

      companiesFactory.getTagsList(function(data) {
        $scope.tags = data.response;
      });

      companiesFactory.getSalesCategoriesList(function(data) {
        $scope.salesCategories = data.salesCategories;
      });

      companiesFactory.getTaxTypesList(function(data) {
        $scope.taxTypes = data.response;
      });

      // TODO: Move to global function
      function formatDate(dateString, formatFrom, formatTo) {
        return moment(dateString, formatFrom).format(formatTo).toString();
      }

      $scope.$watch('formData', function(newData, oldData){

        // check item dates and make sure all dates fall within the acceptable dates
        checkItemDates(newData,oldData);

        // if a price group date or station exception changes, update currencies list
        refreshPriceGroups(newData,oldData);


      }, true);

      $scope.$watch('form.$valid', function(validity) {

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

      $scope.removeImage = function(key) {
        $scope.formData.images.splice(key,1);
      };

      $scope.addTaxType = function() {
        $scope.formData.taxes.push({});
      };

      $scope.removeTaxType = function(key) {
        $scope.formData.taxes.splice(key,1);
      };

      $scope.addGTIN = function() {
        $scope.formData.globalTradeNumbers.push({});
      };

      $scope.removeGTIN = function(key) {
        $scope.formData.globalTradeNumbers.splice(key,1);
      };

      $scope.addStationException = function(priceIndex) {

        // create a new station exception object and add to scope
        $scope.formData.prices[priceIndex].stationExceptions.push({
          startDate:'',
          endDate:'',
          stationExceptionCurrencies: []
        });

      };

      $scope.removeStationException = function(priceIndex,key) {
        $scope.formData.prices[priceIndex].stationExceptions.splice(key,1);
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

      $scope.addPriceGroup = function() {

        $scope.formData.prices.push({
          startDate: '',
          endDate: '',
          priceCurrencies:[],
          stationExceptions:[]
        });

      };

      // Add the first price group
      $scope.addPriceGroup();

      $scope.removePriceGroup = function(key) {
        $scope.formData.prices.splice(key,1);
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

      // Formats the dates when sending the payload to the API
      function formatPayloadDates(itemData){

        // format stary and end date
        itemData.startDate = formatDate(itemData.startDate, 'L',  'YYYYMMDD');
        itemData.endDate = formatDate(itemData.endDate, 'L',  'YYYYMMDD');

        // Loop through images
        for(var imageIndex in itemData.images) {

          var image = itemData.images[imageIndex];

          // format start and end dates
          image.startDate = formatDate(image.startDate, 'L',  'YYYYMMDD');
          image.endDate = formatDate(image.endDate, 'L',  'YYYYMMDD');

        }

        // Loop through prices
        for(var priceIndex in itemData.prices) {

          var price = itemData.prices[priceIndex];

          // format start and end dates
          price.startDate = formatDate(price.startDate, 'L',  'YYYYMMDD');
          price.endDate = formatDate(price.endDate, 'L',  'YYYYMMDD');

          // loop through station exceptions
          for(var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {

            var station = itemData.prices[priceIndex].stationExceptions[stationExceptionIndex];

            // format start and end dates
            station.startDate = formatDate(station.startDate, 'L',  'YYYYMMDD');
            station.endDate = formatDate(station.endDate, 'L',  'YYYYMMDD');

          }

        }

      }

      // cleans up invalid properties of payload before submitting
      function cleanUpPayload(itemData) {

        // Loop through prices
        for(var priceIndex in itemData.prices) {

          // loop through each price currency collection
          for(var currencyIndex in itemData.prices[priceIndex].priceCurrencies) {

            var currency = itemData.prices[priceIndex].priceCurrencies[currencyIndex];

            // remove code from currency collection before adding to payload
            delete currency.code;

          }

          // loop through station exceptions
          for(var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {

            var stationException = itemData.prices[priceIndex].stationExceptions[stationExceptionIndex];

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
      function formatTags(itemData) {

        // loop through tags in form data
        for(var tagKey in itemData.tags) {

          var tagId = itemData.tags[tagKey];

          // set tag as object and set tagId property
          itemData.tags[tagKey] = {
            tagId: tagId
          };

        }

      }

      // formats the allergens for payload
      function formatAllergens(itemData) {

        // loop through allergens in form data
        for(var allergenKey in itemData.allergens) {

          var allergenId = itemData.allergens[allergenKey];

          // set tag as object and set allergenId property
          itemData.allergens[allergenKey] = {
            allergenId: allergenId
          };

        }

      }

      // formats the characteristics for payload
      function formatCharacteristics(itemData) {

        // loop through characteristics in form data
        for(var characteristicKey in itemData.characteristics) {

          var characteristicId = itemData.characteristics[characteristicKey];

          // set tag as object and set characteristicId property
          itemData.characteristics[characteristicKey] = {
            characteristicId: characteristicId
          };

        }

      }

      function updateItem(itemData) {

        var updateItemPayload = {
          retailItem: itemData
        };

        // update itemData in API
        itemsFactory.updateItem( $routeParams.id, updateItemPayload).then(function(response) {

          upateFormData(response.retailItem);

          angular.element('#loading').modal('hide');

          // TODO: show alert instead of success
          window.alert('Item updated!');

        // error handler
        }, function(response){

          console.log(status);

          angular.element('#loading').modal('hide');

          $scope.displayError = true;
          $scope.formErrors = response.data;

        });

      }

      function createItem(itemData) {

        var newItemPayload = {
          retailItem: itemData
        };

        itemsFactory.createItem(newItemPayload).then(function() {

          angular.element('#loading').modal('hide');

          angular.element('#create-success').modal('show');

        // error response
        }, function(error){

          angular.element('#loading').modal('hide');

          $scope.displayError = true;
          $scope.formErrors = error.data;

        });

      }

      // Submit function to proces form and hit the api
      $scope.submitForm = function(formData) {

        console.log(formData);

      	if( !$scope.form.$valid ) {

				  $scope.displayError = true;

  				return false;

  			}

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are creating your item');

        // copy the form data to the itemData
        var itemData = angular.copy(formData);

        formatTags(itemData);

        formatCharacteristics(itemData);

        formatAllergens(itemData);

        formatPayloadDates(itemData);

        cleanUpPayload(itemData);

        if(editingItem) {

          updateItem(itemData);

        } else {

          createItem(itemData);

        }

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
