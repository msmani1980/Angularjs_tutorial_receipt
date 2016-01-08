'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ItemCreateCtrl
 * @description
 * # ItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('CompanyCreateCtrl',
  function ($scope, $compile, ENV, $resource, $location, $anchorScroll, companiesFactory,
            currencyFactory, languagesService, countriesService, companyTypesService,
            $routeParams, GlobalMenuService, $q, dateUtility, $filter, lodash) {

    // object resolution in for sub scopes
    var $this = this;

    $scope.formData = {
      taxes: [],
      languages: [],
      countryVats: [],
      companyCabinClasses: []
    };

    $scope.viewName = 'Create Company';
    $scope.buttonText = 'Create';
    $scope.companyIsActive = false;
    $scope.companyIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingCompany = false;
    $scope.uiSelectTemplateReady = false;

    $scope.companyTypes = [];
    $scope.currencies = [];
    $scope.companies = [];
    $scope.languages = [];
    $scope.countries = [];
    $scope.companyTypes = [];

    this.checkFormState = function () {
      var path = $location.path();
      if (path.search('/company-edit') !== -1 && $routeParams.id) {
        $scope.editingCompany = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/item-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    function calculateFieldsVisibility() {
      $scope.showAdditionalFields = ($scope.formData.companyTypeId === '1');
      $scope.showBaseCurrency = lodash.includes(['1', '2', '5'], $scope.formData.companyTypeId);
    }

    this.init = function () {
      this.checkFormState();
      this.getDependencies();
      calculateFieldsVisibility();
    };

    this.updateViewName = function (item) {
      var prefix = 'Viewing ';
      if ($scope.editingCompany) {
        prefix = 'Editing ';
      }

      $scope.viewName = prefix + item.companyName;
    };

    // gets an company to $scope.editingCompany
    this.getCompany = function (id) {
      this.showLoadingModal('We are getting your Company data!');
      companiesFactory.getCompany(id).then(function (data) {
        $this.updateViewName(data.company); // TODO: ?
        $this.setUIReady();
      });
    };

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.setUIReady = function () {
      $scope.uiSelectTemplateReady = true;
      this.hideLoadingModal();
    };

    this.setDependencies = function (response) {
      $scope.companyTypes = response[0];
      $scope.currencies = response[1].response;
      $scope.companies = response[2].companies;
      $scope.languages = response[3].languages;
      $scope.countries = response[4].countries;
      if ($scope.editingCompany || $scope.cloningItem || $scope.viewOnly) {
        this.getCompany($routeParams.id);
      } else {
        $this.setUIReady();
      }
    };

    this.makeDependencyPromises = function () {
      return [
        companyTypesService.getCompanyTypes(),
        currencyFactory.getCompanyCurrencies(),
        companiesFactory.getCompanyList(),
        languagesService.getLanguagesList(),
        countriesService.getCountriesList()
      ];
    };

    this.getDependencies = function () {
      $this.showLoadingModal('We are loading data!');
      var dependencyPromises = this.makeDependencyPromises();
      $q.all(dependencyPromises).then(function (response) {
        $this.setDependencies(response);
      });
    };

    this.init();

    $scope.$watch('formData.companyTypeId', function () {
      calculateFieldsVisibility();
    });

    $scope.addTax = function () {
      $scope.formData.taxes.push({});
    };

    $scope.removeTax = function (tax) {
      $scope.formData.taxes = lodash.filter($scope.formData.taxes, function (t) {
        return t !== tax;
      });
    };

    $scope.addCountryVat = function () {
      $scope.formData.countryVats.push({ vatAmounts: [] });
    };

    $scope.addVatAmount = function (countryVat) {
      countryVat.vatAmounts.push({ vatAmount: null });
    };

    $scope.removeVatAmount = function (countryVat, vatAmount) {
      countryVat.vatAmounts = lodash.filter(countryVat.vatAmounts, function (va) {
        return va !== vatAmount;
      });
    };

    $scope.addCabinClass = function () {
      $scope.formData.companyCabinClasses.push({});
    };

    $scope.removeCabinClass = function (cabinClass) {
      $scope.formData.companyCabinClasses = lodash.filter($scope.formData.companyCabinClasses, function (cc) {
        return cc !== cabinClass;
      });
    };

    this.errorHandler = function (dataFromAPI) {
      angular.element('#loading').modal('hide');
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.updateSuccessHandler = function (response) {
      $this.updateFormData(response.company);
      angular.element('#loading').modal('hide');
      angular.element('#update-success').modal('show');
    };

    this.makeUpdatePromises = function (payload) {
      return [
        companiesFactory.updateCompany($routeParams.id, payload)
      ];
    };

    this.updateItem = function (itemData) {
      angular.element('#loading').modal('show').find('p').text('We are updating your item');
      var payload = {
        company: itemData
      };
      var promises = $this.makeUpdatePromises(payload);
      $q.all(promises).then(function (response) {
        $this.updateSuccessHandler(response);
      }, function (error) {

        $this.errorHandler(error);
      });
    };

    this.createCompany = function (companyData) {
      angular.element('#loading').modal('show').find('p').text('We are creating your item');
      var newCompanyPayload = {
        retailItem: companyData
      };
      companiesFactory.createCompany(newCompanyPayload).then(function () {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
        return true;
      }, $this.errorHandler);
    };

    $scope.submitForm = function (formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var companyData = angular.copy(formData);
        var payload = $this.formatPayload(companyData);
        var action = $scope.editingCompany ? 'updateCompany' : 'createCompany';
        $this[action](payload);
      }
    };

    this.validateForm = function () {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    };

    this.formatPayload = function (companyData) {
      return companyData;
    };

    // TODO: MOVE ME GLOBAL
    $scope.formScroll = function (id, activeBtn) {
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

    $scope.setSelected = function (model, id) {
      model = parseInt(model);
      id = parseInt(id);
      return (model === id);
    };

  });
