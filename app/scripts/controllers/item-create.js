'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('ItemCreateCtrl',
  function($scope, $compile, ENV, $resource, $location, $anchorScroll, itemsFactory, companiesFactory,
    currencyFactory,
    $routeParams, GlobalMenuService, $q, dateUtility, $filter) {

    // TODO: Refactor so the company object is returned, right now it's returning a number so that ember will play nice
    var companyId = GlobalMenuService.company.get();

    // object resolution in for sub scopes
    var $this = this;

    $scope.formData = {
      startDate: dateUtility.tomorrowFormatted(),
      endDate: dateUtility.tomorrowFormatted(),
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
      prices: [],
      shouldUseDynamicBarcode: {
        value: false
      }
    };

    $scope.viewName = 'Create Item';
    $scope.buttonText = 'Create';
    $scope.itemIsActive = false;
    $scope.itemIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingItem = false;
    $scope.cloningItem = false;
    $scope.shouldDisplayURLField = false;
    $scope.uiSelectTemplateReady = false;
    $scope.displayCloneInfo = false;
    $scope.dynamicStaticBarcodeOptions = [{
      label: 'Dynamic Barcode',
      value: true
    }, {
      label: 'GTIN',
      value: false
    }];

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/item-edit') !== -1 && $routeParams.id) {
        $scope.editingItem = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/item-copy') !== -1 && $routeParams.id) {
        $scope.cloningItem = true;
      } else if (path.search('/item-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.init = function() {
      this.checkFormState();
      this.getDependencies();
    };

    this.updateViewName = function(item) {
      var prefix = 'Viewing ';
      if ($scope.editingItem) {
        prefix = 'Editing ';
      } else if ($scope.cloningItem) {
        prefix = 'Cloning ';
      }
      $scope.viewName = prefix + item.itemName;
    };

    this.validateItemCompany = function(data) {
      return data.retailItem.companyId === companyId;
    };

    this.setVoucherData = function() {
      $scope.formData.shouldUseDynamicBarcode = {
        value: !!$scope.formData.isDynamicBarcodes
      };

      if (!$scope.discountList) {
        return;
      }

      if ($scope.formData.companyDiscountId) {
        $scope.formData.voucher = $filter('filter')($scope.discountList, {
          id: $scope.formData.companyDiscountId
        }, true)[0];
      }
    };

    // gets an item to $scope.editingItem
    this.getItem = function(id) {
      this.showLoadingModal('We are getting your Items data!');
      itemsFactory.getItem(id).then(function(data) {
        if ($this.validateItemCompany(data)) {
          $this.updateFormData(data.retailItem);
          $this.updateViewName(data.retailItem);
        } else {
          $location.path('/');
          return false;
        }
        $this.setUIReady();
      });
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
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
        if (index) {
          itemData.tags[tagKey] = {
            id: tag.tagId,
            name: $scope.tags[index].name
          };
        }
      }
    };

    this.formatTags = function(itemData) {
      var tagsPayload = [];
      for (var tagKey in itemData.tags) {
        var tag = itemData.tags[tagKey];
        tagsPayload[tagKey] = {
          tagId: tag.id
        };
        if (!$scope.cloningItem) {
          tagsPayload[tagKey].itemId = itemData.id;
        }
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
          characteristicId: characteristic.id
        };
        if (characteristic.characteristicId && $scope.cloningItem) {
          newCharacteristic.characteristicId = characteristic.characteristicId;
        } else if (characteristic.characteristicId && !$scope.cloningItem) {
          newCharacteristic.id = characteristic.id;
          newCharacteristic.characteristicId = characteristic.characteristicId;
        }
        if (!$scope.cloningItem) {
          newCharacteristic.itemId = itemData.id;
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
          allergenId: allergen.allergenId
        };
        if (!$scope.cloningItem) {
          allergenPayload[allergenKey].itemId = itemData.id;
          allergenPayload[allergenKey].id = allergen.id;
        }
      }
      return allergenPayload;
    };

    this.formatGlobalTradeNumbers = function(itemData) {
      for (var numberKey in itemData.globalTradeNumbers) {
        var number = itemData.globalTradeNumbers[numberKey];
        if ($scope.cloningItem) {
          delete number.itemId;
          delete number.id;
        }
      }
    };

    this.formatTaxes = function(itemData) {
      for (var taxKey in itemData.taxes) {
        var tax = itemData.taxes[taxKey];
        if ($scope.cloningItem) {
          delete tax.itemId;
          delete tax.id;
        }
      }
    };

    this.formatPrices = function(itemData) {
      for (var priceKey in itemData.prices) {
        var price = itemData.prices[priceKey];
        if ($scope.cloningItem) {
          delete price.itemId;
          delete price.id;
        }
        $this.formatStationExceptions(price);
      }
    };

    this.formatStationExceptions = function(priceData) {
      for (var exceptionKey in priceData.stationExceptions) {
        var exception = priceData.stationExceptions[exceptionKey];
        if ($scope.cloningItem) {
          delete exception.id;
          for (var currencyKey in exception.stationExceptionCurrencies) {
            var currency = exception.stationExceptionCurrencies[currencyKey];
            delete currency.id;
          }
        }
      }
    };

    this.formatImages = function(itemData) {
      for (var imageKey in itemData.images) {
        var image = itemData.images[imageKey];
        if ($scope.cloningItem) {
          delete image.id;
        }
      }
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
      if (angular.isUndefined(itemData.substitutions)) {
        return;
      }
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
        var recommendationId = itemData.recommendations[recommendationKey];
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

    this.formatImageDates = function(images) {
      angular.forEach(images, function(image) {
        image.startDate = dateUtility.formatDateForApp(image.startDate);
        image.endDate = dateUtility.formatDateForApp(image.endDate);
      });
    };

    this.formatPriceDates = function(itemData) {
      for (var priceIndex in itemData.prices) {
        var price = itemData.prices[priceIndex];
        price.startDate = dateUtility.formatDateForApp(price.startDate);
        price.endDate = dateUtility.formatDateForApp(price.endDate);
        this.updatePriceGroup(priceIndex);
        this.formatStationExceptionDates(price);
      }
    };

    this.formatStationExceptionDates = function(price) {
      for (var stationExceptionIndex in price.stationExceptions) {
        var stationException = price.stationExceptions[stationExceptionIndex];
        stationException.startDate = dateUtility.formatDateForApp(stationException.startDate);
        stationException.endDate = dateUtility.formatDateForApp(stationException.endDate);
      }
    };

    this.checkIfItemIsActive = function(itemData) {
      var today = new Date();
      var itemStartDate = new Date(itemData.startDate);
      $scope.itemIsActive = itemStartDate <= today && !$scope.cloningItem;
    };

    // checks to see if the item is inactive, and set viewOnly=true if item is inactive
    this.checkIfItemIsInactive = function(itemData) {
      var today = new Date();
      var itemEndDate = new Date(itemData.endDate);
      $scope.itemIsInactive = itemEndDate <= today && !$scope.cloningItem;
      $scope.viewOnly = $scope.viewOnly || $scope.itemIsInactive;
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
      this.formatImageDates(itemData.images);
      this.formatPriceDates(itemData);
      $scope.formData = angular.copy(itemData);

      $scope.originalMasterItemData = {
        itemCode: $scope.formData.itemCode,
        itemName: $scope.formData.itemName,
        onBoardName: $scope.formData.onBoardName
      };
      delete $scope.formData.voucher;
      this.setVoucherData();
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

    this.setUIReady = function() {
      $scope.minDate = $this.determineMinDate();
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
      this.watchItemInfoOnClonePage();
    };

    this.determineMinDate = function() {
      var diff = 1;
      if ($scope.editingItem) {
        diff = dateUtility.diff(
          dateUtility.nowFormatted(),
          $scope.formData.startDate
        );
      }
      var dateString = diff.toString() + 'd';
      if (diff >= 0) {
        dateString = '+' + dateString;
      }
      return dateString;
    };

    this.watchItemInfoOnClonePage = function() {
      $scope.$watchGroup(['formData.itemCode', 'formData.itemName', 'formData.onBoardName'], function() {
        if ($scope.cloningItem && $this.isMasterItemInfoDirty()) {
          $scope.displayCloneInfo = true;
        } else {
          $scope.displayCloneInfo = false;
        }
      });
    };

    $scope.$watchGroup(['formData.startDate', 'formData.endDate'], function() {
      if ($scope.formData.startDate && $scope.formData.endDate) {
        itemsFactory.getDiscountList({
          discountTypeId: 4,
          startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
          endDate: dateUtility.formatDateForAPI($scope.formData.endDate)
        }).then($this.setDiscountList);
      }
    });

    this.isMasterItemInfoDirty = function() {
      if ($scope.originalMasterItemData.itemCode === $scope.formData.itemCode &&
        $scope.originalMasterItemData.itemName === $scope.formData.itemName &&
        $scope.originalMasterItemData.onBoardName === $scope.formData.onBoardName) {
        return false;
      } else {
        return true;
      }
    };

    this.setDiscountList = function(dataFromAPI) {
      $scope.discountList = angular.copy(dataFromAPI.companyDiscounts);
      $this.setVoucherData();
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
      $this.setItemList(response[11].retailItems);
      if ($scope.editingItem || $scope.cloningItem || $scope.viewOnly) {
        this.getItem($routeParams.id);
      } else {
        $this.setUIReady();
      }
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Items data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
      });
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
      $scope.filteredCharacteristics = data;
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

    this.removeCurrentItem = function(itemList) {
      if ($routeParams.id) {
        angular.forEach(itemList, function(value, key) {
          if (parseInt(value.id) === parseInt($routeParams.id)) {
            itemList.splice(key, 1);
          }
        });
      }
      return itemList;
    };

    this.setItemList = function(itemListFromAPI) {
      var itemList = this.removeCurrentItem(angular.copy(itemListFromAPI));
      $scope.items = itemList;
      $scope.substitutions = itemList;
      $scope.recommendations = itemList;
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

    this.formatStationExceptionPayloadDates = function(itemData, priceIndex) {
      for (var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {
        var station = itemData.prices[priceIndex].stationExceptions[stationExceptionIndex];
        station.startDate = dateUtility.formatDateForAPI(station.startDate);
        station.endDate = dateUtility.formatDateForAPI(station.endDate);
      }
    };

    this.formatPricePayloadDates = function(itemData) {
      for (var priceIndex in itemData.prices) {
        var price = itemData.prices[priceIndex];
        price.startDate = dateUtility.formatDateForAPI(price.startDate);
        price.endDate = dateUtility.formatDateForAPI(price.endDate);
        this.formatStationExceptionPayloadDates(itemData, priceIndex);
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
          var currency = itemData.prices[priceIndex].priceCurrencies[currencyIndex];
          delete currency.code;
        }
        for (var stationExceptionIndex in itemData.prices[priceIndex].stationExceptions) {
          var stationException = itemData.prices[priceIndex].stationExceptions[stationExceptionIndex];
          delete stationException.stations;
        }
      }
    };

    $scope.filterCharacteristics = function() {
      if ($scope.formData.itemTypeId && $scope.itemTypes[$scope.formData.itemTypeId - 1].name === 'Virtual') {
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

    $scope.$watch('form.$valid', function(validity) {
      if (validity) {
        $scope.displayError = false;
      }
    });

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
      $scope.formData.prices[priceIndex].stationExceptions.splice(key, 1);
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
      var stationExceptionCurrencies = this.generateStationCurrenciesList(data.response);
      stationException.stationExceptionCurrencies = stationExceptionCurrencies;
    };

    // generate a list of station exception currencies
    this.generateStationCurrenciesList = function(currenciesList) {
      var listToReturn = [];
      for (var key in currenciesList) {
        var currency = currenciesList[key];
        listToReturn.push({
          price: null,
          companyCurrencyId: parseInt(currency.id)
        });
      }
      return listToReturn;
    };

    // Updates the station exception with stations list and currencies list
    this.updateStationException = function(priceIndex, stationExceptionIndex) {
      var $this = this;
      var stationException = $scope.formData.prices[priceIndex].stationExceptions[stationExceptionIndex];
      this.getGlobalStationList(stationException).then(function(data) {
        $this.setStationsList(stationException, data);
      });
      this.getStationsCurrenciesList(stationException).then(function(data) {
        $this.setStationsCurrenciesList(stationException, data);
      });
    };

    // reaches out to the stations API per each station exception and update set stations list
    this.updateStationsList = function() {
      var stationPromises = [];
      for (var priceIndex in $scope.formData.prices) {
        var price = $scope.formData.prices[priceIndex];
        for (var stationExceptionIndex in price.stationExceptions) {
          var stationException = price.stationExceptions[stationExceptionIndex];
          stationPromises.push(this.getGlobalStationList(stationException));
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
          if (stationException) {
            $this.setStationsList(stationException, data[key]);
          }
        }
      });
    };

    /*
     * Price Groups
     *
     */

    $scope.$watch('formData.prices', function(newData, oldData) {
      $this.watchPriceGroups(newData, oldData);
    }, true);

    $scope.$watch('formData.itemTypeId', function(selectedItemType) {
      $scope.isVoucherSelected = (parseInt(selectedItemType) === 3);
    }, true);

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

    this.generateCurrency = function(currency) {
      return {
        price: '1.00',
        companyCurrencyId: currency.id,
        code: currency.code
      };
    };

    this.generatePriceCurrenciesList = function(priceIndex, currenciesList) {
      if (angular.isUndefined(priceIndex)) {
        return false;
      }
      var priceCurrencies = [];
      for (var key in currenciesList) {
        var newCurrency = this.generateCurrency(currenciesList[key]);
        var priceGroup = $scope.formData.prices[priceIndex];
        var existingCurrency = priceGroup.priceCurrencies[key];
        if (existingCurrency) {
          newCurrency.price = existingCurrency.price;
        }
        priceCurrencies.push(newCurrency);
      }
      return priceCurrencies;
    };

    this.getPriceCurrenciesList = function(priceIndex, currencyFilters) {
      currencyFactory.getCompanyCurrencies(currencyFilters).then(function(data) {
        var priceCurrencies = $this.generatePriceCurrenciesList(priceIndex, data.response);
        $this.setPriceCurrenciesList(priceIndex, priceCurrencies);
      });
    };

    this.setPriceCurrenciesList = function(priceIndex, priceCurrencies) {
      $scope.formData.prices[priceIndex].priceCurrencies = priceCurrencies;
    };

    this.updatePriceGroup = function(priceIndex) {
      var priceGroup = $scope.formData.prices[priceIndex];
      var startDate = dateUtility.formatDateForAPI(priceGroup.startDate);
      var endDate = dateUtility.formatDateForAPI(priceGroup.endDate);
      if (startDate === 'Invalid date' || endDate === 'Invalid date') {
        return false;
      }
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      this.getPriceCurrenciesList(priceIndex, currencyFilters);
    };

    this.watchPriceGroups = function(newPrices, oldPrices) {
      if (!oldPrices) {
        return false;
      }
      for (var priceIndex in $scope.formData.prices) {
        this.checkPriceGroup(newPrices, oldPrices, priceIndex);
        for (var stationExceptionIndex in $scope.formData.prices[priceIndex].stationExceptions) {
          this.checkStationException(newPrices, oldPrices, priceIndex, stationExceptionIndex);
        }
      }
    };

    this.checkPriceGroup = function(newPrices, oldPrices, priceIndex) {
      var newPriceGroup = newPrices[priceIndex];
      var oldPriceGroup = oldPrices[priceIndex];
      if (!oldPriceGroup) {
        return false;
      }
      if (newPriceGroup.startDate !== oldPriceGroup.startDate || newPriceGroup.endDate !== oldPriceGroup.endDate) {
        $this.updatePriceGroup(priceIndex);
      }
    };

    this.stationExceptionExist = function(newPrice, oldPrice) {
      if (!newPrice || !oldPrice) {
        return false;
      }
      if (newPrice.stationExceptions && oldPrice.stationExceptions) {
        return true;
      }
      return false;
    };

    this.stationsAreEmpty = function(newStationException, oldStationException) {
      return (!oldStationException || !newStationException.startDate || !newStationException.endDate);
    };

    this.stationExceptionDatesAreValid = function(newPrice, oldPrice, stationExceptionIndex) {
      var newStationException = newPrice.stationExceptions[stationExceptionIndex];
      var oldStationException = oldPrice.stationExceptions[stationExceptionIndex];
      if ($this.stationsAreEmpty(newStationException, oldStationException)) {
        return false;
      }
      if (newStationException.startDate !== oldStationException.startDate || newStationException.endDate !==
        oldStationException.endDate) {
        return true;
      }
      return false;
    };

    this.isStationExceptionValid = function(newPrice, oldPrice, stationExceptionIndex) {
      if (this.stationExceptionExist(newPrice, oldPrice)) {
        return this.stationExceptionDatesAreValid(newPrice, oldPrice, stationExceptionIndex);
      }
      return false;
    };

    this.checkStationException = function(newPrices, oldPrices, priceIndex, stationExceptionIndex) {
      var newPrice = newPrices[priceIndex];
      var oldPrice = oldPrices[priceIndex];
      if (this.isStationExceptionValid(newPrice, oldPrice, stationExceptionIndex)) {
        this.updateStationException(priceIndex, stationExceptionIndex);
      }
    };

    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.updateItem = function(itemData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text('We are updating your item');
      var updateItemPayload = {
        retailItem: itemData
      };
      itemsFactory.updateItem($routeParams.id, updateItemPayload).then(function(response) {
        $this.updateFormData(response.retailItem);
        angular.element('#loading').modal('hide');
        angular.element('#update-success').modal('show');
      }, $this.errorHandler);
    };

    this.createItem = function(itemData) {
      angular.element('#loading').modal('show').find('p').text('We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload).then(function() {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
        return true;
      }, $this.errorHandler);
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
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    };

    this.formatVoucherData = function(itemData) {
      if (itemData.shouldUseDynamicBarcode) {
        itemData.isDynamicBarcodes = itemData.shouldUseDynamicBarcode.value;
      }

      if (itemData.voucher) {
        itemData.companyDiscountId = itemData.voucher.id;
        delete itemData.voucher;
      }
      delete itemData.shouldUseDynamicBarcode;
    };

    this.formatPayload = function(itemData) {
      itemData.tags = $this.formatTags(itemData);
      itemData.allergens = $this.formatAllergens(itemData);
      itemData.characteristics = $this.formatCharacteristics(itemData);
      itemData.substitutions = $this.formatSubstitutions(itemData);
      itemData.recommendations = $this.formatRecommendations(itemData);
      this.formatVoucherData(itemData);
      this.formatPayloadDates(itemData);
      this.formatPrices(itemData);
      this.formatImages(itemData);
      this.formatGlobalTradeNumbers(itemData);
      this.formatTaxes(itemData);
      this.cleanUpPayload(itemData);
      if ($scope.cloningItem) {
        delete itemData.id;
      }
      return itemData;
    };

    $scope.isMeasurementRequired = function() {
      return ($scope.formData.width || $scope.formData.length || $scope.formData.height);
    };

    $scope.isMeasurementValid = function() {
      return ($scope.formData && $scope.formData.length && $scope.formData.height && $scope.formData.dimensionType);
    };

    $scope.isQrCodeSet = function() {
      return ($scope.formData && $scope.formData.qrCodeImgUrl);
    };

    $scope.isQrCreateHidden = function() {
      var isQrCodeSet = $scope.isQrCodeSet();
      return ($scope.viewOnly || $scope.itemIsActive || isQrCodeSet);
    };

    $scope.isDisabled = function() {
      return ($scope.viewOnly || $scope.itemIsActive);
    };

    $scope.GTINClass = function(form, key) {
      if (form['GTIN' + key].$dirty && form['GTIN' + key].$invalid) {
        return 'has-error';
      }
      return 'has-success';
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

    $scope.setSelected = function(model, id) {
      model = parseInt(model);
      id = parseInt(id);
      return (model === id);
    };

  });
