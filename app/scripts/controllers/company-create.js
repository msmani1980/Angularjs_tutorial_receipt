'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:CompanyCreateCtrl
 * @description
 * # CompanyCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('CompanyCreateCtrl',
  function($scope, $compile, ENV, $resource, $location, $anchorScroll, companiesFactory, currencyFactory, dateUtility,
    languagesService, countriesService, companyTypesService, $routeParams, GlobalMenuService, $q, $filter, lodash) {

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

    var $this = this;

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.errorHandler = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    //TODO: implement updateCompany/Edit functionality
    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/company-edit') !== -1 && $routeParams.id) {
        $scope.editingCompany = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/company-edit') !== -1) {
        $scope.viewOnly = true;
      }
    };

    //TODO: implement updateCompany/Edit functionality
    this.updateViewName = function(company) {
      var prefix = 'Viewing ';

      if ($scope.editingCompany) {
        prefix = 'Editing ';
      }

      $scope.viewName = prefix + company.companyName;
    };

    this.addCommonClass = function() {
      if ($scope.showAdditionalFields) {
        var payload = {
          cabinClass: 'Common',
          code: 'CC',
          cabinClassDescription: 'Common Class',
          readOnly: true
        };
        if (!$scope.formData.companyCabinClasses.length) {
          $scope.formData.companyCabinClasses.push(payload);
        }
      }
    };

    ///TODO: implement updateCompany/Edit functionality
    // gets an company to $scope.editingCompany
    this.getCompany = function(id) {
      $this.showLoadingModal('We are getting your Company data!');
      companiesFactory.getCompany(id).then(function(data) {
        $this.updateViewName(data.company); // TODO: ?
        $this.setUIReady();
      });
    };

    this.calculateFieldsVisibility = function() {
      $scope.showAdditionalFields = ($scope.formData.companyTypeId === '1');
      $this.addCommonClass();
      $scope.showBaseCurrency = lodash.includes(['1', '2', '5'], $scope.formData.companyTypeId);
    };

    this.initWatchers = function() {
      $scope.$watch('formData.companyTypeId', function() {
        $this.calculateFieldsVisibility();
      });
    };

    this.setUIReady = function() {
      $this.hideLoadingModal();
      $scope.uiSelectTemplateReady = true;
    };

    this.initUI = function() {
      $this.checkFormState();
      $this.initWatchers();
      $this.calculateFieldsVisibility();
      return $this.setUIReady();
    };

    this.setDependencies = function(response) {
      $scope.companyTypes = response[0];
      $scope.currencies = response[1].response;
      $scope.companies = response[2].companies;
      $scope.languages = response[3].languages;
      $scope.countries = response[4].countries;
      if ($scope.editingCompany || $scope.cloningCompany || $scope.viewOnly) {
        $this.getCompany($routeParams.id);
      }

      $this.initUI();
    };

    this.makeDependencyPromises = function() {
      return [
        companyTypesService.getCompanyTypes(),
        currencyFactory.getCompanyCurrencies(),
        companiesFactory.getCompanyList(),
        languagesService.getLanguagesList(),
        countriesService.getCountriesList()
      ];
    };

    this.getDependencies = function() {
      $this.showLoadingModal('We are loading data!');
      var dependencyPromises = $this.makeDependencyPromises();
      $q.all(dependencyPromises).then($this.setDependencies, $this.errorHandler);
    };

    this.init = function() {
      $this.getDependencies();
    };

    $this.init();

    this.showSuccessModal = function(state) {
      angular.element('#' + state + '-success').modal('show');
    };

    this.createSuccessHandler = function() {
      $this.hideLoadingModal();
      $this.showSuccessModal('create');
    };

    this.createCompanyCreatePromises = function(payload) {
      return [
        companiesFactory.createCompany(payload)
      ];
    };

    this.createCompany = function(payload) {
      $this.showLoadingModal('We are creating your Company');
      var promises = $this.createCompanyCreatePromises(payload);
      $q.all(promises).then($this.createSuccessHandler, $this.errorHandler);
    };

    //TODO: implement updateCompany/Edit functionality
    this.updateCompany = function(payload) {
      $this.showLoadingModal('We are updating your Company');
      var promises = $this.createCompanyUpdatePromises(payload);
      $q.all(promises).then($this.updateSuccessHandler, $this.errorHandler);
    };

    //TODO: implement updateCompany/Edit functionality
    this.updateSuccessHandler = function() {
      $this.hideLoadingModal();
      $this.showSuccessModal('update');
    };

    //TODO: implement updateCompany/Edit functionality
    this.createCompanyUpdatePromises = function(payload) {
      return [
        companiesFactory.updateCompany($routeParams.id, payload)
      ];
    };

    this.validateForm = function() {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    };

    this.formatCompanyCabinClasses = function(companyData) {
      if (!$scope.showAdditionalFields) {
        delete companyData.companyCabinClasses;
      } else if ($scope.showAdditionalFields) {
        delete companyData.companyCabinClasses[0].readOnly;
      }

      if ($scope.showAdditionalFields && companyData.companyCabinClasses.length) {
        return companyData.companyCabinClasses;
      }

      return;
    };

    this.formatCompanyLanguages = function(languages) {
      var languagesPayload = [];
      angular.forEach(languages, function(language) {
        if (angular.isDefined(language.id)) {
          var id = language.id.toString();
          languagesPayload.push(id);
        }
      });

      return languagesPayload;
    };

    this.formatPayload = function(companyData) {
      var company = angular.copy(companyData);
      company.companyCabinClasses = $this.formatCompanyCabinClasses(company);
      company.languages = $this.formatCompanyLanguages(company.languages);
      company.eposLanguages = $this.formatCompanyLanguages(company.eposLanguages);
      company.isActive = (company.isActive === true) ? company.isActive : false;
      return company;
    };

    //$scope functions
    $scope.addTax = function() {
      if (!$scope.isTaxIdButtonDisabled()) {
        $scope.formData.taxes.push({});
      }
    };

    $scope.removeTax = function(tax) {
      $scope.formData.taxes = lodash.filter($scope.formData.taxes, function(t) {
        return t !== tax;
      });
    };

    $scope.addCountryVat = function() {
      $scope.formData.countryVats.push({
        vatAmounts: []
      });
    };

    $scope.removeCountryVat = function(index) {
      $scope.formData.countryVats = lodash.filter($scope.formData.countryVats, function(cv, key) {
        return key !== index;
      });
    };

    $scope.addVatAmount = function(countryVat) {
      countryVat.vatAmounts.push({
        vatAmount: null
      });
    };

    $scope.removeVatAmount = function(countryVat, vatAmount) {
      countryVat.vatAmounts = lodash.filter(countryVat.vatAmounts, function(va) {
        return va !== vatAmount;
      });
    };

    $scope.addCabinClass = function() {
      $scope.formData.companyCabinClasses.push({});
    };

    $scope.removeCabinClass = function(cabinClass) {
      if (cabinClass.readOnly) {
        return false;
      }

      $scope.formData.companyCabinClasses = lodash.filter($scope.formData.companyCabinClasses, function(cc) {
        return cc !== cabinClass;
      });
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var companyData = angular.copy(formData);
        var payload = $this.formatPayload(companyData);
        var action = $scope.editingCompany ? $this.updateCompany(payload) : $this.createCompany(payload);
        return action;
      }
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

    $scope.setSelected = function(model, id) {
      model = parseInt(model);
      id = parseInt(id);
      return (model === id);
    };

    $scope.isTaxIdButtonDisabled = function() {
      var count = $scope.formData.taxes.length;
      return (count >= 3);
    };

  });
