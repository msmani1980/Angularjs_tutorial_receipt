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

    $scope.companyTypes = [];
    $scope.currencies = [];
    $scope.companies = [];
    $scope.languages = [];
    $scope.countries = [];
    $scope.companyTypes = [];

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function errorHandler(dataFromAPI) {
      console.log(dataFromAPI);
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    function checkFormState() {
      var path = $location.path();
      if (path.search('/company-edit') !== -1 && $routeParams.id) {
        $scope.editingCompany = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/company-edit') !== -1) {
        $scope.viewOnly = true;
      }
    }

    function calculateFieldsVisibility() {
      $scope.showAdditionalFields = ($scope.formData.companyTypeId === '1');
      $scope.showBaseCurrency = lodash.includes(['1', '2', '5'], $scope.formData.companyTypeId);
    }

    function init() {
      checkFormState();
      getDependencies();
      calculateFieldsVisibility();
    }

    function updateViewName(company) {
      var prefix = 'Viewing ';

      if ($scope.editingCompany) {
        prefix = 'Editing ';
      }

      $scope.viewName = prefix + company.companyName;
    }

    // gets an company to $scope.editingCompany
    function getCompany(id) {
      showLoadingModal('We are getting your Company data!');
      companiesFactory.getCompany(id).then(function(data) {
        updateViewName(data.company); // TODO: ?
        setUIReady();
      });
    }

    function setUIReady() {
      $scope.uiSelectTemplateReady = true;
      hideLoadingModal();
    }

    function setDependencies(response) {
      $scope.companyTypes = response[0];
      $scope.currencies = response[1].response;
      $scope.companies = response[2].companies;
      $scope.languages = response[3].languages;
      $scope.countries = response[4].countries;
      if ($scope.editingCompany || $scope.cloningCompany || $scope.viewOnly) {
        getCompany($routeParams.id);
      }

      return setUIReady();
    }

    function makeDependencyPromises() {
      return [
        companyTypesService.getCompanyTypes(),
        currencyFactory.getCompanyCurrencies(),
        companiesFactory.getCompanyList(),
        languagesService.getLanguagesList(),
        countriesService.getCountriesList()
      ];
    }

    function getDependencies() {
      showLoadingModal('We are loading data!');
      var dependencyPromises = makeDependencyPromises();
      $q.all(dependencyPromises).then(setDependencies, errorHandler);
    }

    init();

    function createSuccessHandler() {
      hideLoadingModal();
      angular.element('#create-success').modal('show');
    }

    function updateSuccessHandler(response) {
      console.log(response);
      hideLoadingModal();
      angular.element('#update-success').modal('show');
    }

    function createCompanyUpdatePromises(payload) {
      return [
        companiesFactory.updateCompany($routeParams.id, payload)
      ];
    }

    function createCompanyCreatePromises() {
      var payload = angular.copy($scope.formData);
      return [
        companiesFactory.createCompany(payload)
      ];
    }

    function updateCompany(payload) {
      showLoadingModal('We are updating your Company');
      var promises = createCompanyUpdatePromises(payload);
      $q.all(promises).then(updateSuccessHandler, errorHandler);
    }

    function createCompany() {
      showLoadingModal('We are creating your Company');
      var promises = createCompanyCreatePromises();
      $q.all(promises).then(createSuccessHandler, errorHandler);
    }

    function validateForm() {
      $scope.displayError = !$scope.form.$valid;
      return $scope.form.$valid;
    }

    function formatPayload(companyData) {
      return companyData;
    }

    //$scope functions. these will become this.functionName() in v2

    $scope.$watch('formData.companyTypeId', function() {
      calculateFieldsVisibility();
    });

    $scope.addTax = function() {
      $scope.formData.taxes.push({});
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

    $scope.addVatAmount = function(countryVat) {
      countryVat.vatAmounts.push({
        vatAmount: null
      });
    };

    $scope.addCountryVat = function() {
      $scope.formData.countryVats.push({
        vatAmounts: []
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
      $scope.formData.companyCabinClasses = lodash.filter($scope.formData.companyCabinClasses, function(cc) {
        return cc !== cabinClass;
      });
    };

    $scope.removeCountryVat = function(index) {
      $scope.formData.countryVats = lodash.filter($scope.formData.countryVats, function(cv, key) {
        return key !== index;
      });
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && validateForm()) {
        var companyData = angular.copy(formData);
        var payload = formatPayload(companyData);
        return $scope.editingCompany ? updateCompany(payload) : createCompany();
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

  });
