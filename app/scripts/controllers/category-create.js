'use strict';

// jshint maxcomplexity:6
/**
 * @ngdoc function
 * @name ts5App.controller:CategoryCreateCtrl
 * @description
 * # CategoryCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('CategoryCreateCtrl',
  function($scope, $compile, ENV, $resource, $anchorScroll, categoryFactory,
    $routeParams, globalMenuService, $q, dateUtility, $filter, lodash) {

    // object resolution in for sub scopes
    var $this = this;

    $scope.formData = {
      name: '',
      description: '',
      parentCategoryId: null
    };

    $scope.categoryList = [];
    $scope.viewName = 'Create Category';
    $scope.buttonText = 'Create';
    $scope.editingCategory = false;

    this.checkFormState = function() {
      if ($routeParams.action === 'edit' && $routeParams.id) {
        $scope.viewName = 'Edit Category';
        $scope.editingCategory = true;
        $scope.buttonText = 'Save';
      }
    };

    this.init = function() {
      this.checkFormState();
      this.getDependencies();
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.setUIReady = function() {
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
    };

    this.errorHandler = function(dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getDependenciesSuccesHandler = function(response) {
      $scope.categoryList = response[0].salesCategories;
      if ($scope.editingCategory) {
        $scope.category = response[1];
        $scope.formData.name = $scope.category.name;
        $scope.formData.description = $scope.category.description;
        $scope.formData.parentCategoryId = lodash.isNull($scope.category.parentId) ? null : lodash($scope.category.parentId).toString();
        $scope.formData.nextCategoryId = lodash.isNull($scope.category.nextCategoryId) ? null : lodash($scope.category.nextCategoryId).toString();
      }

      $this.setUIReady();
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading Category data!');
      var promises = [
        categoryFactory.getCategoryList()
      ];
      if ($scope.editingCategory) {
        promises.push(categoryFactory.getCategory($routeParams.id));
      }

      $q.all(promises).then($this.getDependenciesSuccesHandler, $this.errorHandler);
    };

    this.init();

    this.updateCategorySuccessHandler = function() {
      angular.element('#loading').modal('hide');
      angular.element('#create-success').modal('show');
      return true;
    };

    this.updateCategory = function(payload) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text('We are updating your category');
      categoryFactory.updateCategory($routeParams.id, payload).then($this.updateCategorySuccessHandler, $this.errorHandler);
    };

    this.createCategorySuccessHandler = function() {
      angular.element('#loading').modal('hide');
      angular.element('#create-success').modal('show');
      return true;
    };

    this.createCategory = function(payload) {
      angular.element('#loading').modal('show').find('p').text('We are creating your category');
      categoryFactory.createCategory(payload).then($this.createCategorySuccessHandler, $this.errorHandler);
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var payload = angular.copy(formData);
        var action = $scope.editingCategory ? 'updateCategory' : 'createCategory';
        $this[action](payload);
      }
    };

    this.validateForm = function() {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    };

  });
