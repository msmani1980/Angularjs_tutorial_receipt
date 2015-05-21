// TODO: Write tests for this controller

'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemCreateCtrl
 * @description
 * # StockOwnerItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockOwnerItemCreateCtrl', function ($scope,$compile,ENV,$resource,$location,$anchorScroll,itemsFactory,companiesFactory,currencyFactory,$routeParams,GlobalMenuService) {

      $scope.formData = {
        startDate: '',
        endDate: '',
        qrCodeValue: '',
        qrCodeImgUrl: null,
        images: [],
        tags: [],
        allergens:[],
        characteristics:[],
        substitutions:[],
        recommendations: [],
        globalTradeNumbers: [],
        prices: []
      };

      $scope.viewName = 'Create Item';

  		$scope.buttonText = 'Create';

      $scope.itemIsActive = false;

      $scope.itemIsInactive = false;

      $scope.viewOnly = $location.path().includes('item-view');

      var editingItem = false;

      function setFormAsViewOnly() {

        $scope.viewName = 'Viewing Item ' + $routeParams.id;

      }

      function setFormAsEdit() {

        editingItem = true;

        $scope.viewName = 'Edit Item ' + $routeParams.id;

        $scope.buttonText = 'Save';

      }

      // gets an item to editingItem
      function getItem(id) {

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are getting Item ' + id);

        itemsFactory.getItem(id).then(function (data) {

          upateFormData(data.retailItem);

          // hide loading modal
          angular.element('#loading').modal('hide');

        });

      }

      if($scope.viewOnly) {
        setFormAsViewOnly();
      }

      if( $routeParams.id && !$scope.viewOnly ) {
        setFormAsEdit();
      }

      if(editingItem || $scope.viewOnly) {

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

      // checks to see if the item is active
      function checkIfItemIsActive(itemData) {

        var today = moment().format();

        $scope.itemIsActive = moment( itemData.startDate ).isBefore( today );

      }

      // checks to see if the item is inactive
      function checkIfItemIsInactive(itemData) {

        var today = moment().format();

        $scope.itemIsInactive = moment( itemData.endDate ).isBefore( today );

      }

      // updates the $scope.formData
      function upateFormData(itemData) {

        itemData.startDate = formatDate(itemData.startDate, 'YYYYMMDD', 'L');
        itemData.endDate = formatDate(itemData.endDate, 'YYYYMMDD', 'L');

        checkIfItemIsInactive(itemData);

        if(!$scope.itemIsInactive) {

          checkIfItemIsActive(itemData);

        }

        deserializeTags(itemData);

        deserializeCharacteristics(itemData);

        deserializeAllergens(itemData);

        // TODO: turn this into a function
        // Loop through images
        for(var imageIndex in itemData.images) {

          var image = itemData.images[imageIndex];

          // format start and end dates
          image.startDate = formatDate(image.startDate, false,  'L');
          image.endDate = formatDate(image.endDate, false,  'L');

        }

        // TODO: turn this into a function
        for(var priceIndex in itemData.prices) {

          var price = itemData.prices[priceIndex];

          price.startDate = formatDate(price.startDate,false,'L') ;
          price.endDate = formatDate(price.endDate,false,'L') ;

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

        // if a price group date changes, update currencies list
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

          } // end loop on price groups

        }

      }

      // check date ranges on items, price groups
      function checkItemDates(newData,oldData) {

        if(newData.startDate !== oldData.startDate || newData.endDate !== oldData.endDate) {

          // TODO: Move this to it's own function
          if(newData.prices.length > 0) {

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

            } // end price for loop

          } // if price length is greater than 0

        } // end if newData.startDate is different

      } // end checkItemDates

      $scope.removeQRCode = function() {

        $scope.formData.qrCodeImgUrl = '';
        $scope.formData.qrCodeValue = '';

      };

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

      $scope.addPriceGroup = function() {

        $scope.formData.prices.push({
          startDate: '',
          endDate: '',
          priceCurrencies:[]
        });

      };

      // Add the first price group
      $scope.addPriceGroup();

      $scope.removePriceGroup = function(key) {
        $scope.formData.prices.splice(key,1);
      };

      // pulls a list of currencies from the API and updates the price group
      function updatePriceGroup(priceIndex) {


        // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
        var companyId = GlobalMenuService.company.get();

        currencyFactory.getCompanyBaseCurrency(companyId).then(function (data) {

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

          // add price currencies into the scope
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

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are updating your item');

        var updateItemPayload = {
          retailItem: itemData
        };

        // update itemData in API
        itemsFactory.updateItem( $routeParams.id, updateItemPayload).then(function(response) {

          upateFormData(response.retailItem);

          angular.element('#loading').modal('hide');

          angular.element('#update-success').modal('show');

        // error handler
        }, function(response){

          angular.element('#loading').modal('hide');

          $scope.displayError = true;
          $scope.formErrors = response.data;

        });

      }

      function createItem(itemData) {

        // display loading modal
        angular.element('#loading').modal('show').find('p').text( 'We are creating your item');

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

      	if( !$scope.form.$valid ) {

				  $scope.displayError = true;

  				return false;

  			}

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
