'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountCreateCtrl
 * @description
 * # DiscountCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountCreateCtrl', function($scope, $q, $location, $routeParams, dateUtility, discountFactory,
    recordsService, currencyFactory, companiesFactory, itemsFactory, formValidationUtility, lodash, $filter, _) {

    var $this = this;
    $scope.validation = formValidationUtility;

    $scope.originalDiscount = null;
    $scope.viewName = 'Create Discount';
    $scope.buttonText = 'Create';
    $scope.editingDiscount = false;
    $scope.uiSelectTemplateReady = false;
    $scope.discountIsInactive = false;
    $scope.discountIsActive = false;
    $scope.viewOnly = false;
    $scope.globalDiscountTypesList = [];
    $scope.discountTypesList = [];
    $scope.companyCurrencyGlobalsList = [];
    $scope.retailItemsList = [];
    $scope.errorCustom = [];
    $scope.filteredRetailItemsList = {};
    $scope.salesCategoriesList = [];
    $scope.salesCategoriesMap = {};
    $scope.addRestrictedItemsNumber = 1;
    $scope.repeatableStations = {
      arrivalHas: [],
      departureHas: []
    };
    $scope.selectOptions = { };
    $scope.countryInclusionFilterSelections = {};

    this.getCleanFormData = function() {
      var path = $location.path();
      if ((path.search('/discounts/edit') !== -1 || path.search('/discounts/copy') !== -1) && $routeParams.id) {
        return {
          restrictedCategories: [],
          restrictedItems: [],
          amountDiscountValue: {},
          amountLimitPerShopValue: {},
          amountLimitPerTransactionValue: {},
          discountAmountLimitPerShopValue: {},
          discountAmountLimitPerTransactionValue: {},
          limitByShopDiscountType: 1,
          limitByTransactionDiscountType: 1,
          limitBySeatDiscountType: 1,
          filters: [],
          qrCodeValue: '',
          qrCodeImgUrl: null
        };
      } else {
        return {
          isRestriction: false,
          restrictedCategories: [],
          restrictedItems: [],
          amountDiscountValue: {},
          amountLimitPerShopValue: {},
          amountLimitPerTransactionValue: {},
          discountAmountLimitPerShopValue: {},
          discountAmountLimitPerTransactionValue: {},
          limitByShopDiscountType: 1,
          limitByTransactionDiscountType: 1,
          limitBySeatDiscountType: 1,
          filters: [],
          qrCodeValue: '',
          qrCodeImgUrl: null
        };
      }
    };

    $scope.formData = $this.getCleanFormData();

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/discounts/edit') !== -1 && $routeParams.id) {
        $scope.editingDiscount = true;
        $scope.viewName = 'Edit Discount';
        $scope.buttonText = 'Save';
      } else if (path.search('/discounts/copy') !== -1 && $routeParams.id) {
        $scope.cloneDiscount = true;
        $scope.viewName = 'Clone Discount';
        $scope.buttonText = 'Save';
      }
    };

    $scope.isDisabledForEndDate = function() {
      return $scope.shouldDisableEndDate && !$scope.cloneDiscount;
    };

    this.determineMinDate = function () {
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

    this.setUIReady = function() {
      $scope.minDate = $this.determineMinDate();
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setGlobalDiscountTypesList = function(data) {
      $scope.globalDiscountTypesList = data.discounts;
    };

    this.setDiscountTypesList = function(data) {
      $scope.discountTypesList = lodash.filter(data, function (type) {
        return type.id !== 3;
      });
    };

    this.setCompanyCurrencyGlobals = function(data) {
      $scope.companyCurrencyGlobalsList = data.response;
    };

    this.setSalesCategoriesListAndMap = function(data) {
      $scope.salesCategoriesList = data.salesCategories;
      $scope.salesCategoriesList.unshift({
        id: 0,
        name: 'All'
      });

      angular.forEach(data.salesCategories, function(category) {
        $scope.salesCategoriesMap[category.id] = category;
      });
    };

    this.setRetailItemsList = function(data) {
      $scope.retailItemsList = data.masterItems;
      $scope.filteredRetailItemsList[0] = $scope.retailItemsList;
    };

    this.setDefaultRetailItems = function() {
      $scope.filteredRetailItemsList[0] = $scope.retailItemsList;
    };

    this.redirectUser = function() {
      $location.path('/');
    };

    this.setDiscount = function(data) {
      $this.updateFormData(data.companyDiscount);

      $this.getRetailItemsList();

      $this.setUIReady();
    };

    $scope.$watchGroup(['formData.startDate', 'formData.endDate'], function () {
      if ($scope.formData && $scope.formData.startDate && $scope.formData.endDate) {
        $this.getRetailItemsList();
      }
    });

    this.getDiscount = function(id) {
      this.showLoadingModal('We are getting your Discount data!');
      discountFactory.getDiscount(id).then($this.setDiscount, $this.redirectUser);
    };

    this.dependenciesSuccess = function() {
      $this.setDefaultRetailItems();

      if ($scope.editingDiscount || $scope.cloneDiscount) {
        $this.getDiscount($routeParams.id);
      } else {
        $scope.calendarsReady = true;
        $this.setUIReady();
      }
    };

    this.getGlobalDiscountTypesList = function() {
      return discountFactory.getDiscountTypesList().then($this.setGlobalDiscountTypesList);
    };

    this.getDiscountTypesList = function() {
      return recordsService.getDiscountTypes().then($this.setDiscountTypesList);
    };

    this.getCompanyCurrencyGlobals = function() {
      var companyCurrenciesPayload = {
        isOperatedCurrency: true,
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      return currencyFactory.getCompanyCurrencies(companyCurrenciesPayload).then($this.setCompanyCurrencyGlobals);
    };

    this.getSalesCategoriesList = function() {
      return companiesFactory.getSalesCategoriesList().then($this.setSalesCategoriesListAndMap);
    };

    this.getRetailItemsList = function() {
      var searchPayload = {};

      searchPayload.startDate = dateUtility.formatDateForAPI(new Date());
      if ($scope.formData.startDate !== null && $scope.formData.startDate !== undefined && $scope.formData.startDate !== '') {
        searchPayload.startDate = dateUtility.formatDateForAPI($scope.formData.startDate);
      }

      if ($scope.formData.endDate !== null && $scope.formData.endDate !== undefined && $scope.formData.endDate !== '') {
        searchPayload.endDate = dateUtility.formatDateForAPI($scope.formData.endDate);
      }

      searchPayload.ignoreDryStrore = true;
      return itemsFactory.getItemsList(searchPayload, true).then($this.setRetailItemsList);
    };

    this.makeDependencyPromises = function() {

      return [
        $this.getGlobalDiscountTypesList(),
        $this.getDiscountTypesList(),
        $this.getCompanyCurrencyGlobals(),
        $this.getSalesCategoriesList(),
        $this.getStationGlobals()
      ];
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Discount data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.dependenciesSuccess(response);
      });
    };

    this.deserializeDiscountInformation = function(discountData) {
      $scope.formData.discountName = discountData.name;
      $scope.formData.globalDiscountTypeId = discountData.discountTypeId;
      $scope.formData.barCode = discountData.barcode;
      $scope.formData.qrCodeImgUrl = discountData.qrCodeImgUrl;
      $scope.formData.qrCodeValue = discountData.qrCodeValue;
      $scope.formData.description = discountData.description;
      $scope.formData.note = discountData.note;
      $scope.formData.limitByShopDiscountType = parseInt(discountData.limitByShopDiscountType);
      $scope.formData.limitByTransactionDiscountType = parseInt(discountData.limitByTransactionDiscountType);
      $scope.formData.limitBySeatDiscountType = parseInt(discountData.limitBySeatDiscountType);
      $scope.formData.startDate = dateUtility.formatDateForApp(discountData.startDate);
      $scope.formData.endDate = dateUtility.formatDateForApp(discountData.endDate);
    };

    this.deserializeBenefits = function(discountData) {
      $scope.formData.discountTypeId = discountData.rateTypeId;
      $scope.formData.percentageDiscountValue = discountData.percentage;
      $scope.formData.benefitsMilesPoints = discountData.benefitsMilesPoints;
      $scope.formData.limitPerShopMilesPoints = discountData.limitPerShopMilesPoints;
      $scope.formData.limitPerTransactionMilesPoints = discountData.limitPerTransactionMilesPoints;

      angular.forEach(discountData.rates, function(rate) {
        $scope.formData.amountDiscountValue[rate.companyCurrencyId] = Number(rate.amount).toFixed(2);
      });
    };

    this.deserializeLimitationPerShop = function(discountData) {
      // Item
      $scope.formData.itemQtyLimitPerShop = discountData.itemQuantityLimitByShop;

      if (discountData.limitsByShop.length > 0) {
        $scope.formData.isAmountLimitPerShop = true;
      }

      angular.forEach(discountData.limitsByShop, function(rate) {
        $scope.formData.amountLimitPerShopValue[rate.companyCurrencyId] = Number(rate.amount).toFixed(2);
      });

      // Discount
      $scope.formData.discountQtyLimitPerShop = discountData.discountQuantityLimitByShop;

      if (discountData.discountLimitsByShop.length > 0) {
        $scope.formData.isDiscountAmountLimitPerShop = true;
      }

      angular.forEach(discountData.discountLimitsByShop, function(rate) {
        $scope.formData.discountAmountLimitPerShopValue[rate.companyCurrencyId] = Number(rate.amount).toFixed(2);
      });
    };

    this.deserializeLimitationPerTransaction = function(discountData) {
      // Item
      $scope.formData.itemQtyLimitPerTransaction = discountData.itemQuantityLimitByTransaction;

      if (discountData.limitsByTransaction.length > 0) {
        $scope.formData.isAmountLimitPerTransaction = true;
      }

      angular.forEach(discountData.limitsByTransaction, function(rate) {
        $scope.formData.amountLimitPerTransactionValue[rate.companyCurrencyId] = Number(rate.amount).toFixed(2);
      });

      // Discount
      $scope.formData.discountQtyLimitPerTransaction = discountData.discountQuantityLimitByTransaction;

      if (discountData.discountLimitsByTransaction.length > 0) {
        $scope.formData.isDiscountAmountLimitPerTransaction = true;
      }

      angular.forEach(discountData.discountLimitsByTransaction, function(rate) {
        $scope.formData.discountAmountLimitPerTransactionValue[rate.companyCurrencyId] = Number(rate.amount).toFixed(2);
      });

    };

    this.deserializeLimitationPerSeat = function(discountData) {
      $scope.formData.requireSeatEntry = discountData.seatNumberRequired;
      $scope.formData.itemQtyLimitPerSeat = discountData.itemQuantityLimitBySeatNumber;
      $scope.formData.discountQtyLimitPerSeat = discountData.discountQuantityLimitBySeatNumber;
    };

    this.deserializeRestrictions = function(discountData) {
      $scope.formData.isRestriction = discountData.companyDiscountRestrictions;

      angular.forEach(discountData.restrictedCategories, function(category) {
        $scope.formData.restrictedCategories.push($scope.salesCategoriesMap[category.salesCategoryId]);
      });

      angular.forEach(discountData.restrictedItems, function(item) {
        $scope.formData.restrictedItems.push({
          itemCategory: 0,
          id: item.retailItemId
        });
      });
    };

    this.updateFormData = function(discountData) {
      if (!discountData) {
        return false;
      }

      $scope.originalDiscount = angular.copy(discountData);

      $scope.formData = $this.getCleanFormData();

      $this.deserializeDiscountInformation(discountData);

      $scope.shouldDisableStartDate = !(dateUtility.isAfterTodayDatePicker($scope.formData.startDate));
      $scope.shouldDisableEndDate = !(dateUtility.isAfterTodayDatePicker($scope.formData.endDate) || dateUtility.isTodayDatePicker($scope.formData.endDate));
      $scope.calendarsReady = true;

      $this.deserializeBenefits(discountData);
      $this.deserializeLimitationPerShop(discountData);
      $this.deserializeLimitationPerTransaction(discountData);
      $this.deserializeLimitationPerSeat(discountData);
      $this.deserializeRestrictions(discountData);
      $this.deserializeInclusionFilters(discountData);
    };

    this.deserializeInclusionFilters = function (discountData) {
      $scope.formData.filters = mapFilters(discountData.filters, true);
    };

    this.serializeDiscountInformation = function(formData, discount) {
      discount.discountTypeId = formData.globalDiscountTypeId;
      discount.name = formData.discountName;
      discount.description = formData.description;
      discount.note = formData.note;
      discount.barcode = formData.barCode;
      discount.qrCodeImgUrl = formData.qrCodeImgUrl;
      discount.qrCodeValue = formData.qrCodeValue;
      discount.startDate = dateUtility.formatDateForAPI(formData.startDate);
      discount.endDate = dateUtility.formatDateForAPI(formData.endDate);
    };

    this.serializeBenefits = function(formData, discount) {
      discount.rateTypeId = formData.discountTypeId;
      discount.percentage = formData.percentageDiscountValue;
      discount.benefitsMilesPoints = formData.benefitsMilesPoints;
      discount.limitPerShopMilesPoints = formData.limitPerShopMilesPoints;
      discount.limitPerTransactionMilesPoints = formData.limitPerTransactionMilesPoints;

      angular.forEach(formData.amountDiscountValue, function(amount, currencyId) {
        var original = $this.originalAmountDiscountValueForCurrency(currencyId);
        if (original) {
          original.amount = amount;
          discount.rates.push(original);
        } else {
          discount.rates.push({
            amount: amount,
            companyCurrencyId: currencyId
          });
        }
      });
    };

    this.serializeLimitationPerShop = function(formData, discount) {
      discount.limitByShopDiscountType = formData.limitByShopDiscountType;

      // Item
      discount.itemQuantityLimitByShop = formData.itemQtyLimitPerShop;
      if ($scope.formData.isAmountLimitPerShop === true) {
        angular.forEach(formData.amountLimitPerShopValue, function(amount, currencyId) {
          var original = $this.originalLimitsByShopValueForCurrency(currencyId);
          if (original) {
            original.amount = amount;
            discount.limitsByShop.push(original);
          } else {
            discount.limitsByShop.push({
              amount: amount,
              companyCurrencyId: currencyId
            });
          }
        });
      } else {
        discount.limitsByShop = [];
      }

      // Discount
      discount.discountQuantityLimitByShop = formData.discountQtyLimitPerShop;
      if ($scope.formData.isDiscountAmountLimitPerShop === true) {
        angular.forEach(formData.discountAmountLimitPerShopValue, function(amount, currencyId) {
          var original = $this.originalLimitsByShopValueForCurrency(currencyId);
          if (original) {
            original.amount = amount;
            discount.discountLimitsByShop.push(original);
          } else {
            discount.discountLimitsByShop.push({
              amount: amount,
              companyCurrencyId: currencyId
            });
          }
        });
      } else {
        discount.discountLimitsByShop = [];
      }
    };

    this.serializeLimitationPerTransaction = function(formData, discount) {
      discount.limitByTransactionDiscountType = formData.limitByTransactionDiscountType;

      // Item
      discount.itemQuantityLimitByTransaction = formData.itemQtyLimitPerTransaction;
      if ($scope.formData.isAmountLimitPerTransaction === true) {
        angular.forEach(formData.amountLimitPerTransactionValue, function(amount, currencyId) {
          var original = $this.originalLimitsByTransactionValueForCurrency(currencyId);
          if (original) {
            original.amount = amount;
            discount.limitsByTransaction.push(original);
          } else {
            discount.limitsByTransaction.push({
              amount: amount,
              companyCurrencyId: currencyId
            });
          }
        });
      } else {
        discount.limitsByTransaction = [];
      }

      // Discount
      discount.discountQuantityLimitByTransaction = formData.discountQtyLimitPerTransaction;
      if ($scope.formData.isDiscountAmountLimitPerTransaction === true) {
        angular.forEach(formData.discountAmountLimitPerTransactionValue, function(amount, currencyId) {
          var original = $this.originalLimitsByTransactionValueForCurrency(currencyId);
          if (original) {
            original.amount = amount;
            discount.discountLimitsByTransaction.push(original);
          } else {
            discount.discountLimitsByTransaction.push({
              amount: amount,
              companyCurrencyId: currencyId
            });
          }
        });
      } else {
        discount.discountLimitsByTransaction = [];
      }
    };

    this.serializeLimitationPerSeat = function(formData, discount) {
      discount.seatNumberRequired = formData.requireSeatEntry;
      discount.limitBySeatDiscountType = parseInt(formData.limitBySeatDiscountType);
      discount.itemQuantityLimitBySeatNumber = formData.itemQtyLimitPerSeat;
      discount.discountQuantityLimitBySeatNumber = formData.discountQtyLimitPerSeat;
    };

    this.serializeRestrictions = function(formData, discount) {
      discount.companyDiscountRestrictions = formData.isRestriction;

      angular.forEach(formData.restrictedCategories, function(category) {
        var original = $this.originalRestrictedCategoriesForCategory(category.id);
        if (original) {
          discount.restrictedCategories.push(original);
        } else {
          discount.restrictedCategories.push({
            salesCategoryId: category.id
          });
        }
      });

      angular.forEach(formData.restrictedItems, function(item) {
        var original = $this.originalRestrictedItemsForItem(item.id);
        if (original) {
          discount.restrictedItems.push(original);
        } else {
          discount.restrictedItems.push({
            retailItemId: item.id
          });
        }
      });
    };

    this.originalAmountDiscountValueForCurrency = function(currencyId) {
      if (!$scope.originalDiscount) {
        return;
      }

      return $scope.originalDiscount.rates.filter(function(item) {
        return item.companyCurrencyId.toString() === currencyId;
      })[0];
    };

    this.originalLimitsByShopValueForCurrency = function(currencyId) {
      if (!$scope.originalDiscount) {
        return;
      }

      return $scope.originalDiscount.limitsByShop.filter(function(item) {
        return item.companyCurrencyId.toString() === currencyId;
      })[0];
    };

    this.originalLimitsByTransactionValueForCurrency = function(currencyId) {
      if (!$scope.originalDiscount) {
        return;
      }

      return $scope.originalDiscount.limitsByTransaction.filter(function(item) {
        return item.companyCurrencyId.toString() === currencyId;
      })[0];
    };

    this.originalRestrictedItemsForItem = function(itemId) {
      if (!$scope.originalDiscount) {
        return;
      }

      return $scope.originalDiscount.restrictedItems.filter(function(item) {
        return item.retailItemId === itemId;
      })[0];
    };

    this.originalRestrictedCategoriesForCategory = function(categoryId) {
      if (!$scope.originalDiscount) {
        return;
      }

      return $scope.originalDiscount.restrictedCategories.filter(function(item) {
        return item.salesCategoryId === categoryId;
      })[0];
    };

    this.formatPayload = function(formData) {
      var discount = {
        rates: [],
        limitsByShop: [],
        discountLimitsByShop: [],
        limitsByTransaction: [],
        discountLimitsByTransaction: [],
        restrictedCategories: [],
        restrictedItems: []
      };

      $this.serializeDiscountInformation(formData, discount);
      $this.serializeBenefits(formData, discount);
      $this.serializeLimitationPerShop(formData, discount);
      $this.serializeLimitationPerTransaction(formData, discount);
      $this.serializeLimitationPerSeat(formData, discount);
      $this.serializeRestrictions(formData, discount);
      $this.serializeInclusionFilters(formData, discount);

      return {
        companyDiscount: discount
      };
    };

    $scope.showDeleteConfirmation = function(index, restrictedItem) {
      $scope.restrictedItemToDelete = restrictedItem;
      $scope.restrictedItemToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteRestrictedItem = function() {
      angular.element('.delete-warning-modal').modal('hide');
      $scope.formData.restrictedItems.splice($scope.restrictedItemToDelete.rowIndex, 1);
    };

    $scope.addRestrictedItems = function() {
      var totalRowsToAdd = $scope.addRestrictedItemsNumber || 1;
      for (var i = 0; i < totalRowsToAdd; i++) {
        $scope.formData.restrictedItems.push({
          itemCategory: 0
        });
      }
    };

    $scope.getGlobalDiscountDescriptionById = function(id) {
      var discount = $scope.globalDiscountTypesList.filter(function(discount) {
        return discount.id === id;
      });

      return (discount.length > 0) ? discount[0].description : '';
    };

    $scope.getRetailItemNameById = function(id) {
      var retailItem = $scope.retailItemsList.filter(function(retailItem) {
        return retailItem.id === id;
      });

      return (retailItem.length > 0) ? retailItem[0].itemName : '';
    };

    $scope.loadRestrictedItemsByCategory = function(categoryId) {
      if (!categoryId || categoryId === 0) {
        return;
      }

      var searchPayload = {};

      searchPayload.startDate = dateUtility.formatDateForAPI(new Date());
      if ($scope.formData.startDate !== null && $scope.formData.startDate !== undefined && $scope.formData.startDate !== '') {
        searchPayload.startDate = dateUtility.formatDateForAPI($scope.formData.startDate);
      }

      if ($scope.formData.endDate !== null && $scope.formData.endDate !== undefined && $scope.formData.endDate !== '') {
        searchPayload.endDate = dateUtility.formatDateForAPI($scope.formData.endDate);
      }

      searchPayload.categoryId = categoryId;
      searchPayload.ignoreDryStrore = true;
      itemsFactory.getItemsList(searchPayload, true).then(function(response) {
        $scope.filteredRetailItemsList[categoryId] = response.masterItems;
      });
    };

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate && !$scope.cloneDiscount;
    };

    $scope.showAddRestrictionSection = function() {
      return $scope.formData.isRestriction;
    };

    $scope.shouldValidatePrice = function() {
      return !$scope.isDisabled();
    };

    $scope.formScroll = function(id, activeBtn) {
      $scope.activeBtn = id;
      var elm = angular.element('#' + id);
      var body = angular.element('body');
      var navBar = angular.element('.form-nav').height();
      var topBar = angular.element('.top-header').height();
      body.animate({
        scrollTop: elm.offset().top - (navBar + topBar + 100)
      }, 'slow');
      return activeBtn;
    };

    $scope.addBlankObjectToArray = function (_array) {
      if ($scope.readOnly || $scope.isDisabled()) {
        return false;
      }

      _array.push({});
    };

    $scope.removeFromStationListByIndex = function ($index) {
      var arrivalId = -1;
      var departureId = -1;

      if (!$scope.formData.filters[$index]) {
        return false;
      }

      if ($scope.formData.filters[$index].arrivalStation) {
        arrivalId = $scope.formData.filters[$index].arrivalStation.id;
      }

      if ($scope.formData.filters[$index].departureStation) {
        departureId = $scope.formData.filters[$index].departureStation.id;
      }

      removeDepartureFromHasArrival(arrivalId, departureId);
      removeArrivalFromHasDeparture(arrivalId, departureId);
      $scope.formData.filters.splice($index, 1);
    };

    function removeDepartureFromHasArrival(arrivalId, departureId) {
      var departureIndex = -1;
      if ($scope.repeatableStations.arrivalHas[arrivalId]) {
        departureIndex = $scope.repeatableStations.arrivalHas[arrivalId].indexOf(departureId);
      }

      if (departureIndex !== -1) {
        $scope.repeatableStations.arrivalHas[arrivalId].splice(departureIndex, 1);
      }
    }

    function removeArrivalFromHasDeparture(arrivalId, departureId) {
      var arrivalIndex = -1;
      if ($scope.repeatableStations.departureHas[departureId]) {
        arrivalIndex = $scope.repeatableStations.departureHas[departureId].indexOf(arrivalId);
      }

      if (arrivalIndex !== -1) {
        $scope.repeatableStations.departureHas[departureId].splice(arrivalIndex, 1);
      }
    }

    $scope.showInclusionFilterByCountryModal = function() {
      $scope.countryInclusionFilterSelections = { };
      angular.element('#inclusion-filter-countries-modal').modal('show');
    };

    $scope.addSelectedCountriesForInclusionFilter = function() {
      var selectedDepartureCountryId = $scope.countryInclusionFilterSelections.departure;
      var selectedArrivalCountryId = $scope.countryInclusionFilterSelections.arrival;

      var departureStations = lodash.filter($scope.selectOptions.companyStationGlobals, function (station) {
        return station.countryId === selectedDepartureCountryId;
      });

      var arrivalStations = lodash.filter($scope.selectOptions.companyStationGlobals, function (station) {
        return station.countryId === selectedArrivalCountryId;
      });

      if (departureStations.length > 0 && arrivalStations.length > 0) {
        departureStations.forEach(function (ds) {
          arrivalStations.forEach(function (as) {
            $scope.addInclusionFilterRow(ds, as);
          });
        });
      }

      if (departureStations.length === 0) {
        arrivalStations.forEach(function (as) {
          $scope.addInclusionFilterRow({}, as);
        });
      }

      if (arrivalStations.length === 0) {
        departureStations.forEach(function (ds) {
          $scope.addInclusionFilterRow(ds, {});
        });
      }

      angular.element('#inclusion-filter-countries-modal').modal('hide');
    };

    $scope.addInclusionFilterRow = function (departureStation, arrivalStation) {
      if ($scope.readOnly || $scope.isDisabled()) {
        return false;
      }

      $scope.formData.filters.push({
        departureStation: departureStation,
        arrivalStation: arrivalStation
      });
    };

    $scope.stationListChanged = function ($index) {
      if (!hasCompleteStationObject($index)) {
        return false;
      }

      var departureId = $scope.formData.filters[$index].departureStation.id;
      var arrivalId = $scope.formData.filters[$index].arrivalStation.id;
      if (!$scope.repeatableStations.departureHas[departureId]) {
        $scope.repeatableStations.departureHas[departureId] = [];
      }

      $scope.repeatableStations.departureHas[departureId].push(arrivalId);
      if (!$scope.repeatableStations.arrivalHas[arrivalId]) {
        $scope.repeatableStations.arrivalHas[arrivalId] = [];
      }

      $scope.repeatableStations.arrivalHas[arrivalId].push(departureId);
    };

    function hasCompleteStationObject(index) {
      if (angular.isUndefined($scope.formData.filters[index])) {
        return false;
      }

      return hasDepartureStationObject(index) && hasCompleteArrivalStation(index);
    }

    function hasDepartureStationObject(index) {
      if (angular.isUndefined($scope.formData.filters[index].departureStation)) {
        return false;
      }

      return !angular.isUndefined($scope.formData.filters[index].departureStation.id);
    }

    function hasCompleteArrivalStation(index) {
      if (angular.isUndefined($scope.formData.filters[index].arrivalStation)) {
        return false;
      }

      return !angular.isUndefined($scope.formData.filters[index].arrivalStation.id);
    }

    function setStationGlobals(dataFromAPI) {
      $scope.selectOptions.companyStationGlobals = dataFromAPI.response;

      setCountryList(dataFromAPI.response);
    }

    function setCountryList(stationsFromAPI) {
      var countries = stationsFromAPI.map(function (station) {
        return {
          id: station.countryId,
          name: station.countryName
        };
      });

      $scope.countryList = _.uniqBy(countries, function (e) {
        return e.id;
      });
    }

    this.getStationGlobals = function () {
      return discountFactory.getStationGlobals().then(setStationGlobals);
    };

    $scope.disabledDepartureStations = function (station, stations) {
      if (!stations.arrivalStation) {
        return false;
      }

      return lodash.find($scope.formData.filters, { arrivalStation: stations.arrivalStation, departureStation: station });
    };

    $scope.disabledArrivalStations = function (station, stations) {
      if (!stations.departureStation) {
        return false;
      }

      return lodash.find($scope.formData.filters, { departureStation: stations.departureStation, arrivalStation: station });
    };

    this.serializeInclusionFilters = function (formData, discount) {
      discount.filters = mapFilters($scope.formData.filters);
    };

    function mapFilters(arrayToMap, bindWholeObjectForView) {
      return arrayToMap.map(function (stationData) {
        var stationFilters = {};
        if (angular.isDefined(stationData.id)) {
          stationFilters = angular.copy(stationData);
        }

        stationFilters.arrivalStationId = getArrivalStationId(stationData);
        stationFilters.departureStationId = getDepartureStationId(stationData);
        if (bindWholeObjectForView) {
          stationFilters.arrivalStation = getObjectByIdFromSelectOptions('companyStationGlobals', {
            id: stationData.arrivalStationId
          });
          stationFilters.departureStation = getObjectByIdFromSelectOptions('companyStationGlobals', {
            id: stationData.departureStationId
          });
        } else if (angular.isDefined(stationFilters.arrivalStation)) {
          delete stationFilters.arrivalStation;
          delete stationFilters.departureStation;
        }

        return stationFilters;
      });
    }

    function getArrivalStationId(stationData) {
      if (angular.isDefined(stationData.arrivalStation) && angular.isDefined(stationData.arrivalStation.id)) {
        return stationData.arrivalStation.id;
      }

      if (angular.isDefined(stationData.arrivalStationId)) {
        return stationData.arrivalStationId;
      }

      return null;
    }

    function getDepartureStationId(stationData) {
      if (angular.isDefined(stationData.departureStation) && angular.isDefined(stationData.departureStation.id)) {
        return stationData.departureStation.id;
      }

      if (angular.isDefined(stationData.departureStationId)) {
        return stationData.departureStationId;
      }

      return null;
    }

    function getObjectByIdFromSelectOptions(arrayName, objectById) {
      var resultList = $scope.selectOptions[arrayName];
      var objectToReturn = $filter('filter')(resultList, objectById, true);
      if (!objectToReturn || !objectToReturn.length) {
        return {
          id: null
        };
      }

      return objectToReturn[0];
    }

    this.validateForm = function() {
      $scope.displayError = !$scope.form.$valid || $scope.errorCustom.length > 0;
      return !$scope.displayError;
    };

    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.updateDiscountSuccess = function(response) {
      $this.updateFormData(response.companyDiscount);
      angular.element('#loading').modal('hide');
      angular.element('#update-success').modal('show');
    };

    this.updateItem = function(payload) {
      angular.element('#loading').modal('show').find('p').text('We are updating your discount');

      discountFactory.updateDiscount($routeParams.id, payload).then($this.updateDiscountSuccess, $this.errorHandler);
    };

    this.createDiscountSuccess = function() {
      angular.element('#loading').modal('hide');
      angular.element('#create-success').modal('show');
    };

    this.createItem = function(payload) {
      angular.element('#loading').modal('show').find('p').text('We are creating your discount');

      discountFactory.createDiscount(payload).then($this.createDiscountSuccess, $this.errorHandler);
    };

    $scope.submitForm = function(formData) {
      $scope.errorCustom = [];
      $this.validateRestrictions();
      $this.validateItemLimitPerShop();
      $this.validateDiscountLimitPerShop();
      $this.validateItemLimitPerTransaction();
      $this.validateDiscountLimitPerTransaction();
      $this.validateCouponBarQrCode();

      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm() && $scope.errorCustom.length === 0) {
        var itemData = angular.copy(formData);
        var payload = $this.formatPayload(itemData);
        angular.forEach(payload.companyDiscount.restrictedCategories, function(restrictedCategorie) {
          if (restrictedCategorie.salesCategoryId === 0) {
            payload.companyDiscount.restrictedCategories = [];
            angular.forEach($scope.salesCategoriesList, function(category) {
              if (category.id === 0) { return; }

              payload.companyDiscount.restrictedCategories.push({
                salesCategoryId: category.id
              });
            });
          }
        });

        var action = $scope.editingDiscount ? 'updateItem' : 'createItem';
        $this[action](payload);
      }
    };

    this.validateRestrictions = function() {
      if ($scope.formData.isRestriction) {
        if ($scope.formData.restrictedCategories.length <= 0 && $scope.formData.restrictedItems.length <= 0) {
          $scope.errorCustom.push(
            {
              field: 'Restrictions',
              code: 'custom',
              value: 'Either Item Categories or Retail Items has to be defined when Restrictions are enabled'
            }
          );

          return;
        }

        if ($scope.formData.restrictedItems) {
          $scope.formData.restrictedItems.forEach(function (item, i) {
            if (typeof item.id === 'undefined' || item.id === '' || item.id === null) {
              $scope.errorCustom.push(
                {
                  field: 'Restrictions > Retail Item #' + (i + 1),
                  code: 'custom',
                  value: 'Retail Item must be selected'
                }
              );
            }
          });
        }
      }
    };

    this.validateItemLimitPerTransaction = function() {
      if ($scope.formData.isAmountLimitPerTransaction === true) {
        if (!($scope.formData.itemQtyLimitPerTransaction === '' || typeof $scope.formData.itemQtyLimitPerTransaction === 'undefined' || $scope.formData.itemQtyLimitPerTransaction === null)) {
          $scope.errorCustom.push(
            {
              field: 'Limitation Per Transaction',
              code: 'custom',
              value: 'Either the "Item Qty Limit Per Transaction" or "Amount Limit Per Transaction Value" is allowed, not both'
            }
          );
        }
      }
    };

    this.validateDiscountLimitPerTransaction = function() {
      if ($scope.formData.isDiscountAmountLimitPerTransaction === true) {
        if (!($scope.formData.discountQtyLimitPerTransaction === '' || typeof $scope.formData.discountQtyLimitPerTransaction === 'undefined' || $scope.formData.discountQtyLimitPerTransaction === null)) {
          $scope.errorCustom.push(
            {
              field: 'Limitation Per Transaction',
              code: 'custom',
              value: 'Either the "Discount Qty Limit Per Transaction" or "Discount Amount Limit Per Transaction Value" is allowed, not both'
            }
          );
        }
      }
    };

    this.validateItemLimitPerShop = function() {

      if ($scope.formData.isAmountLimitPerShop === true) {
        if (!($scope.formData.itemQtyLimitPerShop === '' || typeof $scope.formData.itemQtyLimitPerShop === 'undefined' || $scope.formData.itemQtyLimitPerShop === null)) {
          $scope.errorCustom.push(
            {
              field: 'Limitation Per Shop',
              code: 'custom',
              value: 'Either the "Item Qty Limit Per Shop" or "Amount Limit Per Shop Value" is allowed, not both'
            }
          );
        }
      }
    };

    this.validateDiscountLimitPerShop = function() {
      if ($scope.formData.isDiscountAmountLimitPerShop === true) {
        if (!($scope.formData.discountQtyLimitPerShop === '' || typeof $scope.formData.discountQtyLimitPerShop === 'undefined' || $scope.formData.discountQtyLimitPerShop === null)) {
          $scope.errorCustom.push(
            {
              field: 'Limitation Per Shop',
              code: 'custom',
              value: 'Either the "Discount Qty Limit Per Shop" or "Discount Amount Limit Per Shop Value" is allowed, not both'
            }
          );
        }
      }
    };

    this.init = function() {
      this.checkFormState();
      this.getDependencies();
    };

    this.init();

    $scope.isCurrentEffectiveDate = function (discountData) {
      return (dateUtility.isTodayOrEarlierDatePicker(discountData.startDate) && dateUtility.isAfterTodayDatePicker(discountData.endDate));
    };

    this.validateCouponBarQrCode = function() {
      if ($scope.formData.globalDiscountTypeId === 1) {
        if (!$scope.formData.qrCodeImgUrl) { // if qr code not saved clear qr value
          $scope.formData.qrCodeValue = '';
        }
      } else {
        $scope.formData.qrCodeValue = '';
        $scope.formData.qrCodeImgUrl = null;
        $scope.formData.barCode = null;
      }
    };

    $scope.isQrCodeSet = function() {
      return ($scope.formData && $scope.formData.qrCodeImgUrl);
    };

    $scope.isQrCreateHidden = function() {
      var isQrCodeSet = $scope.isQrCodeSet();
      return ($scope.viewOnly || $scope.itemIsActive || isQrCodeSet);
    };

    $scope.removeQRCode = function() {
      $scope.formData.qrCodeImgUrl = '';
      $scope.formData.qrCodeValue = '';
    };
  });
