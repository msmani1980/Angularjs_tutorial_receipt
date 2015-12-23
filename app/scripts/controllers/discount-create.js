'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountCreateCtrl
 * @description
 * # DiscountCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountCreateCtrl', function ($scope, $q, $location, $routeParams, dateUtility, discountFactory, recordsService, currencyFactory, companiesFactory, itemsFactory) {
    var $this = this;

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
    $scope.filteredRetailItemsList = {};
    $scope.salesCategoriesList = [];
    $scope.salesCategoriesMap = {};
    $scope.addRestrictedItemsNumber = 1;

    this.getCleanFormData = function() {
      return {
        isRestriction: false,
        restrictedCategories: [],
        restrictedItems: [],
        amountDiscountValue: {},
        amountLimitPerShopValue: {},
        amountLimitPerTransactionValue: {}
      };
    };

    $scope.formData = $this.getCleanFormData();

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/discounts/edit') !== -1 && $routeParams.id) {
        $scope.editingDiscount = true;
        $scope.viewName = 'Edit Discount';
        $scope.buttonText = 'Save';
      }
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
      $scope.discountTypesList = data;
    };

    this.setCompanyCurrencyGlobals = function(data) {
      $scope.companyCurrencyGlobalsList = data.response;
    };

    this.setSalesCategoriesListAndMap = function(data) {
      $scope.salesCategoriesList = data.salesCategories;
      $scope.salesCategoriesList.unshift({id: 0, name:'All'});

      angular.forEach(data.salesCategories, function(category) {
        $scope.salesCategoriesMap[category.id] = category;
      });
    };

    this.setRetailItemsList = function(data) {
      $scope.retailItemsList = data.masterItems;
    };

    this.setDefaultRetailItems = function() {
      $scope.filteredRetailItemsList[0] = $scope.retailItemsList;
    };

    this.redirectUser = function() {
      $location.path('/');
    };

    this.setDiscount = function(data) {
      $this.updateFormData(data.companyDiscount);
      $this.setUIReady();
    };

    this.getDiscount = function(id) {
      this.showLoadingModal('We are getting your Discount data!');
      discountFactory.getDiscount(id).then($this.setDiscount, $this.redirectUser);
    };

    this.dependenciesSuccess = function() {
      $this.setDefaultRetailItems();

      if ($scope.editingDiscount) {
        $this.getDiscount($routeParams.id);
      } else {
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
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };

      return currencyFactory.getCompanyCurrencies(companyCurrenciesPayload).then($this.setCompanyCurrencyGlobals);
    };

    this.getSalesCategoriesList = function() {
      return companiesFactory.getSalesCategoriesList().then($this.setSalesCategoriesListAndMap);
    };

    this.getRetailItemsList = function() {
      return itemsFactory.getItemsList({}, true).then($this.setRetailItemsList);
    };


    this.makeDependencyPromises = function() {

      return [
        $this.getGlobalDiscountTypesList(),
        $this.getDiscountTypesList(),
        $this.getCompanyCurrencyGlobals(),
        $this.getSalesCategoriesList(),
        $this.getRetailItemsList()
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
      $scope.formData.description = discountData.description;
      $scope.formData.startDate = dateUtility.formatDateForApp(discountData.startDate);
      $scope.formData.endDate = dateUtility.formatDateForApp(discountData.endDate);
    };

    this.deserializeBenefits = function(discountData) {
      $scope.formData.discountTypeId = discountData.rateTypeId;
      $scope.formData.percentageDiscountValue = discountData.percentage;

      angular.forEach(discountData.rates, function(rate) {
        $scope.formData.amountDiscountValue[rate.companyCurrencyId] = rate.amount;
      });
    };

    this.deserializeLimitationPerShop = function(discountData) {
      $scope.formData.itemQtyLimitPerShop = discountData.itemQuantityLimitByShop;

      if(discountData.limitsByShop.length > 0) {
        $scope.formData.isAmountLimitPerShop = true;
      }

      angular.forEach(discountData.limitsByShop, function(rate) {
        $scope.formData.amountLimitPerShopValue[rate.companyCurrencyId] = rate.amount;
      });
    };

    this.deserializeLimitationPerTransaction = function(discountData) {
      $scope.formData.itemQtyLimitPerTransaction = discountData.itemQuantityLimitByTransaction;

      if(discountData.limitsByTransaction.length > 0) {
        $scope.formData.isAmountLimitPerTransaction = true;
      }

      angular.forEach(discountData.limitsByTransaction, function(rate) {
        $scope.formData.amountLimitPerTransactionValue[rate.companyCurrencyId] = rate.amount;
      });
    };

    this.deserializeLimitationPerSeat = function(discountData) {
      $scope.formData.requireSeatEntry = discountData.seatNumberRequired;
      $scope.formData.itemQtyLimitPerSeat = discountData.itemQuantityLimitBySeatNumber;
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

      $scope.formData = $this.getCleanFormData();

      $this.deserializeDiscountInformation(discountData);
      $this.checkIfDiscountIsInactive(discountData);
      if (!$scope.discountIsInactive) {
        $this.checkIfDiscountIsActive(discountData);
      }
      $this.deserializeBenefits(discountData);
      $this.deserializeLimitationPerShop(discountData);
      $this.deserializeLimitationPerTransaction(discountData);
      $this.deserializeLimitationPerSeat(discountData);
      $this.deserializeRestrictions(discountData);
    };

    this.serializeDiscountInformation = function(formData, discount) {
      discount.discountTypeId = formData.globalDiscountTypeId;
      discount.name = formData.discountName;
      discount.description = formData.description;
      discount.barcode = formData.barCode;
      discount.startDate = dateUtility.formatDateForAPI(formData.startDate);
      discount.endDate = dateUtility.formatDateForAPI(formData.endDate);
    };

    this.serializeBenefits = function(formData, discount) {
      discount.rateTypeId = formData.discountTypeId;
      discount.percentage = formData.percentageDiscountValue;
      angular.forEach(formData.amountDiscountValue, function(amount, currencyId) {
        discount.rates.push({
          amount: amount,
          companyCurrencyId: currencyId
        });
      });
    };

    this.serializeLimitationPerShop = function(formData, discount) {
      discount.itemQuantityLimitByShop = formData.itemQtyLimitPerShop;
      angular.forEach(formData.amountLimitPerShopValue, function(amount, currencyId) {
        discount.limitsByShop.push({
          amount: amount,
          companyCurrencyId: currencyId
        });
      });
    };

    this.serializeLimitationPerTransaction = function(formData, discount) {
      discount.itemQuantityLimitByTransaction = formData.itemQtyLimitPerTransaction;
      angular.forEach(formData.amountLimitPerTransactionValue, function(amount, currencyId) {
        discount.limitsByTransaction.push({
          amount: amount,
          companyCurrencyId: currencyId
        });
      });
    };

    this.serializeLimitationPerSeat = function(formData, discount) {
      discount.seatNumberRequired = formData.requireSeatEntry;
      discount.itemQuantityLimitBySeatNumber = formData.itemQtyLimitPerSeat;
    };

    this.serializeRestrictions = function(formData, discount) {
      discount.companyDiscountRestrictions = formData.isRestriction;
      angular.forEach(formData.restrictedCategories, function(category) {
        discount.restrictedCategories.push({
          salesCategoryId: category.id
        });
      });
      angular.forEach(formData.restrictedItems, function(item) {
        discount.restrictedItems.push({
          retailItemId: item.id
        });
      });
    };

    this.formatPayload = function(formData) {
      var discount = {
        rates: [],
        limitsByShop: [],
        limitsByTransaction: [],
        restrictedCategories: [],
        restrictedItems: []
      };

      $this.serializeDiscountInformation(formData, discount);
      $this.serializeBenefits(formData, discount);
      $this.serializeLimitationPerShop(formData, discount);
      $this.serializeLimitationPerTransaction(formData, discount);
      $this.serializeLimitationPerSeat(formData, discount);
      $this.serializeRestrictions(formData, discount);

      return {
        companyDiscount: discount
      };
    };

    $scope.showDeleteConfirmation = function (index, restrictedItem) {
      $scope.restrictedItemToDelete = restrictedItem;
      $scope.restrictedItemToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteRestrictedItem = function () {
      angular.element('.delete-warning-modal').modal('hide');
      $scope.formData.restrictedItems.splice($scope.restrictedItemToDelete.rowIndex, 1);
    };

    $scope.addRestrictedItems = function() {
      var totalRowsToAdd = $scope.addRestrictedItemsNumber || 1;
      for (var i = 0; i < totalRowsToAdd; i++) {
        $scope.formData.restrictedItems.push({itemCategory: 0});
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
      if(!categoryId || categoryId === 0) {
        return;
      }

      itemsFactory.getItemsList({categoryId: categoryId}, true).then(function(response) {
        $scope.filteredRetailItemsList[categoryId] = response.masterItems;
      });
    };

    this.checkIfDiscountIsActive = function(discountData) {
      var today = new Date();
      var discountStartDate = new Date(discountData.startDate);
      $scope.discountIsActive = discountStartDate <= today;
    };

    this.checkIfDiscountIsInactive = function(discountData) {
      var today = new Date();
      var discountEndDate = new Date(discountData.endDate);
      $scope.discountIsInactive = discountEndDate <= today;
      $scope.viewOnly = $scope.viewOnly || $scope.discountIsInactive;
    };

    $scope.isDisabled = function() {
      return ($scope.viewOnly || $scope.discountIsActive);
    };

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

    this.validateForm = function() {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
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
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var itemData = angular.copy(formData);
        var payload = $this.formatPayload(itemData);
        var action = $scope.editingDiscount ? 'updateItem' : 'createItem';
        $this[action](payload);
      }
    };

    this.init = function() {
      this.checkFormState();
      this.getDependencies();
    };

    this.init();
  });
