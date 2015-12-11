'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountsCreateCtrl
 * @description
 * # DiscountsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountsCreateCtrl', function ($scope, $q, $location, $routeParams, discountFactory) {
    var $this = this;

    $scope.viewName = 'Create Discount';
    $scope.buttonText = 'Create';
    $scope.editingDiscount = false;
    $scope.uiSelectTemplateReady = false;
    $scope.discountTypesList = [];
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

    this.setDiscountTypesList = function(data) {
      $scope.discountTypesList = data.discounts;
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.makeDependencyPromises = function() {
      return [
        discountFactory.getDiscountTypesList()
      ];
    };

    this.setDependencies = function(response) {
      $this.setDiscountTypesList(response[0]);

      if ($scope.editingDiscount) {
        this.getItem($routeParams.id);
      } else {
        $this.setUIReady();
      }
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading the Discount data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function(response) {
        $this.setDependencies(response);
      });
    };

    $scope.getGlobalDiscountDescriptionById = function(id) {
      var discount = $scope.discountTypesList.filter(function(discount) {
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
