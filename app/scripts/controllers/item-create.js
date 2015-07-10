'use strict';
/*global moment*/
/*global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function ($scope, $compile, ENV, $resource,
    $location, $anchorScroll, itemsFactory, companiesFactory, currencyFactory,
    $routeParams, GlobalMenuService, $q) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();

    // object resolution in for sub scopes
    var $this = this;

    $scope.formData = {
      startDate: '',
      endDate: '',
      qrCodeValue: '',
      qrCodeImgUrl: null,
      images: [],
      taxes: [],
      tags: [],
      allergens: [],
      characteristics: [],
      substitutions: [],
      recommendations: [],
      globalTradeNumbers: [],
      prices: []
    };

    $scope.viewName = 'Create Item';
    $scope.buttonText = 'Create';
    $scope.itemIsActive = false;
    $scope.itemIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingItem = false;
    $scope.shouldDisplayURLField = false;


    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/item-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.updateViewName = function (item) {
      var prefix = 'Viewing ';
      if ($scope.editingItem) {
        prefix = 'Editing ';
      }
      $scope.viewName = prefix + item.itemName;
    };

    this.setFormAsEdit = function () {
      $scope.editingItem = true;
      $scope.buttonText = 'Save';
    };

    this.validateItemCompany = function (data) {
      return data.retailItem.companyId === companyId;
    };

    // gets an item to $scope.editingItem
    this.getItem = function (id) {

      var $this = this;

      // TODO: Make this use a loadingModal.show() method
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Item ' + id);

      itemsFactory.getItem(id).then(function (data) {
        if ($this.validateItemCompany(data)) {
          $this.updateFormData(data.retailItem);
          $this.updateViewName(data.retailItem);
        } else {
          $location.path('/');
          return false;
        }
        angular.element('#loading').modal('hide');
      });

    };

    this.checkIfViewOnly();

    if ($routeParams.id && !$scope.viewOnly) {
      this.setFormAsEdit();
    }

    if ($scope.editingItem || $scope.viewOnly) {
      this.getItem($routeParams.id);
    }

    // deserialize tag object from api
    function deserializeTags(itemData) {
      for (var tagKey in itemData.tags) {
        var tag = itemData.tags[tagKey];
        itemData.tags[tagKey] = tag.tagId.toString();
      }
    }

    // deserialize characteristics object from api
    function deserializeCharacteristics(itemData) {
      for (var characteristicKey in itemData.characteristics) {
        var characteristic = itemData.characteristics[characteristicKey];
        itemData.characteristics[characteristicKey] = characteristic.characteristicId
          .toString();
      }

    }

    // deserialize allergens object from api
    function deserializeAllergens(itemData) {
      for (var allergenkey in itemData.allergens) {
        var allergen = itemData.allergens[allergenkey];
        itemData.allergens[allergenkey] = allergen.allergenId.toString();
      }
    }

    // checks to see if the item is active
    function checkIfItemIsActive(itemData) {
      var today = new Date();
      var itemStartDate = new Date(itemData.startDate);
      $scope.itemIsActive = itemStartDate <= today;
    }

    // checks to see if the item is inactive
    function checkIfItemIsInactive(itemData) {
      var today = new Date();
      var itemEndDate = new Date(itemData.endDate);
      $scope.itemIsInactive = itemEndDate <= today;
    }

    // updates the $scope.formData
    this.updateFormData = function (itemData) {
      if (!itemData) {
        return false;
      }
      itemData.startDate = formatDate(itemData.startDate, 'YYYYMMDD', 'L');
      itemData.endDate = formatDate(itemData.endDate, 'YYYYMMDD', 'L');
      checkIfItemIsInactive(itemData);
      if (!$scope.itemIsInactive) {
        checkIfItemIsActive(itemData);
      }
      deserializeTags(itemData);
      deserializeCharacteristics(itemData);
      deserializeAllergens(itemData);

      // TODO: turn this into a function
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = formatDate(image.startDate, false, 'L');
        image.endDate = formatDate(image.endDate, false, 'L');
      }

      // TODO: turn this into a function
      for (var priceIndex in itemData.prices) {

        var price = itemData.prices[priceIndex];
        price.startDate = formatDate(price.startDate, false, 'L');
        price.endDate = formatDate(price.endDate, false, 'L');

        // TODO: turn this into a function
        for (var stationExceptionIndex in price.stationExceptions) {

          var stationException = price
            .stationExceptions[stationExceptionIndex];

          stationException.startDate = formatDate(stationException.startDate,
            false, 'L');
          stationException.endDate = formatDate(stationException.endDate,
            false, 'L');

        }

      }

      $scope.formData = itemData;
      this.updateStationsList();

    };

    // gets a list of all currencies for the item
    this.getMasterCurrenciesList = function () {
      currencyFactory.getCompanyCurrencies(function (data) {
        var masterCurrenciesList = [];
        for (var key in data.response) {
          var currency = data.response[key];
          masterCurrenciesList[currency.id] = currency.code;
        }
        $scope.masterCurrenciesList = masterCurrenciesList;
      });
    };

    // gets a list of price types for price group
    this.getPriceTypesList = function () {

      itemsFactory.getPriceTypesList(function (data) {
        $scope.priceTypes = data;
      });

    };

    this.getMasterCurrenciesList();
    this.getPriceTypesList();

    itemsFactory.getItemsList({}).then(function (data) {
      $scope.items = data.retailItems;
    });

    itemsFactory.getAllergensList(function (data) {
      $scope.allergens = data;
    });

    itemsFactory.getItemTypesList(function (data) {
      $scope.itemTypes = data;
    });

    itemsFactory.getCharacteristicsList(function (data) {
      $scope.characteristics = data;
    });

    itemsFactory.getDimensionList(function (data) {
      $scope.dimensionUnits = data.units;
    });

    itemsFactory.getVolumeList(function (data) {
      $scope.volumeUnits = data.units;
    });

    itemsFactory.getWeightList(function (data) {
      $scope.weightUnits = data.units;
    });

    companiesFactory.getTagsList(function (data) {
      $scope.tags = data.response;
    });

    companiesFactory.getSalesCategoriesList(function (data) {
      $scope.salesCategories = data.salesCategories;
    });

    companiesFactory.getTaxTypesList(function (data) {
      $scope.taxTypes = data.response;
    });

    $q.all([itemsFactory.getItemsList, itemsFactory.getAllergensList,
      itemsFactory.getTagsList, itemsFactory.getCharacteristicsList
    ]).then(function () {
      $('.multi-select').select2({
        width: '100%'
      });
    });

    // TODO: Move to global function
    function formatDate(dateString, formatFrom, formatTo) {
      var dateToReturn = moment(dateString, formatFrom).format(formatTo).toString();
      return dateToReturn;
    }

    $scope.$watch('formData', function (newData, oldData) {
      //checkItemDates(newData,oldData);
      $this.refreshPriceGroups(newData, oldData);
    }, true);

    $scope.$watch('form.$valid', function (validity) {
      if (validity) {
        $scope.displayError = false;
      }
    });


    // when a price date is change for a price groupd or station, need to update currencies
    this.refreshPriceGroups = function (newData, oldData) {

      if (!oldData) {
        return false;
      }

      // if the prices data has changed
      if (newData.prices !== oldData.prices) {

        // loop through all the price groups
        for (var priceIndex in $scope.formData.prices) {

          // the new and old price groups
          var newPriceGroup = newData.prices[priceIndex];
          var oldPriceGroup = oldData.prices[priceIndex];

          // if threre isn't old data yet, exit out of loop
          if (!oldPriceGroup || oldPriceGroup.startDate === '' ||
            oldPriceGroup.endDate === '') {
            return false;
          }

          // if the startDate or endDate is different
          if (newPriceGroup.startDate !== oldPriceGroup.startDate ||
            newPriceGroup.endDate !== oldPriceGroup.endDate) {

            // update the price group
            updatePriceGroup(priceIndex);

          }

          // loop through all the stations exceptions
          for (var stationExceptionIndex in $scope.formData.prices[
              priceIndex].stationExceptions) {

            var newStationException = newData.prices[priceIndex].stationExceptions[
              stationExceptionIndex];
            var oldStationException = oldData.prices[priceIndex].stationExceptions[
              stationExceptionIndex];

            // if threre isn't old data yet, exit out of loop
            if (!oldStationException || oldStationException.endDate === '') {
              return false;
            }

            // if the startDate or endDate is different
            if (newStationException.startDate !== oldStationException.startDate ||
              newStationException.endDate !== oldStationException.endDate) {

              // update the price group
              this.updateStationException(priceIndex, stationExceptionIndex);

            }

          } // end loop on stationExceptions

        } // end loop on price groups

      }

    };

    /*
          // check date ranges on items, price groups and station exceptions
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

                  // TODO: Move this to it's own function
                  if(price.stationExceptions.length > 0) {

                    // loop through all the station exceptions
                    for(var stationIndex in price.stationExceptions) {

                      var stationException = price.stationExceptions[stationIndex];

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

                    } // end station exception loop

                  } // end if exceptions list is greater than 0

                } // end price for loop

              } // if price length is greater than 0

            } // end if newData.startDate is different

          } // end checkItemDates

          */

    $scope.removeQRCode = function () {
      $scope.formData.qrCodeImgUrl = '';
      $scope.formData.qrCodeValue = '';
    };

    $scope.removeImage = function (key) {
      $scope.formData.images.splice(key, 1);
    };

    $scope.addTaxType = function () {
      $scope.formData.taxes.push({});
    };

    $scope.removeTaxType = function (key) {
      $scope.formData.taxes.splice(key, 1);
    };

    $scope.addGTIN = function () {
      $scope.formData.globalTradeNumbers.push({});
    };

    $scope.removeGTIN = function (key) {
      $scope.formData.globalTradeNumbers.splice(key, 1);
    };


    /*
     * Station Exceptions
     *
     */


    // Adds a station exception collection in the form
    $scope.addStationException = function (priceIndex) {
      $scope.formData.prices[priceIndex].stationExceptions.push({
        startDate: '',
        endDate: '',
        stationExceptionCurrencies: []
      });
    };

    // Removes a station exception collection from the form
    $scope.removeStationException = function (priceIndex, key) {
      $scope.formData.prices[priceIndex].stationExceptions.splice(key, 1);
    };

    $scope.filterCharacteristics = function () {
      if ($scope.itemTypes[$scope.formData.itemTypeId - 1].name ===
        'Virtual') {
        $scope.filteredCharacteristics = [];
        angular.forEach($scope.characteristics, function (value) {
          if (value.name === 'Downloadable' || value.name === 'Link') {
            $scope.filteredCharacteristics.push(value);
          }
          $scope.shouldDisplayURLField = true;
        });
      } else {
        $scope.filteredCharacteristics = $scope.characteristics;
        $scope.shouldDisplayURLField = false;
      }
    };

    // gets a list of stations from the API filtered by station's start and end date
    this.getGlobalStationList = function (stationException) {
      var startDate = formatDate(stationException.startDate, 'L',
        'YYYYMMDD');
      var endDate = formatDate(stationException.endDate, 'L', 'YYYYMMDD');
      var stationsFilter = {
        startDate: startDate,
        endDate: endDate
      };
      return companiesFactory.getGlobalStationList(stationsFilter);
    };

    // sets the stations list for the station exception
    this.setStationsList = function (stationException, data) {
      stationException.stations = data.response;
    };

    // gets a list of a stations available currencies filtered on the start and end date
    this.getStationsCurrenciesList = function (stationException) {
      var startDate = formatDate(stationException.startDate, 'L',
        'YYYYMMDD');
      var endDate = formatDate(stationException.endDate, 'L', 'YYYYMMDD');
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      return currencyFactory.getCompanyCurrencies(currencyFilters);
    };

    // sets the stations currenies list
    this.setStationsCurrenciesList = function (stationException, data) {
      var stationExceptionCurrencies = this.generateStationCurrenciesList(
        data.response);
      stationException.stationExceptionCurrencies =
        stationExceptionCurrencies;
    };

    // generate a list of station exception currencies
    this.generateStationCurrenciesList = function (currenciesList) {
      var listToReturn = [];
      for (var key in currenciesList) {
        var currency = currenciesList[key];
        listToReturn.push({
          price: '1.00',
          companyCurrencyId: parseInt(currency.id)
        });
      }
      return listToReturn;
    };

    // Updates the station exception with stations list and currencies list
    this.updateStationException = function (priceIndex, stationExceptionIndex) {
      var $this = this;
      var stationException = $scope.formData.prices[priceIndex].stationExceptions[
        stationExceptionIndex];
      this.getGlobalStationList(stationException).then(function (data) {
        $this.setStationsList(stationException, data);
      });
      this.getStationsCurrenciesList(stationException).then(function (data) {
        $this.setStationsCurrenciesList(stationException, data);
      });
    };

    // reaches out to the stations API per each station exception and update set stations list
    this.updateStationsList = function () {
      var stationPromises = [];
      for (var priceIndex in $scope.formData.prices) {
        var price = $scope.formData.prices[priceIndex];
        for (var stationExceptionIndex in price.stationExceptions) {
          var stationException = price.stationExceptions[
            stationExceptionIndex];
          stationPromises.push(this.getGlobalStationList(stationException));
        }
        this.handleStationPromises(stationPromises, price);
      }
    };

    // Handles all of the station promises and sets the stations list per price group
    this.handleStationPromises = function (stationPromises, price) {
      var $this = this;
      $q.all(stationPromises).then(function (data) {
        for (var key in data) {
          var stationException = price.stationExceptions[key];
          $this.setStationsList(stationException, data[key]);
        }
      });
    };

    /*
     * Price Groups
     *
     */


    $scope.addPriceGroup = function () {
      $scope.formData.prices.push({
        startDate: '',
        endDate: '',
        priceCurrencies: [],
        stationExceptions: []
      });
    };

    // Add the first price group
    $scope.addPriceGroup();

    $scope.removePriceGroup = function (key) {
      $scope.formData.prices.splice(key, 1);
    };


    // generate a list of price currencies
    function generatePriceCurrenciesList(currenciesList) {
      var priceCurrencies = [];
      for (var key in currenciesList) {
        var currency = currenciesList[key];
        priceCurrencies.push({
          price: '1.00',
          companyCurrencyId: currency.id,
          code: currency.code
        });
      }
      return priceCurrencies;
    }

    // pulls a list of currencies from the API and updates the price group
    function updatePriceGroup(priceIndex) {
      var startDate = formatDate($scope.formData.prices[priceIndex].startDate,
        'L', 'YYYYMMDD');
      var endDate = formatDate($scope.formData.prices[priceIndex].endDate,
        'L', 'YYYYMMDD');
      if (startDate === 'Invalid date' || endDate === 'Invalid date') {
        return false;
      }
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then(function (
        data) {
        var priceCurrencies = generatePriceCurrenciesList(data.response);
        $scope.formData.prices[priceIndex].priceCurrencies =
          priceCurrencies;
      });

    }

    // TODO: make this a controller function
    // Formats the dates when sending the payload to the API
    function formatPayloadDates(itemData) {
      itemData.startDate = formatDate(itemData.startDate, 'L', 'YYYYMMDD');
      itemData.endDate = formatDate(itemData.endDate, 'L', 'YYYYMMDD');
      // TODO: Turn this into a function
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = formatDate(image.startDate, 'L', 'YYYYMMDD');
        image.endDate = formatDate(image.endDate, 'L', 'YYYYMMDD');
      }
      // TODO: Turn this into a function
      for (var priceIndex in itemData.prices) {
        var price = itemData.prices[priceIndex];
        price.startDate = formatDate(price.startDate, 'L', 'YYYYMMDD');
        price.endDate = formatDate(price.endDate, 'L', 'YYYYMMDD');
        // TODO: Turn this into a function
        for (var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {
          var station = itemData.prices[priceIndex].stationExceptions[
            stationExceptionIndex];
          station.startDate = formatDate(station.startDate, 'L', 'YYYYMMDD');
          station.endDate = formatDate(station.endDate, 'L', 'YYYYMMDD');
        }
      }
    }

    // cleans up invalid properties of payload before submitting
    function cleanUpPayload(itemData) {
      for (var priceIndex in itemData.prices) {
        for (var currencyIndex in itemData.prices[priceIndex].priceCurrencies) {
          var currency = itemData.prices[priceIndex].priceCurrencies[
            currencyIndex];
          delete currency.code;
        }
        for (var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {
          var stationException = itemData.prices[priceIndex].stationExceptions[
            stationExceptionIndex];
          delete stationException.stations;
        }
      }
    }

    // formats the tags for payload
    function formatTags(itemData) {
      for (var tagKey in itemData.tags) {
        var tagId = itemData.tags[tagKey];
        itemData.tags[tagKey] = {
          tagId: tagId
        };
      }
    }

    // formats the allergens for payload
    function formatAllergens(itemData) {
      for (var allergenKey in itemData.allergens) {
        var allergenId = itemData.allergens[allergenKey];
        itemData.allergens[allergenKey] = {
          allergenId: allergenId
        };
      }
    }

    // formats the characteristics for payload
    function formatCharacteristics(itemData) {
      for (var characteristicKey in itemData.characteristics) {
        var characteristicId = itemData.characteristics[characteristicKey];
        itemData.characteristics[characteristicKey] = {
          characteristicId: characteristicId
        };
      }
    }

    this.updateItem = function (itemData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text(
        'We are updating your item');
      var updateItemPayload = {
        retailItem: itemData
      };
      itemsFactory.updateItem($routeParams.id, updateItemPayload).then(
        function (response) {
          $this.updateFormData(response.retailItem);
          angular.element('#loading').modal('hide');
          angular.element('#update-success').modal('show');
        },
        function (response) {
          angular.element('#loading').modal('hide');
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    function createItem(itemData) {
      angular.element('#loading').modal('show').find('p').text(
        'We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload).then(function () {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
      }, function (error) {
        angular.element('#loading').modal('hide');
        $scope.displayError = true;
        $scope.formErrors = error.data;
      });
    }

    $scope.submitForm = function (formData) {

      if (!$scope.form.$valid) {
        $scope.displayError = true;
        return false;
      }
      var itemData = angular.copy(formData);
      formatTags(itemData);
      formatCharacteristics(itemData);
      formatAllergens(itemData);
      formatPayloadDates(itemData);
      cleanUpPayload(itemData);
      if ($scope.editingItem) {
        $this.updateItem(itemData);
      } else {
        createItem(itemData);
      }

    };

    $scope.isMeasurementRequired = function () {
      return ($scope.formData.width || $scope.formData.length || $scope.formData
        .height);
    };

    $scope.isMeasurementValid = function () {
      return ($scope.formData.width && $scope.formData.length && $scope.formData
        .height && $scope.formData.dimensionType);
    };

    // TODO: MOVE ME GLOBAL
    $scope.formScroll = function (id, activeBtn) {
      $scope.activeBtn = id;
      var elm = angular.element('#' + id);
      var body = angular.element('body');
      var navBar = angular.element('.navbar-header').height();
      var topBar = angular.element('.top-header').height();
      body.animate({
        scrollTop: elm.offset().top - (navBar + topBar + 100)
      }, 'slow');
      return activeBtn;
    };

  });
