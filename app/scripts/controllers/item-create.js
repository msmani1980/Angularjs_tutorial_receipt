'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('ItemCreateCtrl',
  function($scope, $document, $compile, ENV, $resource, $location, $anchorScroll, itemsFactory, companiesFactory, companyRelationshipFactory,
    currencyFactory, $routeParams, globalMenuService, $q, dateUtility, $filter, lodash, _, languagesService, recordsService, countriesService,
    companyPreferencesService) {

    var $this = this;
    $scope.formData = {
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
      },
      notesTranslations: [],
      voucherDurationId: null
    };

    $scope.allCountriesDefaultValue = {
      countryCode: 'All Countries',
      countryName: 'All Countries',
      id: null
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
    $scope.substitutionsForDateRangeAreEmpty = false;
    $scope.recommendationsForDateRangeAreEmpty = false;
    $scope.itemsAreBeingLoaded = true;
    $scope.isDependecyItemSet = false;
    $scope.dynamicStaticBarcodeOptions = [{
      label: 'Dynamic Barcode',
      value: true
    }, {
      label: 'GTIN',
      value: false
    }];
    $scope.companyEposLanguages = [];
    $scope.voucherDurationsFromServer = [];
    $scope.voucherDurationOptions = [
      { duration: 30, name: '30 days' },
      { duration: 60, name: '60 days' },
      { duration: 90, name: '90 days' },
      { duration: 365, name: '1 year' }
    ];
    $scope.supplierCompanies = [];
    $scope.selectedSupplierCompanyImages = null;
    $scope.substitutions = [];
    $scope.recommendations = [];
    $scope.eposDisplayOrderList = [];
    $scope.allergenTags = [];
    $scope.allergenPrefixes = [
      { prefix: 'contains', name: 'Contains' },
      { prefix: 'may_contain', name: 'May contain' }
    ];
    $scope.countryPriceExceptionErrors = {};

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/item-edit') !== -1 && $routeParams.id) {
        $scope.editingItem = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/item-copy') !== -1 && $routeParams.id) {
        $scope.cloningItem = true;
      } else if (path.search('/item-view') !== -1) {
        $scope.viewOnly = true;
      } else if (path.search('/item-create') !== -1) {
        $scope.creatingItem = true;
        $scope.formData.startDate = dateUtility.tomorrowFormattedDatePicker();
        $scope.formData.endDate = dateUtility.tomorrowFormattedDatePicker();
        $scope.isDependecyItemSet = true;
      }
    };

    this.init = function() {
      $this.checkFormState();
      $this.getDependencies();
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
      var companyId = globalMenuService.company.get();
      return data.retailItem.companyId === companyId;
    };

    this.filterDuplicateInItemTags = function() {
      $scope.filterSelectedTags = _.differenceWith(
        $scope.tags,
        $scope.formData.tags,
        function(a, b) {
          return a.id === b.id;
        }
      );
    };

    $scope.onTagsChange = function() {
      $this.filterDuplicateInItemTags();
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

    this.getItemSuccess = function(data) {
      if ($this.validateItemCompany(data)) {
        $this.updateFormData(data.retailItem);
        $this.updateViewName(data.retailItem);
        $this.setUIReady();
        $this.filterDuplicateInItemTags();
        $this.checkIfSupplierCompanyExpired();
        $scope.isDependecyItemSet = true;
        return;
      }

      return $location.path('/');
    };

    this.getItem = function(id) {
      this.showLoadingModal('We are getting your Items data!');
      itemsFactory.getItem(id).then($this.getItemSuccess, $this.errorHandler);
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

    this.deserializeItemAllergens = function(itemData) {
      var formData = angular.copy(itemData);
      $scope.existingAllergenIds = {};

      formData.itemAllergens.forEach(function(itemAllergen) {
        $scope.existingAllergenIds[itemAllergen.allergen.id] = itemAllergen.id;
      });

      // jshint ignore: start
      // jscs:disable
      itemData.itemAllergens = {
        contains: [],
        may_contain: []
      };
      // jshint ignore: end
      // jscs:enable

      formData.itemAllergens.forEach(function (allergen) {
        itemData.itemAllergens[allergen.allergenPrefix].push(allergen.allergen);
      });
    };

    this.deserializeItemAllergenTags = function(itemData) {
      var formData = angular.copy(itemData);
      $scope.existingAllergenTagIds = {};

      formData.itemAllergenTags.forEach(function(itemAllergenTag) {
        $scope.existingAllergenTagIds[itemAllergenTag.allergenTag.id] = itemAllergenTag.id;
      });

      itemData.itemAllergenTags = [];

      formData.itemAllergenTags.forEach(function (allergenTag) {
        itemData.itemAllergenTags.push(allergenTag.allergenTag);
      });
    };

    // jshint ignore: start
    // jscs:disable
    this.formatItemAllergens = function(itemData) {
      var allergenPayload = [];
      for (var allergenKey in itemData.itemAllergens) {
        var allergens = itemData.itemAllergens[allergenKey];

        allergens.forEach(function (allergen) {
          var allergenPayloadItem = {
            allergen: {
              id: allergen.allergenId
            },
            allergenPrefix: allergenKey
          };

          if ($scope.editingItem) {
            allergenPayloadItem.id = $scope.existingAllergenIds[allergen.id];
          }

          allergenPayload.push(allergenPayloadItem);
        });
      }

      return allergenPayload;
    };
    // jshint ignore: end
    // jscs:enable

    this.formatItemAllergenTags = function(itemData) {
      if (!itemData.itemAllergenTags) {
        return [];
      }

      return itemData.itemAllergenTags.map(function (tag) {
        var allergenTagPayload = {
          allergenTag: {
            id: tag.id
          }
        };

        if ($scope.editingItem) {
          allergenTagPayload.id = $scope.existingAllergenTagIds[tag.id];
        }

        return allergenTagPayload;
      });
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
          for (var currencyKey in price.priceCurrencies) {
            var currency = price.priceCurrencies[currencyKey];
            delete currency.id;
          }
        }

        $this.formatStationExceptions(price);
        $this.formatPriceCountryExceptions(price);
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

    this.formatPriceCountryExceptions = function(priceData) {
      for (var exceptionKey in priceData.priceCountryExceptions) {
        const exception = priceData.priceCountryExceptions[exceptionKey];
        if ($scope.cloningItem) {
          delete exception.id;
          for (var currencyKey in exception.priceCountryExceptionCurrencies) {
            const currency = exception.priceCountryExceptionCurrencies[currencyKey];
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

    this.findItemIndexById = function(itemId) {
      var itemIndex = null;
      for (var key in $scope.items) {
        var itemMatch = $scope.items[key];
        if (parseInt(itemMatch.itemMasterId) === parseInt(itemId)) {
          itemIndex = key;
          break;
        }
      }

      return itemIndex;
    };

    $scope.deserializeSubstitutionsAfterItemSet = function() {
      if (angular.isUndefined($scope.formData.substitutions)) {
        return;
      }

      for (var substitutionKey in $scope.formData.substitutions) {
        var substitution = $scope.formData.substitutions[substitutionKey];
        var substitutionId = angular.isDefined(substitution.itemMasterId) ? substitution.itemMasterId : substitution;
        var index = $this.findItemIndexById(substitutionId);
        $scope.formData.substitutions[substitutionKey] = {
          itemMasterId: substitutionId,
          itemName: (index !== null) ? $scope.items[index].itemName : ''
        };
      }
    };

    $scope.deserializeRecommendationsAfterItemSet = function() {
      if (angular.isUndefined($scope.formData.recommendations)) {
        return;
      }

      for (var recommendationKey in $scope.formData.recommendations) {
        var recommendation = $scope.formData.recommendations[recommendationKey];
        var recommendationId = angular.isDefined(recommendation.itemMasterId) ? recommendation.itemMasterId : recommendation;
        var index = $this.findItemIndexById(recommendationId);
        $scope.formData.recommendations[recommendationKey] = {
          itemMasterId: recommendationId,
          itemName: (index !== null) ? $scope.items[index].itemName : ''
        };
      }
    };

    this.formatSubstitutions = function(itemData) {
      var substitutionsPayload = [];
      for (var substitutionKey in itemData.substitutions) {
        var substitution = itemData.substitutions[substitutionKey];
        substitutionsPayload[substitutionKey] = substitution.itemMasterId;
      }

      return substitutionsPayload;
    };

    this.formatRecommendations = function(itemData) {
      var recommendationPayload = [];
      for (var recommendationKey in itemData.recommendations) {
        var recommendation = itemData.recommendations[recommendationKey];
        recommendationPayload[recommendationKey] = recommendation.itemMasterId;
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
        this.formatPriceCountryExceptionDates(price);
      }
    };

    this.formatStationExceptionDates = function(price) {
      for (var stationExceptionIndex in price.stationExceptions) {
        var stationException = price.stationExceptions[stationExceptionIndex];
        stationException.startDate = dateUtility.formatDateForApp(stationException.startDate);
        stationException.endDate = dateUtility.formatDateForApp(stationException.endDate);
      }
    };

    this.formatPriceCountryExceptionDates = function(price) {
      for (var exceptionIndex in price.priceCountryExceptions) {
        const exception = price.priceCountryExceptions[exceptionIndex];
        exception.startDate = dateUtility.formatDateForApp(exception.startDate);
        exception.endDate = dateUtility.formatDateForApp(exception.endDate);
      }
    };

    this.checkIfItemIsActive = function(itemData) {
      $scope.itemIsActive = dateUtility.isTodayOrEarlierDatePicker(itemData.startDate) && !$scope.cloningItem;
    };

    // checks to see if the item is inactive, and set viewOnly=true if item is inactive
    this.checkIfItemIsInactive = function(itemData) {
      $scope.itemIsInactive = dateUtility.isYesterdayOrEarlierDatePicker(itemData.endDate) && !$scope.cloningItem;
      $scope.viewOnly = $scope.viewOnly || $scope.itemIsInactive;
    };

    $scope.isDisabledEndDateForm = function() {
      return $scope.viewOnly || (dateUtility.isYesterdayOrEarlierDatePicker($scope.formData.endDate) && !$scope.cloningItem);
    };

    this.updateLanguages = function () {
      languagesService.getLanguagesList().then(function (dataFromAPI) {
        $this.setLanguages(dataFromAPI);
        $this.setFormDataDefaultLanguage();
      });
    };

    this.setFormDataNotesTranslations = function () {
      var mappedNotes = [];
      $scope.formData.rawNotesTranslations = $scope.formData.notesTranslations;
      $scope.formData.notesTranslations.forEach(function (notes) {
        mappedNotes[notes.languageId] = notes.notes;
      });

      $scope.formData.notesTranslations = mappedNotes;
    };

    this.setInitialSubstitutionAndRecomendations = function (itemListFromAPI) {
      $scope.items = [];
      if (itemListFromAPI.retailItems) {
        $scope.items = angular.copy(itemListFromAPI.retailItems);
      }

      $scope.substitutions = angular.copy($scope.items);
      $scope.recommendations = angular.copy($scope.items);

      $scope.deserializeSubstitutionsAfterItemSet();
      $scope.deserializeRecommendationsAfterItemSet();

      if ($scope.items.length === 0) {
        $scope.substitutionsForDateRangeAreEmpty = true;
        $scope.recommendationsForDateRangeAreEmpty = true;
      } else {
        $scope.substitutionsForDateRangeAreEmpty = false;
        $scope.recommendationsForDateRangeAreEmpty = false;
      }

      $scope.itemsAreBeingLoaded = false;
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
      this.deserializeItemAllergens(itemData);
      this.deserializeItemAllergenTags(itemData);
      this.deserializeCharacteristics(itemData);
      this.formatImageDates(itemData.images);

      itemData.prices = _.orderBy(itemData.prices, ['code'], ['asc']);

      this.formatPriceDates(itemData);
      $scope.formData = angular.copy(itemData);

      if ($scope.formData.vatCountryId) {
        $scope.formData.vatCountry = lodash.find($scope.countries, { id: $scope.formData.vatCountryId });
      }

      $scope.voucherDurationId = itemData.voucherDurationId;

      $scope.originalMasterItemData = {
        itemCode: $scope.formData.itemCode,
        itemName: $scope.formData.itemName,
        onBoardName: $scope.formData.onBoardName,
        eposDisplaySortOrder: $scope.formData.eposDisplaySortOrder
      };
      delete $scope.formData.voucher;
      this.setVoucherData();
      this.updateStationsList();
      this.setFormDataDefaultLanguage();
      this.setFormDataNotesTranslations();
      this.assignItemCharacteristicsRelatedFields();
    };

    this.assignItemCharacteristicsRelatedFields = function() {
      angular.forEach($scope.formData.characteristics, function(value) {
        if (value.name === 'Downloadable') {
          $scope.shouldDisplayURLField = true;
        }
      });

      $this.filterDuplicateInItemCharacteristicsMultiChoice();
    };

    this.filterDuplicateInItemCharacteristicsMultiChoice = function() {
      if ($scope.formData.itemTypeId !== 'undefined' || $scope.formData.itemTypeId !== '' || $scope.formData.itemTypeId !== null) {
        $scope.filteredCharacteristics = _.differenceWith(
          $scope.itemCharacteristicsPerItemType[$scope.formData.itemTypeId],
          $scope.formData.characteristics,
          function(a, b) {
            return a.id === b.id;
          }
        );
      }
    };

    this.makeDependencyPromises = function() {
      var companyId = globalMenuService.company.get();
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
        companiesFactory.getCompany(companyId),
        itemsFactory.getVoucherDurationsList(),
        itemsFactory.getEposDisplayOrder(),
        recordsService.getAllergenTags(),
        countriesService.getCountriesList(),
        companyPreferencesService.getCompanyPreferences({
          startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
          optionCode: 'SAT',
          featureCode: 'ITM'
        })
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
      if ($scope.editingItem && !dateUtility.isTomorrowOrLaterDatePicker($scope.formData.startDate)) {
        diff = dateUtility.diff(
          dateUtility.nowFormattedDatePicker(),
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
        if ($scope.cloningItem && !$this.isMasterItemInfoUnTouched()) {
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

        var relationshipPayload = {
          startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
          endDate: dateUtility.formatDateForAPI($scope.formData.endDate)
        };

        companyRelationshipFactory.getCompanyRelationshipListByCompany(globalMenuService.company.get(), relationshipPayload).then($this.setSupplierCompanies);

        $this.handleRetailItemsOnStartEndDateUpdate();
      } else {
        $scope.items = [];
        $scope.substitutions = [];
        $scope.recommendations = [];
      }
    });

    $scope.areDatesSelected = function () {
      return ($scope.formData.startDate && $scope.formData.endDate);
    };

    $scope.isAllergenAvailable = function (allergen) {
      var isSelected = false;

      $scope.allergenPrefixes.forEach(function (prefix) {
        if ($scope.formData.itemAllergens && $scope.formData.itemAllergens[prefix.prefix] && !isSelected) {
          isSelected = lodash.find($scope.formData.itemAllergens[prefix.prefix], { allergenId: allergen.allergenId });
        }
      });

      return !isSelected;
    };

    this.handleRetailItemsOnStartEndDateUpdate = function() {
      $scope.itemsAreBeingLoaded = true;
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.endDate),
        ignoreDryStrore: true
      };

      itemsFactory.getItemsList(payload).then($this.setInitialSubstitutionAndRecomendations);
    };

    this.isMasterItemInfoUnTouched = function() {
      return $scope.originalMasterItemData.itemCode === $scope.formData.itemCode &&
        $scope.originalMasterItemData.itemName === $scope.formData.itemName &&
        $scope.originalMasterItemData.onBoardName === $scope.formData.onBoardName;
    };

    this.setDiscountList = function(dataFromAPI) {
      $scope.discountList = angular.copy(dataFromAPI.companyDiscounts);
      $this.setVoucherData();
    };

    this.findDefaultLanguage = function () {
      return lodash.findWhere($scope.languages, { id: $scope.company.defaultEposLanguage });
    };

    this.setFormDataDefaultLanguage = function () {
      $scope.formData.selectedVoucherNotesLanguage = $this.findDefaultLanguage();
    };

    this.setLanguages = function(dataFromAPI) {
      $scope.languages = angular.copy(dataFromAPI);

      // Add default language (English)
      $scope.companyEposLanguages.push($this.findDefaultLanguage());

      // Add other languages
      $scope.company.eposLanguages.forEach(function (languageId) {
        if (languageId !== $scope.company.defaultEposLanguage) {
          $scope.companyEposLanguages.push(lodash.findWhere($scope.languages, { id: languageId }));
        }
      });
    };

    this.setCompany = function(dataFromAPI) {
      $scope.company = angular.copy(dataFromAPI);

      this.updateLanguages();
    };

    this.setSupplierCompanies = function(dataFromAPI) {
      var companies = angular.copy(dataFromAPI.companyRelationships);

      $scope.supplierCompanies = companies.filter(function(company) {
        return (company.relativeCompanyType === 'Supplier' || company.companyTypeName === 'Supplier') && company.relativeCompanyActive && company.companyActive;
      })
      .map(function (company) {
        if (company.relativeCompanyType === 'Supplier') {
          return {
            relativeCompanyId: company.relativeCompanyId,
            relativeCompany: company.relativeCompany
          };
        } else {
          return {
            relativeCompanyId: company.companyId,
            relativeCompany: company.companyName
          };
        }
      });

      $this.checkIfSupplierCompanyExpired();
    };

    this.checkIfSupplierCompanyExpired = function () {
      if ($scope.formData.supplierCompanyId) {
        var supplierFound = lodash.findWhere($scope.supplierCompanies, { relativeCompanyId: parseInt($scope.formData.supplierCompanyId) });

        if (!supplierFound) {
          companiesFactory.getCompany($scope.formData.supplierCompanyId).then($this.setExpiredSupplierCompany);
        }
      }
    };

    $scope.isSupplierCompanyExpired = function () {
      if (!$scope.formData.supplierCompanyId) {
        return false;
      }

      var supplierFound = lodash.findWhere($scope.supplierCompanies, { relativeCompanyId: parseInt($scope.formData.supplierCompanyId) });

      if (!supplierFound) {
        return true;
      } else {
        return supplierFound.expired;
      }
    };

    this.setExpiredSupplierCompany = function (dataFromAPI) {
      var expiredSupplierCompany = angular.copy(dataFromAPI);

      $scope.supplierCompanies.push({
        relativeCompanyId: expiredSupplierCompany.id,
        relativeCompany: expiredSupplierCompany.companyName,
        expired: true
      });
    };

    this.setSupplierCompanyDetails = function (dataFromAPI) {
      $scope.formData.virtualItemReceiptHeader = dataFromAPI.virtualItemReceiptHeader;
      $scope.formData.virtualItemReceiptFooter = dataFromAPI.virtualItemReceiptFooter;
    };

    $scope.onSupplierCompanyChange = function () {
      $this.checkIfSupplierCompanyExpired();

      var payload = {
        id: $scope.formData.supplierCompanyId,
        startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.endDate)
      };

      if ($scope.formData.supplierCompanyId) {
        companiesFactory.getCompanyImages(payload).then($this.setCompanyImages);
        companiesFactory.getCompany($scope.formData.supplierCompanyId).then($this.setSupplierCompanyDetails);
      }
    };

    this.setCompanyImages = function (dataFromAPI) {
      $scope.selectedSupplierCompanyImages = angular.copy(dataFromAPI.response);

      $scope.selectedSupplierCompanyImages.forEach(function (image) {
        image.startDate = dateUtility.formatDateForApp(image.startDate);
        image.endDate = dateUtility.formatDateForApp(image.endDate);
      });
    };

    $scope.showImagePreview = function (image) {
      $scope.modalImageUrl = image.imageURL;
      angular.element('#imagemodal').modal('show');
    };

    $scope.closeImagePreview = function () {
      angular.element('#imagemodal').modal('hide');
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
      $this.setCompany(response[11]);
      $this.setVoucherDurations(response[12]);
      $this.setEposDisplayOrderList(response[13]);
      $this.setAllergenTagList(response[14]);
      $this.setCountryList(response[15]);
      $this.setSATFields(response[16]);
      if ($scope.editingItem || $scope.cloningItem || $scope.viewOnly) {
        $this.getItem($routeParams.id);
      } else {
        $this.setUIReady();
      }

      $this.filterDuplicateInItemTags();
    };

    this.getDependencies = function() {

      $this.showLoadingModal('We are loading the Items data!');
      var dependencyPromises = $this.makeDependencyPromises();
      $q.all(dependencyPromises).then($this.setDependencies, $this.errorHandler);
    };

    this.setSalesCategories = function(data) {
      $scope.salesCategories = data.salesCategories;
    };

    this.setAllergens = function(data) {
      $scope.allergens = data;
    };

    this.setAllergenTagList = function(data) {
      $scope.allergenTags = data;
    };

    this.setCountryList = function(data) {
      $scope.countries = data.countries;
      $scope.countryExceptionCountries =  angular.copy(data.countries);
      $scope.countryExceptionCountries.unshift($scope.allCountriesDefaultValue);
    };

    this.setSATFields = function(data) {
      $scope.showSATFields = lodash.find(data.preferences, { isSelected: true });
    };

    this.setItemTypes = function(data) {
      $scope.itemTypes = data;
    };

    this.setVoucherDurations = function (data) {
      $scope.voucherDurations = angular.copy(data);
    };

    this.setEposDisplayOrderList = function (data) {
      $scope.eposDisplayOrderList = angular.copy(data);
    };

    this.setCharacteristics = function(data) {
      $scope.characteristics = data;
      $scope.filteredCharacteristics = [];

      $scope.itemCharacteristicsPerItemType = lodash.groupBy(data, function(ic) { return ic.itemTypeId; });
    };

    $scope.isItemCharacteristicsFieldDisabled = function() {
      return typeof $scope.formData.itemTypeId === 'undefined' || $scope.formData.itemTypeId === '' || $scope.formData.itemTypeId === null;
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
      $scope.substitutions = [];
      $scope.recommendations = [];
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

    this.formatPriceCountryExceptionPayloadDates = function(itemData, priceIndex) {
      for (var exceptionIndex in itemData.prices[priceIndex].priceCountryExceptions) {
        const exception = itemData.prices[priceIndex].priceCountryExceptions[exceptionIndex];
        exception.startDate = dateUtility.formatDateForAPI(exception.startDate);
        exception.endDate = dateUtility.formatDateForAPI(exception.endDate);
      }
    };

    this.formatPricePayloadDates = function(itemData) {
      for (var priceIndex in itemData.prices) {
        var price = itemData.prices[priceIndex];
        price.startDate = dateUtility.formatDateForAPI(price.startDate);
        price.endDate = dateUtility.formatDateForAPI(price.endDate);
        this.formatStationExceptionPayloadDates(itemData, priceIndex);
        this.formatPriceCountryExceptionPayloadDates(itemData, priceIndex);
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
      $scope.formData.linkUrl = null;
      $scope.formData.characteristics = [];
      $scope.shouldDisplayURLField = false;
      $scope.filteredCharacteristics = $scope.itemCharacteristicsPerItemType[$scope.formData.itemTypeId];
    };

    $scope.onCharacteristicsChange = function() {
      if ($scope.formData.characteristics.length === 0) {
        $scope.formData.linkUrl = null;
      }

      $scope.shouldDisplayURLField = false;
      angular.forEach($scope.formData.characteristics, function(value) {
        if (value.name === 'Downloadable' || value.name === 'Link') {
          $scope.shouldDisplayURLField = true;
        }
      });

      $this.filterDuplicateInItemCharacteristicsMultiChoice();
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

    // Adds a country exception collection in the form
    $scope.addCountryException = function(priceIndex) {
      $scope.formData.prices[priceIndex].priceCountryExceptions.push({
        startDate: '',
        endDate: '',
        priceCountryExceptionCurrencies: []
      });
    };

    // Removes a station exception collection from the form
    $scope.removeStationException = function(priceIndex, key) {
      $scope.formData.prices[priceIndex].stationExceptions.splice(key, 1);
    };

    // Removes a country exception collection from the form
    $scope.removeCountryException = function(priceIndex, key) {
      $scope.formData.prices[priceIndex].priceCountryExceptions.splice(key, 1);
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

    // generate a list of station exception currencies
    this.generateStationCurrenciesList = function(stationException, currenciesList) {
      var listToReturn = [];

      angular.forEach(currenciesList, function (currency) {
        var newCurrency = $this.generateCurrency(currency);
        var existingCurrency = lodash.findWhere(stationException.stationExceptionCurrencies, { companyCurrencyId: newCurrency.companyCurrencyId });
        newCurrency.id = (existingCurrency) ? existingCurrency.id : newCurrency.id;
        newCurrency.price = (existingCurrency) ? existingCurrency.price : newCurrency.price;
        listToReturn.push(newCurrency);
      });

      return listToReturn;
    };

    // generate a list of station exception currencies
    this.generatePriceCountryCurrenciesList = function(countryException, currenciesList) {
      const listToReturn = [];

      angular.forEach(currenciesList, function (currency) {
        const newCurrency = $this.generateCurrency(currency);
        const existingCurrency = lodash.findWhere(countryException.priceCountryExceptionCurrencies, { companyCurrencyId: newCurrency.companyCurrencyId });
        newCurrency.id = (existingCurrency) ? existingCurrency.id : newCurrency.id;
        newCurrency.price = (existingCurrency) ? existingCurrency.price : newCurrency.price;
        listToReturn.push(newCurrency);
      });

      return listToReturn;
    };

    // sets the stations currenies list
    this.setStationsCurrenciesList = function(stationException, data) {
      var stationExceptionCurrencies = this.generateStationCurrenciesList(stationException, data.response);
      stationException.stationExceptionCurrencies = stationExceptionCurrencies;
    };

    this.setCountryExceptionCurrenciesList = function(countryException, data) {
      const countryExceptionCurrencies = this.generatePriceCountryCurrenciesList(countryException, data.response);
      countryException.priceCountryExceptionCurrencies = countryExceptionCurrencies;
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

    // Updates the country exception with currencies list
    this.updateCountryException = function(priceIndex, countryExceptionIndex) {
      const $this = this;
      const countryException = $scope.formData.prices[priceIndex].priceCountryExceptions[countryExceptionIndex];

      this.getStationsCurrenciesList(countryException).then(function(data) {
        $this.setCountryExceptionCurrenciesList(countryException, data);
      });
    };

    // reaches out to the stations API per each station exception and update set stations list
    this.updateStationsList = function() {
      var stationPromises = [];
      for (var priceIndex in $scope.formData.prices) {
        var price = $scope.formData.prices[priceIndex];
        for (var stationExceptionIndex in price.stationExceptions) {
          var stationException = price.stationExceptions[stationExceptionIndex];
          stationException.tempStationId = stationException.stationId;
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
          stationException.stationId = stationException.tempStationId;
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
      $scope.isVirtualSelected = (parseInt(selectedItemType) === 2);
    }, true);

    $scope.addPriceGroup = function() {
      $scope.formData.prices.push({
        startDate: '',
        endDate: '',
        priceCurrencies: [],
        stationExceptions: [],
        priceCountryExceptions: []
      });
    };

    // Add the first price group
    $scope.addPriceGroup();

    $scope.removePriceGroup = function(key) {
      $scope.formData.prices.splice(key, 1);
    };

    $scope.saveWithSortNumberInUse = function() {
      angular.element('#confirmation-modal').modal('hide');
      var action = $scope.editingItem ? 'updateItem' : 'createItem';
      var payload = $scope.mypayload;
      $this[action](payload);
    };

    this.generateCurrency = function(currency) {
      return {
        price: '',
        companyCurrencyId: currency.id,
        code: currency.code
      };
    };

    this.generatePriceCurrenciesList = function(priceIndex, currenciesList) {
      if (angular.isUndefined(priceIndex)) {
        return false;
      }

      var priceCurrencies = [];
      var priceGroup = $scope.formData.prices[priceIndex];

      angular.forEach(currenciesList, function (currency) {
        var newCurrency = $this.generateCurrency(currency);
        var existingCurrency = lodash.findWhere(priceGroup.priceCurrencies, { companyCurrencyId: newCurrency.companyCurrencyId });
        newCurrency.id = (existingCurrency) ? existingCurrency.id : newCurrency.id;
        newCurrency.price = (existingCurrency) ? existingCurrency.price : newCurrency.price;
        priceCurrencies.push(newCurrency);
      });

      var uniqueCurrencies = lodash.uniq(priceCurrencies, function (e) {
        return e.companyCurrencyId;
      });

      return uniqueCurrencies;
    };

    this.getPriceCurrenciesList = function(priceIndex, currencyFilters) {
      currencyFactory.getCompanyCurrencies(currencyFilters).then(function(data) {
        var priceCurrencies = $this.generatePriceCurrenciesList(priceIndex, data.response);
        $this.setPriceCurrenciesList(priceIndex, priceCurrencies);
      });
    };

    this.setPriceCurrenciesList = function(priceIndex, priceCurrencies) {
      priceCurrencies = _.orderBy(priceCurrencies, ['code'], ['asc']);

      $scope.formData.prices[priceIndex].priceCurrencies = priceCurrencies;
    };

    this.updatePriceGroup = function(priceIndex) {
      var priceGroup = $scope.formData.prices[priceIndex];
      if (!priceGroup) {
        return false;
      }

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

        for (var countryExceptionIndex in $scope.formData.prices[priceIndex].priceCountryExceptions) {
          this.checkCountryException(newPrices, oldPrices, priceIndex, countryExceptionIndex);
        }

      }
    };

    this.checkPriceGroup = function(newPrices, oldPrices, priceIndex) {
      var newPriceGroup = newPrices[priceIndex];
      var oldPriceGroup = oldPrices[priceIndex];

      if ((oldPriceGroup && (newPriceGroup.startDate !== oldPriceGroup.startDate || newPriceGroup.endDate !== oldPriceGroup.endDate)) || !oldPriceGroup) {
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

    this.countryExceptionExist = function(newPrice, oldPrice) {
      if (!newPrice || !oldPrice) {
        return false;
      }

      if (newPrice.priceCountryExceptions && oldPrice.priceCountryExceptions) {
        return true;
      }

      return false;
    };

    this.stationsAreEmpty = function(newStationException, oldStationException) {
      return (!oldStationException || !newStationException.startDate || !newStationException.endDate);
    };

    this.areCountryExceptionDatesDefined = function(newCountryException, oldCountryException) {
      return (!oldCountryException || !newCountryException.startDate || !newCountryException.endDate);
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

    this.countryExceptionDatesAreValid = function(newPrice, oldPrice, countryExceptionIndex) {
      const newPriceCountryException = newPrice.priceCountryExceptions[countryExceptionIndex];
      const oldPriceCountryException = oldPrice.priceCountryExceptions[countryExceptionIndex];
      if ($this.areCountryExceptionDatesDefined(newPriceCountryException, oldPriceCountryException)) {
        return false;
      }

      if (newPriceCountryException.startDate !== oldPriceCountryException.startDate || newPriceCountryException.endDate !==
        oldPriceCountryException.endDate) {
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

    this.isCountryExceptionValid = function(newPrice, oldPrice, countryExceptionIndex) {
      if (this.countryExceptionExist(newPrice, oldPrice)) {
        return this.countryExceptionDatesAreValid(newPrice, oldPrice, countryExceptionIndex);
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

    this.checkCountryException = function(newPrices, oldPrices, priceIndex, countryExceptionIndex) {
      const newPrice = newPrices[priceIndex];
      const oldPrice = oldPrices[priceIndex];
      if (this.isCountryExceptionValid(newPrice, oldPrice, countryExceptionIndex)) {
        this.updateCountryException(priceIndex, countryExceptionIndex);
      }
    };

    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.errorHandlerSubmitForm = function(dataFromAPI) {
      $scope.errorResponse = angular.copy(dataFromAPI);
      angular.element('#loading').modal('hide');
      $this.handlePriceExceptionErrors();
      $scope.displayError = true;
    };

    this.handlePriceExceptionErrors = function() {
      $scope.countryPriceExceptionErrors = {};
      for (var errorIndex in $scope.errorResponse.data) {
        const error = $scope.errorResponse.data[errorIndex];
        if (error.field && error.field.match('price[1-9]*priceCountryException[1-9]*')) {
          const priceErrorIndex = Number(error.field.match('price[1-9]*')[0].replace('price', ''));
          const priceCountryExceptionErrorIndex = Number(error.field.match('priceCountryException[1-9]*')[0].replace('priceCountryException', ''));
          const errorFieldName = error.field.replace(error.field.match('price[1-9]*priceCountryException[1-9]*')[0], '');
          const errorDictKey = priceErrorIndex + '_' + priceCountryExceptionErrorIndex + '_' + errorFieldName;
          $scope.countryPriceExceptionErrors[errorDictKey] = true;
        }
      }
    };

    $scope.doesCountryExceptionFieldHasErrors = function(priceIndex, countryExceptionIndex, fieldName) {
      const fieldErrorKey = priceIndex + '_' + countryExceptionIndex + '_' + fieldName;
      return $scope.countryPriceExceptionErrors[fieldErrorKey];
    };

    this.updateSuccessHandler = function(response) {
      $this.updateFormData(response[0].retailItem);
      $scope.deserializeSubstitutionsAfterItemSet();
      $scope.deserializeRecommendationsAfterItemSet();
      angular.element('#loading').modal('hide').find('p').text('We are loading the Items data!');
      angular.element('#update-success').modal('show');
    };

    this.makeUpdatePromises = function(payload) {
      return [
        itemsFactory.updateItem($routeParams.id, payload)
      ];
    };

    this.removeEmptyPrices = function(itemData) {
      for (var priceIndex in itemData.prices) {
        var priceCurrencies = itemData.prices[priceIndex].priceCurrencies;
        var priceCurrencyIndex = priceCurrencies.length;
        while (priceCurrencyIndex--) {
          if (priceCurrencies[priceCurrencyIndex].price === '') {
            priceCurrencies.splice(priceCurrencyIndex, 1);
          }
        }
      }
    };

    function isTaxesValid () {
      var taxArray = $scope.formData.taxes;
      if (angular.isDefined(taxArray) && taxArray.length > 0) {
        var setTax =   new Set();
        for (var key in taxArray) {
          var companyTaxId = taxArray[key].companyTaxId;
          setTax.add(companyTaxId);
        }

        return taxArray.length === setTax.size;
      }

      return true;
    }

    function isEposDisplaySortOrderUnique (masterItemId) {
      var eposDisplaySortOrderArray = $scope.eposDisplayOrderList.response;
      if (angular.isDefined(eposDisplaySortOrderArray) && eposDisplaySortOrderArray.length > 0) {
        for (var key in eposDisplaySortOrderArray) {
          var foundItemMasterValue = eposDisplaySortOrderArray[key];
          if (masterItemId !== parseInt(foundItemMasterValue.id) && parseInt($scope.formData.eposDisplaySortOrder) === parseInt(foundItemMasterValue.eposDisplaySortOrder)) {
            return false;
          }
        }
      }

      return true;
    }

    function showCustomError(errorField, errorMessage) {
      $scope.errorCustom = [{ field: errorField, value: errorMessage }];
      $scope.displayError = true;
    }

    this.updateItem = function(itemData) {
      var isValid =	isTaxesValid();
      if (!isValid) {
        showCustomError('Tax Type', 'Must be unique');
        return;
      }

      var $this = this;
      this.showLoadingModal('We are updating your item');

      $this.removeEmptyPrices(itemData);

      var payload = {
        retailItem: itemData
      };
      var promises = $this.makeUpdatePromises(payload);
      $q.all(promises).then($this.updateSuccessHandler, $this.errorHandlerSubmitForm);
    };

    this.createItem = function(itemData) {
      var isValid =	isTaxesValid();
      if (!isValid) {
        showCustomError('Tax Type', 'Must be unique');
        return;
      }

      angular.element('#loading').modal('show').find('p').text('We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload, $scope.cloningItem).then(function() {
        angular.element('#loading').modal('hide').find('p').text('We are loading the Items data!');
        angular.element('#create-success').modal('show');
        return true;
      }, $this.errorHandlerSubmitForm);
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var itemData = angular.copy(formData);
        var payload = $this.formatPayload(itemData);
        var action = $scope.editingItem ? 'updateItem' : 'createItem';
        $scope.mypayload = payload;
        var masterItemId = -1;
        if (angular.isDefined(payload.masterItem)) {
          masterItemId = parseInt(payload.masterItem.id);
        }

        var isUnique = isEposDisplaySortOrderUnique(masterItemId);
        angular.element('#confirmation-modal').modal('hide');
        if (!isUnique) {
          angular.element('#confirmation-modal').modal('show');
          return;
        }

        $this[action](payload);
      }
    };

    this.validateForm = function() {
      $scope.countryPriceExceptionErrors = {};
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

    this.findIdFromRawNotesTranslation = function (languageId) {
      var id = null;

      $scope.formData.rawNotesTranslations.forEach(function (notesTranslation) {
        if (+notesTranslation.languageId === +languageId) {
          id = notesTranslation.id;
        }
      });

      return id;
    };

    this.formatNotesTranslations = function(itemData) {
      var notesPayload = [];

      if ($scope.isVoucherSelected) {
        for (var key in itemData.notesTranslations) {
          var notes = itemData.notesTranslations[key];
          if (notes) {
            if ($scope.formData.rawNotesTranslations) {
              var id = $this.findIdFromRawNotesTranslation(key);
              notesPayload.push({ id: id, languageId: key, notes: notes });
            } else {
              notesPayload.push({ languageId: key, notes: notes });
            }
          }
        }

        delete itemData.rawNotesTranslations;
        delete itemData.selectedVoucherNotesLanguage;
      }

      itemData.notesTranslations = notesPayload;
    };

    this.formatPayload = function(itemData) {
      itemData.tags = $this.formatTags(itemData);
      itemData.itemAllergens = $this.formatItemAllergens(itemData);
      itemData.itemAllergenTags = $this.formatItemAllergenTags(itemData);
      itemData.characteristics = $this.formatCharacteristics(itemData);
      itemData.substitutions = $this.formatSubstitutions(itemData);
      itemData.recommendations = $this.formatRecommendations(itemData);
      this.formatVoucherData(itemData);
      this.formatPayloadDates(itemData);
      this.formatPrices(itemData);
      this.formatImages(itemData);
      this.formatGlobalTradeNumbers(itemData);
      this.formatTaxes(itemData);
      this.formatNotesTranslations(itemData);
      this.cleanUpPayload(itemData);

      if (!$scope.isVoucherSelected) {
        itemData.voucherDurationId = null;
        itemData.voucherDurationName = null;
        itemData.voucherDurationDO = null;
        itemData.companyDiscountId = null;
      }

      if ($scope.cloningItem) {
        delete itemData.id;
      }

      itemData.supplierCompanyId = parseInt(itemData.supplierCompanyId);
      itemData.vatCountryId = (itemData.vatCountry) ? parseInt(itemData.vatCountry.id) : null;
      itemData.vatRate = (itemData.vatRate) ? parseFloat(itemData.vatRate) : null;

      return itemData;
    };

    $scope.isMeasurementRequired = function() {
      var isRequired = false;
      if ($scope.form) {
        if (($scope.form.Length.$$rawModelValue && $scope.form.Length.$$rawModelValue.length) ||
            ($scope.form.Width.$$rawModelValue && $scope.form.Width.$$rawModelValue.length) ||
            ($scope.form.Height.$$rawModelValue && $scope.form.Height.$$rawModelValue.length)) {
          isRequired = true;
        }
      }

      return isRequired;
    };

    $scope.isMeasurementValid = function() {
      return ($scope.formData && $scope.formData.width && $scope.formData.length && $scope.formData.height && $scope.formData.dimensionType);
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

    $scope.isAddPriceDisabled = function() {
      return $scope.viewOnly || (dateUtility.isYesterdayOrEarlierDatePicker($scope.formData.endDate) && !$scope.cloningItem);
    };

    $scope.isItemPriceNewOrIsExitingAndValidForEdit = function(itemPrice) {
      return (itemPrice.id === undefined || itemPrice.id === '' || itemPrice.id === null) || !$scope.itemIsActive;
    };

    $scope.shouldValidatePrice = function() {
      return !$scope.viewOnly && !$scope.itemIsActive;
    };

    // TODO: MOVE ME GLOBAL
    $scope.formScroll = function(id, activeBtn) {
      $scope.activeBtn = id;
      var elm = angular.element('#' + id);
      var body = angular.element('html, body');
      var topBar = angular.element('.top-header').height();
      body.animate({
        scrollTop: elm.offset().top - (topBar + 100)
      }, 'slow');
      return activeBtn;
    };

    $scope.setSelected = function(model, id) {
      model = parseInt(model);
      id = parseInt(id);
      return (model === id);
    };
  });
