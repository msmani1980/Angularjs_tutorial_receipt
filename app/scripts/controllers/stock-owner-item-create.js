'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemCreateCtrl
 * @description
 * # StockOwnerItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockOwnerItemCreateCtrl', function($scope, $compile, ENV,
    $resource, $location, $anchorScroll, itemsFactory, companiesFactory,
    currencyFactory, $routeParams, GlobalMenuService, $q, dateUtility) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    var $this = this;
    $scope.formData = {
      startDate: '',
      endDate: '',
      qrCodeValue: '',
      qrCodeImgUrl: null,
      images: [],
      tags: [],
      allergens: [],
      characteristics: [],
      substitutions: [],
      recommendations: [],
      globalTradeNumbers: [],
      costPrices: []
    };

    $scope.viewName = 'Create Stock Owner Item';
    $scope.buttonText = 'Create';
    $scope.itemIsActive = false;
    $scope.itemIsInactive = false;
    $scope.editingItem = false;
    $scope.uiSelectTemplateReady = false;

    this.init = function() {
      this.checkIfViewOnly();
      if ($routeParams.id && !$scope.viewOnly) {
        this.setFormAsEdit();
      }
      this.getDependencies();
    };

    this.checkIfViewOnly = function() {
      var path = $location.path();
      if (path.search('/stock-owner-item-view') !== -1) {
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

    this.formatImageDates = function(itemData) {
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = dateUtility.formatDateForApp(image.startDate);
        image.endDate = dateUtility.formatDateForApp(image.endDate);
      }
    };

    this.formatCostDates = function(itemData) {
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        price.startDate = dateUtility.formatDateForApp(price.startDate);
        price.endDate = dateUtility.formatDateForApp(price.endDate);
        this.updatePriceGroup(priceIndex);
      }
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
      this.formatImageDates(itemData);
      this.formatCostDates(itemData);
      $scope.formData = itemData;
    };

    this.getMasterCurrenciesList = function() {
      currencyFactory.getCompanyCurrencies(function(data) {
        var masterCurrenciesList = [];
        for (var key in data.response) {
          var currency = data.response[key];
          masterCurrenciesList[currency.id] = currency.code;
        }
        $scope.masterCurrenciesList = masterCurrenciesList;
      });
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
        itemsFactory.getItemsList({}),
        companiesFactory.getCompany(companyId)
      ];
    };

    this.setUIReady = function() {
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Items data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
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
      $this.setItemList(response[10]);
      $this.setBaseCurrencyId(response[11]);
      if ($scope.editingItem || $scope.viewOnly) {
        this.getItem($routeParams.id);
      } else {
        $this.setUIReady();
      }
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
     * Price Groups
     *
     */

    $scope.$watch('formData.costPrices', function(newData, oldData) {
      $this.watchPriceGroups(newData, oldData);
    }, true);

    $scope.addPriceGroup = function() {
      $scope.formData.costPrices.push({
        startDate: '',
        endDate: '',
        amount: '1.00'
      });
    };

    $scope.addPriceGroup();

    $scope.removePriceGroup = function(key) {
      $scope.formData.costPrices.splice(key, 1);
    };

    this.getCurrencyFromArrayUsingId = function(currenciesArray,
      baseCurrencyId) {
      return currenciesArray.filter(function(currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.setBaseCurrencyId = function(response) {
      this.baseCurrencyId = response.baseCurrencyId;
    };

    this.getCompanyGlobalCurrencies = function(priceIndex) {
      currencyFactory.getCompanyGlobalCurrencies().then(function(
        companyBaseCurrencyData) {
        $this.setPriceCurrenciesList(priceIndex,
          companyBaseCurrencyData);
      });
    };

    this.setPriceCurrenciesList = function(priceIndex,
      companyBaseCurrencyData) {
      var response = companyBaseCurrencyData.response;
      var baseCurrency = this.getCurrencyFromArrayUsingId(
        response,
        this.baseCurrencyId
      );
      $scope.formData.costPrices[priceIndex].code = baseCurrency.currencyCode;
    };

    this.updatePriceGroup = function(priceIndex) {
      var priceGroup = $scope.formData.costPrices[priceIndex];
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
      this.getCompanyGlobalCurrencies(priceIndex, currencyFilters);
    };

    this.watchPriceGroups = function(newPrices, oldPrices) {
      if (!oldPrices) {
        return false;
      }
      for (var priceIndex in $scope.formData.costPrices) {
        this.checkPriceGroup(newPrices, oldPrices, priceIndex);
      }
    };

    this.checkPriceGroup = function(newPrices, oldPrices, priceIndex) {
      var newPriceGroup = newPrices[priceIndex];
      var oldPriceGroup = oldPrices[priceIndex];
      if (!oldPriceGroup) {
        return false;
      }
      if (newPriceGroup.startDate !== oldPriceGroup.startDate ||
        newPriceGroup.endDate !== oldPriceGroup.endDate) {
        $this.updatePriceGroup(priceIndex);
      }
    };

    this.cleanUpPayload = function(itemData) {
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        delete price.code;
      }
    };

    this.formatPricePayloadDates = function(itemData) {
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        price.startDate = dateUtility.formatDateForAPI(price.startDate);
        price.endDate = dateUtility.formatDateForAPI(price.endDate);
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

    this.updateItem = function(itemData) {
      $this.showLoadingModal('We are updating your item');
      var updateItemPayload = {
        retailItem: itemData
      };
      itemsFactory.updateItem($routeParams.id, updateItemPayload).then(
        function(response) {
          $this.updateFormData(response.retailItem);
          $this.hideLoadingModal();
          angular.element('#update-success').modal('show');
        },
        function(response) {
          $this.hideLoadingModal();
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    this.createItem = function(itemData) {
      $this.showLoadingModal('We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload).then(function() {
        this.hideLoadingModal();
        angular.element('#create-success').modal('show');
        return true;
      }, function(error) {
        this.hideLoadingModal();
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
      return ($scope.formData.width || $scope.formData.length || $scope.formData
        .height);
    };

    $scope.isMeasurementValid = function() {
      return ($scope.formData.width && $scope.formData.length && $scope.formData
        .height && $scope.formData.dimensionType);
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
