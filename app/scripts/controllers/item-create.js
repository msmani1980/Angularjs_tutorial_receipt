'use strict';
// jshint maxcomplexity:15
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemCreateCtrl', function($scope, $compile, ENV, $resource,
    $location, $anchorScroll, itemsFactory, companiesFactory, currencyFactory,
    $routeParams, GlobalMenuService, $q, dateUtility) {

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
    $scope.uiSelectTemplateReady = false;

    this.init = function() {
      this.checkIfViewOnly();
      this.getDependencies();
      if ($routeParams.id && !$scope.viewOnly) {
        this.setFormAsEdit();
      }
      if ($scope.editingItem || $scope.viewOnly) {
        this.getItem($routeParams.id);
      }
    };

    this.checkIfViewOnly = function() {
      var path = $location.path();
      if (path.search('/item-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.updateViewName = function(item) {
      var prefix = 'Viewing ';
      if ($scope.editingItem) {
        prefix = 'Editing ';
      }
      $scope.viewName = prefix + item.itemName;
    };

    this.setFormAsEdit = function() {
      $scope.editingItem = true;
      $scope.buttonText = 'Save';
    };

    this.validateItemCompany = function(data) {
      return data.retailItem.companyId === companyId;
    };

    // gets an item to $scope.editingItem
    this.getItem = function(id) {

      var $this = this;

      // TODO: Make this use a loadingModal.show() method
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Item ' + id);

      itemsFactory.getItem(id).then(function(data) {
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

    this.findTagsIndex = function(tagId) {
      var tagIndex = null;
      for (var key in $scope.tags) {
        var tag = $scope.tags[key];
        if (parseInt(tag.id) === parseInt(tagId)) {
          tagIndex = key;
          break;
        }
      }
      return tagIndex;
    };

    this.deserializeTags = function(itemData) {
      for (var tagKey in itemData.tags) {
        var tag = itemData.tags[tagKey];
        var index = $this.findTagsIndex(tag.tagId);
        itemData.tags[tagKey] = {
          id: tag.tagId,
          name: $scope.tags[index].name
        };
      }
    };

    this.formatTags = function(itemData) {
      var tagsPayload = [];
      for (var tagKey in itemData.tags) {
        var tag = itemData.tags[tagKey];
        tagsPayload[tagKey] = {
          tagId: tag.id,
          itemId: itemData.id
        };
      }
      return tagsPayload;
    };

    this.findCharacteristicIndex = function(characteristicId) {
      var characteristicIndex = null;
      for (var key in $scope.characteristics) {
        var characteristic = $scope.characteristics[key];
        if (parseInt(characteristic.id) === parseInt(characteristicId)) {
          characteristicIndex = key;
          break;
        }
      }
      return characteristicIndex;
    };

    this.deserializeCharacteristics = function(itemData) {
      for (var characteristicKey in itemData.characteristics) {
        var characteristic = itemData.characteristics[characteristicKey];
        var index = $this.findCharacteristicIndex(characteristic.characteristicId);
        itemData.characteristics[characteristicKey] = {
          id: characteristic.id,
          characteristicId: characteristic.characteristicId,
          name: $scope.characteristics[index].name
        };
      }
    };

    this.formatCharacteristics = function(itemData) {
      var characteristicsPayload = [];
      for (var characteristicKey in itemData.characteristics) {
        var characteristic = itemData.characteristics[characteristicKey];
        var newCharacteristic = {
          id: null,
          characteristicId: characteristic.id,
          itemId: itemData.id
        };
        if (characteristic.characteristicId) {
          newCharacteristic.id = characteristic.id;
          newCharacteristic.characteristicId = characteristic.characteristicId;
        }
        characteristicsPayload[characteristicKey] = newCharacteristic;
      }
      return characteristicsPayload;
    };

    this.findAllergenIndex = function(allergenId) {
      var allergenIndex = null;
      for (var key in $scope.allergens) {
        var allergen = $scope.allergens[key];
        if (parseInt(allergen.allergenId) === parseInt(allergenId)) {
          allergenIndex = key;
          break;
        }
      }
      return allergenIndex;
    };

    this.deserializeAllergens = function(itemData) {
      for (var allergenKey in itemData.allergens) {
        var allergen = itemData.allergens[allergenKey];
        var index = $this.findAllergenIndex(allergen.allergenId);
        itemData.allergens[allergenKey] = {
          id: allergen.id,
          allergenId: allergen.allergenId,
          name: $scope.allergens[index].name
        };
      }
    };
    this.formatAllergens = function(itemData) {
      var allergenPayload = [];
      for (var allergenKey in itemData.allergens) {
        var allergen = itemData.allergens[allergenKey];
        allergenPayload[allergenKey] = {
          id: allergen.id,
          allergenId: allergen.allergenId,
          itemId: itemData.id
        };
      }
      return allergenPayload;
    };

    this.findSubstitutionIndex = function(substitutionId) {
      var substitutionIndex = null;
      for (var key in $scope.substitutions) {
        var substitution = $scope.substitutions[key];
        if (parseInt(substitution.id) === parseInt(substitutionId)) {
          substitutionIndex = key;
          break;
        }
      }
      return substitutionIndex;
    };

    this.deserializeSubstitutions = function(itemData) {
      for (var substitutionKey in itemData.substitutions) {
        var substitutionId = itemData.substitutions[substitutionKey];
        var index = $this.findSubstitutionIndex(substitutionId);
        itemData.substitutions[substitutionKey] = {
          id: substitutionId,
          itemName: $scope.substitutions[index].itemName
        };
      }
    };

    this.formatSubstitutions = function(itemData) {
      var substitutionsPayload = [];
      for (var substitutionKey in itemData.substitutions) {
        var substitution = itemData.substitutions[substitutionKey];
        substitutionsPayload[substitutionKey] = substitution.id;
      }
      return substitutionsPayload;
    };

    this.findRecommendationIndex = function(recommendationId) {
      var recommendationIndex = null;
      for (var key in $scope.recommendations) {
        var recommendation = $scope.recommendations[key];
        if (parseInt(recommendation.id) === parseInt(recommendationId)) {
          recommendationIndex = key;
          break;
        }
      }
      return recommendationIndex;
    };

    this.deserializeRecommendations = function(itemData) {
      for (var recommendationKey in itemData.recommendations) {
        var recommendationId = itemData.recommendations[
          recommendationKey];
        var index = $this.findRecommendationIndex(recommendationId);
        itemData.recommendations[recommendationKey] = {
          id: recommendationId,
          itemName: $scope.recommendations[index].itemName
        };
      }
    };

    this.formatRecommendations = function(itemData) {
      var recommendationPayload = [];
      for (var recommendationKey in itemData.recommendations) {
        var recommendation = itemData.recommendations[recommendationKey];
        recommendationPayload[recommendationKey] = recommendation.id;
      }
      return recommendationPayload;
    };

    this.checkIfItemIsActive = function(itemData) {
      var today = new Date();
      var itemStartDate = new Date(itemData.startDate);
      $scope.itemIsActive = itemStartDate <= today;
    };

    // checks to see if the item is inactive
    this.checkIfItemIsInactive = function(itemData) {
      var today = new Date();
      var itemEndDate = new Date(itemData.endDate);
      $scope.itemIsInactive = itemEndDate <= today;
    };

    // updates the $scope.formData
    this.updateFormData = function(itemData) {
      if (!itemData) {
        return false;
      }
      itemData.startDate = dateUtility.formatDateForApp(itemData.startDate);
      itemData.endDate = dateUtility.formatDateForApp(itemData.endDate);
      this.checkIfItemIsInactive(itemData);
      if (!$scope.itemIsInactive) {
        this.checkIfItemIsActive(itemData);
      }
      this.deserializeTags(itemData);
      this.deserializeAllergens(itemData);
      this.deserializeCharacteristics(itemData);
      this.deserializeSubstitutions(itemData);
      this.deserializeRecommendations(itemData);

      // TODO: turn this into a function
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = dateUtility.formatDateForApp(image.startDate);
        image.endDate = dateUtility.formatDateForApp(image.endDate);
      }

      // TODO: turn this into a function
      for (var priceIndex in itemData.prices) {

        var price = itemData.prices[priceIndex];
        price.startDate = dateUtility.formatDateForApp(price.startDate);
        price.endDate = dateUtility.formatDateForApp(price.endDate);

        // TODO: turn this into a function
        for (var stationExceptionIndex in price.stationExceptions) {

          var stationException = price
            .stationExceptions[stationExceptionIndex];

          stationException.startDate = dateUtility.formatDateForApp(
            stationException.startDate);
          stationException.endDate = dateUtility.formatDateForApp(
            stationException.endDate);

        }

      }

      $scope.formData = itemData;
      this.updateStationsList();

    };

    this.makeDependencyPromises = function() {
      return [
        companiesFactory.getSalesCategoriesList(),
        companiesFactory.getTagsList(),
        companiesFactory.getTaxTypesList(),
        currencyFactory.getCompanyCurrencies(),
        itemsFactory.getAllergensList(),
        itemsFactory.getItemTypesList(),
        itemsFactory.getCharacteristicsList(),
        itemsFactory.getDimensionList(),
        itemsFactory.getVolumeList(),
        itemsFactory.getWeightList(),
        itemsFactory.getPriceTypesList(),
        itemsFactory.getItemsList({})
      ];
    };

    this.getDependencies = function() {
      angular.element('#loading').modal('show').find('p').text(
        'We are loading the Items data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(
        dependencyPromises).then(function(response) {
        $this.setDependencies(response);
        $scope.uiSelectTemplateReady = true;
        $scope.filteredCharacteristics = $scope.characteristics;
        angular.element('#loading').modal('hide');
      });
    };

    this.setDependencies = function(response) {
      $this.setSalesCategories(response[0]);
      $this.setTagsList(response[1]);
      $this.setTaxTypesList(response[2]);
      $this.setMasterCurrenciesList(response[3]);
      $this.setAllergens(response[4]);
      $this.setItemTypes(response[5]);
      $this.setCharacteristics(response[6]);
      $this.setDimensionList(response[7]);
      $this.setVolumeList(response[8]);
      $this.setWeightList(response[9]);
      $this.setItemPriceTypes(response[10]);
      $this.setItemList(response[11]);
    };
    this.setSalesCategories = function(data) {
      $scope.salesCategories = data.salesCategories;
    };

    this.setAllergens = function(data) {
      $scope.allergens = data;
    };

    this.setItemTypes = function(data) {
      $scope.itemTypes = data;
    };

    this.setCharacteristics = function(data) {
      $scope.characteristics = data;
    };

    this.setDimensionList = function(data) {
      $scope.dimensionUnits = data.units;
    };

    this.setVolumeList = function(data) {
      $scope.volumeUnits = data.units;
    };

    this.setWeightList = function(data) {
      $scope.weightUnits = data.units;
    };

    this.setTagsList = function(data) {
      $scope.tags = data.response;
    };

    this.setItemPriceTypes = function(data) {
      $scope.priceTypes = data;
    };

    this.setItemList = function(data) {
      $scope.items = data.retailItems;
      $scope.substitutions = data.retailItems;
      $scope.recommendations = data.retailItems;
    };

    this.setMasterCurrenciesList = function(data) {
      var masterCurrenciesList = [];
      for (var key in data.response) {
        var currency = data.response[key];
        masterCurrenciesList[currency.id] = currency.code;
      }
      $scope.masterCurrenciesList = masterCurrenciesList;
    };

    this.setTaxTypesList = function(data) {
      $scope.taxTypes = data.response;
    };

    this.init();

    this.formatStationExceptionDates = function(itemData, priceIndex) {
      for (var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {
        var station = itemData.prices[priceIndex].stationExceptions[
          stationExceptionIndex];
        station.startDate = dateUtility.formatDateForAPI(station.startDate);
        station.endDate = dateUtility.formatDateForAPI(station.endDate);
      }
    };

    this.formatPricePayloadDates = function(itemData) {
      for (var priceIndex in itemData.prices) {
        var price = itemData.prices[priceIndex];
        price.startDate = dateUtility.formatDateForAPI(price.startDate);
        price.endDate = dateUtility.formatDateForAPI(price.endDate);
        this.formatStationExceptionDates(itemData, priceIndex);
      }
    };

    this.formatImagePayloadDates = function(itemData) {
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = dateUtility.formatDateForAPI(image.startDate);
        image.endDate = dateUtility.formatDateForAPI(image.endDate);
      }
    };

    this.formatPayloadDates = function(itemData) {
      itemData.startDate = dateUtility.formatDateForAPI(itemData.startDate);
      itemData.endDate = dateUtility.formatDateForAPI(itemData.endDate);
      this.formatImagePayloadDates(itemData);
      this.formatPricePayloadDates(itemData);
    };

    this.cleanUpPayload = function(itemData) {
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
    };

    $scope.filterCharacteristics = function() {
      if ($scope.formData.itemTypeId && $scope.itemTypes[$scope.formData.itemTypeId -
          1].name ===
        'Virtual') {
        $scope.filteredCharacteristics = [];
        angular.forEach($scope.characteristics, function(value) {
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

    $scope.$watch('formData', function(newData, oldData) {
      //checkItemDates(newData,oldData);
      $this.refreshPriceGroups(newData, oldData);
    }, true);

    $scope.$watch('form.$valid', function(validity) {
      if (validity) {
        $scope.displayError = false;
      }
    });

    // when a price date is change for a price groupd or station, need to update currencies
    this.refreshPriceGroups = function(newData, oldData) {

      if (!oldData || !newData) {
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
            this.updatePriceGroup(priceIndex);

          }

          // loop through all the stations exceptions
          for (var stationExceptionIndex in $scope.formData.prices[
              priceIndex].stationExceptions) {

            var newStationException = newData.prices[priceIndex].stationExceptions[
              stationExceptionIndex];
            var oldStationException = oldData.prices[priceIndex].stationExceptions[
              stationExceptionIndex];

            // if threre isn't old data yet, exit out of loop
            if (!oldStationException || oldStationException.endDate ===
              '') {
              return false;
            }

            // if the startDate or endDate is different
            if (newStationException.startDate !== oldStationException.startDate ||
              newStationException.endDate !== oldStationException.endDate
            ) {

              // update the price group
              this.updateStationException(priceIndex, stationExceptionIndex);

            }

          } // end loop on stationExceptions

        } // end loop on price groups

      }

    };

    $scope.removeQRCode = function() {
      $scope.formData.qrCodeImgUrl = '';
      $scope.formData.qrCodeValue = '';
    };

    $scope.removeImage = function(key) {
      $scope.formData.images.splice(key, 1);
    };

    $scope.addTaxType = function() {
      $scope.formData.taxes.push({});
    };

    $scope.removeTaxType = function(key) {
      $scope.formData.taxes.splice(key, 1);
    };

    $scope.addGTIN = function() {
      $scope.formData.globalTradeNumbers.push({});
    };

    $scope.removeGTIN = function(key) {
      $scope.formData.globalTradeNumbers.splice(key, 1);
    };

    /*
     * Station Exceptions
     *
     */

    // Adds a station exception collection in the form
    $scope.addStationException = function(priceIndex) {
      $scope.formData.prices[priceIndex].stationExceptions.push({
        startDate: '',
        endDate: '',
        stationExceptionCurrencies: []
      });
    };

    // Removes a station exception collection from the form
    $scope.removeStationException = function(priceIndex, key) {
      $scope.formData.prices[priceIndex].stationExceptions.splice(key,
        1);
    };

    // gets a list of stations from the API filtered by station's start and end date
    this.getGlobalStationList = function(stationException) {
      var startDate = dateUtility.formatDateForAPI(stationException.startDate);
      var endDate = dateUtility.formatDateForAPI(stationException.endDate);
      var stationsFilter = {
        startDate: startDate,
        endDate: endDate
      };
      return companiesFactory.getGlobalStationList(stationsFilter);
    };

    // sets the stations list for the station exception
    this.setStationsList = function(stationException, data) {
      stationException.stations = data.response;
    };

    // gets a list of a stations available currencies filtered on the start and end date
    this.getStationsCurrenciesList = function(stationException) {
      var startDate = dateUtility.formatDateForAPI(stationException.startDate);
      var endDate = dateUtility.formatDateForAPI(stationException.endDate);
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      return currencyFactory.getCompanyCurrencies(currencyFilters);
    };

    // sets the stations currenies list
    this.setStationsCurrenciesList = function(stationException, data) {
      var stationExceptionCurrencies = this.generateStationCurrenciesList(
        data.response);
      stationException.stationExceptionCurrencies =
        stationExceptionCurrencies;
    };

    // generate a list of station exception currencies
    this.generateStationCurrenciesList = function(currenciesList) {
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
    this.updateStationException = function(priceIndex,
      stationExceptionIndex) {
      var $this = this;
      var stationException = $scope.formData.prices[priceIndex].stationExceptions[
        stationExceptionIndex];
      this.getGlobalStationList(stationException).then(function(data) {
        $this.setStationsList(stationException, data);
      });
      this.getStationsCurrenciesList(stationException).then(function(
        data) {
        $this.setStationsCurrenciesList(stationException, data);
      });
    };

    // reaches out to the stations API per each station exception and update set stations list
    this.updateStationsList = function() {
      var stationPromises = [];
      for (var priceIndex in $scope.formData.prices) {
        var price = $scope.formData.prices[priceIndex];
        for (var stationExceptionIndex in price.stationExceptions) {
          var stationException = price.stationExceptions[
            stationExceptionIndex];
          stationPromises.push(this.getGlobalStationList(
            stationException));
        }
        this.handleStationPromises(stationPromises, price);
      }
    };

    // Handles all of the station promises and sets the stations list per price group
    this.handleStationPromises = function(stationPromises, price) {
      var $this = this;
      $q.all(stationPromises).then(function(data) {
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

    $scope.addPriceGroup = function() {
      $scope.formData.prices.push({
        startDate: '',
        endDate: '',
        priceCurrencies: [],
        stationExceptions: []
      });
    };

    // Add the first price group
    $scope.addPriceGroup();

    $scope.removePriceGroup = function(key) {
      $scope.formData.prices.splice(key, 1);
    };

    $scope.generatePriceCurrenciesList = function(currenciesList) {
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
    };

    this.updatePriceGroup = function(priceIndex) {
      var startDate = dateUtility.formatDateForAPI($scope.formData.prices[
        priceIndex].startDate);
      var endDate = dateUtility.formatDateForAPI($scope.formData.prices[
        priceIndex].endDate);
      if (startDate === 'Invalid date' || endDate === 'Invalid date') {
        return false;
      }
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then(function(
        data) {
        var priceCurrencies = $scope.generatePriceCurrenciesList(data.response);
        $scope.formData.prices[priceIndex].priceCurrencies =
          priceCurrencies;
      });
    };

    this.updateItem = function(itemData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text(
        'We are updating your item');
      var updateItemPayload = {
        retailItem: itemData
      };
      itemsFactory.updateItem($routeParams.id, updateItemPayload).then(
        function(response) {
          $this.updateFormData(response.retailItem);
          angular.element('#loading').modal('hide');
          angular.element('#update-success').modal('show');
        },
        function(response) {
          angular.element('#loading').modal('hide');
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    this.createItem = function(itemData) {
      angular.element('#loading').modal('show').find('p').text(
        'We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload).then(function() {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
        return true;
      }, function(error) {
        angular.element('#loading').modal('hide');
        $scope.displayError = true;
        $scope.formErrors = error.data;
        return false;
      });
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var itemData = angular.copy(formData);
        var payload = $this.formatPayload(itemData);
        var action = $scope.editingItem ? 'updateItem' : 'createItem';
        $this[action](payload);
      }
    };

    this.validateForm = function() {
      $scope.displayError = false;
      if (!$scope.form.$valid) {
        $scope.displayError = true;
      }
      return $scope.form.$valid;
    };

    this.formatPayload = function(itemData) {
      itemData.tags = $this.formatTags(itemData);
      itemData.allergens = $this.formatAllergens(itemData);
      itemData.characteristics = $this.formatCharacteristics(itemData);
      itemData.substitutions = $this.formatSubstitutions(itemData);
      itemData.recommendations = $this.formatRecommendations(itemData);
      this.formatPayloadDates(itemData);
      this.cleanUpPayload(itemData);
      return itemData;
    };

    $scope.isMeasurementRequired = function() {
      return ($scope.formData.width || $scope.formData.length || $scope
        .formData
        .height);
    };

    $scope.isMeasurementValid = function() {
      return ($scope.formData.width && $scope.formData.length && $scope
        .formData
        .height && $scope.formData.dimensionType);
    };

    // TODO: MOVE ME GLOBAL
    $scope.formScroll = function(id, activeBtn) {
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
