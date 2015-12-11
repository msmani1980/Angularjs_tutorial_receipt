'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountsCreateCtrl
 * @description
 * # DiscountsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountsCreateCtrl', function ($scope, $q, $location, $routeParams, dateUtility, discountFactory, recordsService, currencyFactory) {
    var $this = this;

    $scope.viewName = 'Create Discount';
    $scope.buttonText = 'Create';
    $scope.editingDiscount = false;
    $scope.uiSelectTemplateReady = false;
    $scope.globalDiscountTypesList = [];
    $scope.discountTypesList = [];
    $scope.companyCurrencyGlobalsList = [];
    $scope.formData = {};

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

    this.setDependencies = function(response) {
      $this.setGlobalDiscountTypesList(response[0]);
      $this.setDiscountTypesList(response[1]);
      $this.setCompanyCurrencyGlobals(response[2]);

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
        currencyFactory.getCompanyCurrencies(companyCurrenciesPayload)
      ];
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Discount data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
      });
    };

    $scope.getGlobalDiscountDescriptionById = function(id) {
      var discount = $scope.globalDiscountTypesList.filter(function(discount) {
        return discount.id == id
      });

      return (discount.length > 0) ? discount[0].description : "";
    };

    this.init = function() {
      this.checkFormState();
      this.getDependencies();
    };

    this.init();

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
  });
