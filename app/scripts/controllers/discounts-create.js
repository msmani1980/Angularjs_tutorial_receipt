'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountsCreateCtrl
 * @description
 * # DiscountsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountsCreateCtrl', function ($scope, $q, $location, $routeParams, dateUtility, discountFactory, recordsService, currencyFactory, companiesFactory, itemsFactory) {
    var $this = this;

    $scope.viewName = 'Create Discount';
    $scope.buttonText = 'Create';
    $scope.editingDiscount = false;
    $scope.uiSelectTemplateReady = false;
    $scope.globalDiscountTypesList = [];
    $scope.discountTypesList = [];
    $scope.companyCurrencyGlobalsList = [];
    $scope.retailItemsList = [];
    $scope.salesCategoriesList = [];
    $scope.addRestrictedItemsNumber = 1;
    $scope.formData = {
      isRestriction: false,
      restrictedItems: []
    };

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/discounts/edit') !== -1 && $routeParams.id) {
        $scope.editingDiscount = true;
        $scope.viewName = 'Edit Discount';
        $scope.buttonText = 'Save';
      }
    };

    this.setUIReady = function() {
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

    this.setSalesCategoriesList = function(data) {
      $scope.salesCategoriesList = data.salesCategories;
    };

    this.setRetailItemsList = function(data) {
      $scope.retailItemsList = data.masterItems;
    };

    this.setDependencies = function(response) {
      $this.setGlobalDiscountTypesList(response[0]);
      $this.setDiscountTypesList(response[1]);
      $this.setCompanyCurrencyGlobals(response[2]);
      $this.setSalesCategoriesList(response[3]);
      $this.setRetailItemsList(response[4]);

      if ($scope.editingDiscount) {
        this.getItem($routeParams.id);
      } else {
        $this.setUIReady();
      }
    };

    this.makeDependencyPromises = function() {
      var companyCurrenciesPayload = {
        isOperatedCurrency: true,
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };

      return [
        discountFactory.getDiscountTypesList(),
        recordsService.getDiscountTypes(),
        currencyFactory.getCompanyCurrencies(companyCurrenciesPayload),
        companiesFactory.getSalesCategoriesList(),
        itemsFactory.getItemsList({}, true)
      ];
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Discount data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
      });
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
        $scope.formData.restrictedItems.push({restrictedItem: null});
      }
    };

    $scope.getGlobalDiscountDescriptionById = function(id) {
      var discount = $scope.globalDiscountTypesList.filter(function(discount) {
        return discount.id == id
      });

      return (discount.length > 0) ? discount[0].description : "";
    };

    $scope.getRetailItemNameById = function(id) {
      var retailItem = $scope.retailItemsList.filter(function(retailItem) {
        return retailItem.id == id
      });

      return (retailItem.length > 0) ? retailItem[0].itemName : "";
    };

    $scope.isDisabled = function() {
      return false;
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
