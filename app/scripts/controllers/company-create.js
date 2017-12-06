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
    languagesService, countriesService, companyTypesService, $routeParams, globalMenuService, $q, $filter, lodash, imageLogoService, messageService) {

    $scope.formData = {
      startDate: dateUtility.tomorrowFormattedDatePicker(),
      endDate: dateUtility.tomorrowFormattedDatePicker(),
      images: [],
      taxes: [],
      languages: [],
      eposLanguages: [],
      countryVats: [],
      companyCabinClasses: []
    };

    $scope.timezone = '';
    $scope.viewName = 'Create Company';
    $scope.buttonText = 'Create';
    $scope.companyIsActive = false;
    $scope.companyIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingCompany = false;
    $scope.uiSelectTemplateReady = false;
    $scope.receiptImageArray = [];
    $scope.companyLogoArray = [];

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

    this.checkForDefaultLanguage = function(languages) {
      if (!languages.length) {
        return false;
      }

      var containsDefault = false;
      angular.forEach(languages, function(language) {
        if (language.id === 1) {
          containsDefault = true;
        }
      });

      return containsDefault;
    };

    this.calculateFieldsVisibility = function() {
      $scope.showAdditionalFields = ($scope.formData.companyTypeId === '1');
      if ($scope.showAdditionalFields) {
        $this.addCommonClass();
      }

      $scope.showBaseCurrency = lodash.includes(['1', '2', '5'], $scope.formData.companyTypeId);
    };

    this.checkFormState = function() {
      var path = $location.path();
      if (path.search('/company-edit') !== -1 && $routeParams.id) {
        $scope.editingCompany = true;
        $scope.buttonText = 'Save';
      } else if (path.search('/company-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.findLanguagesIndex = function(languageId) {
      var languagesIndex = null;
      for (var key in $scope.languages) {
        var language = $scope.languages[key];
        if (parseInt(language.id) === parseInt(languageId)) {
          languagesIndex = key;
          break;
        }
      }

      return languagesIndex;
    };

    this.formatLanguagesForApp = function(languages) {
      if (languages !== undefined && !languages.length) {
        return [];
      }

      var languagePayload = [];
      for (var languageKey in languages) {
        var language = languages[languageKey];
        if (language !== 1) {

          var index = $this.findLanguagesIndex(language);
          var payload = {
            id: language,
            languageName: $scope.languages[index].languageName,
            languageCode: $scope.languages[index].languageCode
          };
          languagePayload.push(payload);
        }
      }

      return languagePayload;
    };

    this.setCompanyCabinClassReadOnly = function(companyCabinClasses) {
      var payload = [];

      angular.forEach(companyCabinClasses, function(companyCabinClass, key) {
        if (key === 0) {
          companyCabinClass.readOnly = true;
        }

        payload.push(companyCabinClass);
      });

      return payload;
    };

    this.setString = function(data) {
      if (!data) {
        return null;
      } else if (angular.isDefined(data)) {
        return data.toString();
      }
    };

    this.setCountryVat = function(countryVats) {
      if (!countryVats) {
        return null;
      } else if (angular.isDefined(countryVats)) {
        var payload = [];
        angular.forEach(countryVats, function(countryVat) {
          var vat = {
            companyId: countryVat.companyId,
            countryId: $this.setString(countryVat.countryId),
            id: countryVat.id,
            vatAmounts: countryVat.vatAmounts
          };
          payload.push(vat);
        });

        return payload;
      }
    };

    this.updateFormData = function(data) {
      if (!data) {
        return false;
      }

      var company = angular.copy(data);
      $scope.getCompanyImages(company.id, company.companyTypeId);
      $scope.formData = {
        baseCurrencyId: $this.setString(company.baseCurrencyId),
        companyTypeId: $this.setString(company.companyTypeId),
        changeDueRoundingOptionId: $this.setString(company.changeDueRoundingOptionId),
        companyCabinClasses: company.companyCabinClasses ? $this.setCompanyCabinClassReadOnly(company.companyCabinClasses) : null,
        companyCode: $this.setString(company.companyCode),
        companyName: $this.setString(company.companyName),
        countryVats: $this.setCountryVat(company.countryVats),
        dbaName: $this.setString(company.dbaName),
        ediName: $this.setString(company.ediName),
        eposLanguages: $this.formatLanguagesForApp(company.eposLanguages),
        exchangeRateVariance: $this.setString(company.exchangeRateVariance),
        id: company.id,
        isActive: company.isActive,
        languages: $this.formatLanguagesForApp(company.languages),
        legalName: $this.setString(company.legalName),
        parentCompanyId: $this.setString(company.parentCompanyId),
        roundingOptionId: $this.setString(company.roundingOptionId),
        taxes: company.taxes ? company.taxes : null,
        timezone: company.timezone !== null ? company.timezone.toString() : null,
        startDate: dateUtility.tomorrowFormattedDatePicker(),
        endDate: dateUtility.tomorrowFormattedDatePicker(),
        images: []
      };

    };

    this.getCompany = function(id) {
      $this.showLoadingModal('We are getting your Company data!');
      companiesFactory.getCompany(id).then(function(data) {
        $this.updateViewName(data);
        $this.updateFormData(data);
        $this.initUI();
      });
    };

    this.updateViewName = function(company) {
      var prefix = 'Viewing ';

      if ($scope.editingCompany) {
        prefix = 'Editing ';
      }

      $scope.viewName = prefix + company.companyName;
    };

    this.initWatchers = function() {
      $scope.$watch('formData.companyTypeId', function(newValue, oldValue) {
        $this.updateImagesArray(newValue, oldValue);
        $this.calculateFieldsVisibility();
      });
      $scope.$watch('formData.startDate', function(newValue, oldValue) {
        $this.updateDate(newValue, oldValue);
      });
    };

    this.updateDate = function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.formData.startDate = dateUtility.tomorrowFormattedDatePicker();
        $scope.formData.endDate = dateUtility.tomorrowFormattedDatePicker();
      }
    };

    this.updateImagesArray = function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!$scope.editingCompany) {
          $scope.formData.images = [];
        } else if ($scope.editingCompany) {
          $scope.sortImageArrays(parseInt($scope.formData.companyTypeId));
        }
      }
    };

    $scope.getCompanyImages = function(companyId, companyCode) {
      imageLogoService.getImageLogo(companyId).then(function (data) {
       var tempArray = data.response;
       $scope.receiptImageArray = [];
       $scope.companyLogoArray = [];
       $scope.formatImageDates(tempArray);
       for (var index in tempArray) {
         if (tempArray[index].type === 2) {
           $scope.receiptImageArray.push(tempArray[index]);

         } else if (tempArray[index].type === 4) {
           $scope.companyLogoArray.push(tempArray[index]);
         }
       }

       $scope.sortImageArrays(companyCode);
     });
    };

    $scope.sortImageArrays = function(companyCode) {
      $scope.formData.images = [];
      if (companyCode === 6) {
        $scope.formData.images = $scope.receiptImageArray;
      } else if (companyCode === 1) {
        $scope.formData.images = $scope.companyLogoArray;
      }
    };

    this.setUIReady = function() {
      $this.hideLoadingModal();
      $scope.minDate = $this.determineMinDate();
      $scope.uiSelectTemplateReady = true;
    };

    this.determineMinDate = function() {
      var diff = 1;
      if (!dateUtility.isTomorrowOrLaterDatePicker($scope.formData.startDate)) {
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

    this.initUI = function() {
      $this.initWatchers();
      return $this.setUIReady();
    };

    this.removeDefaultLanguage = function(languages) {
      var payload = [];
      angular.forEach(languages, function(language) {
        if (parseInt(language.id) !== 1) {
          payload.push(language);
        }
      });

      return payload;
    };

    this.setDependencies = function(response) {
      $scope.companyTypes = response[0];
      $scope.currencies = response[1].response;
      $scope.companies = response[2].companies;
      $scope.languages = $this.removeDefaultLanguage(response[3]);
      $scope.countries = response[4].countries;
      if ($scope.editingCompany || $scope.viewOnly) {
        return $this.getCompany($routeParams.id);
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
      $this.checkFormState();
    };

    $this.init();

    this.showSuccessModal = function(state) {
      angular.element('#' + state + '-success').modal('show');
      if ($scope.editingCompany) {
        $scope.getCompanyImages($scope.formData.id, parseInt($scope.formData.companyTypeId));
      }
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

    this.updateCompany = function(payload) {
      $this.showLoadingModal('We are updating your Company');
      var promises = $this.createCompanyUpdatePromises(payload);
      $q.all(promises).then($this.updateSuccessHandler, $this.errorHandler);
    };

    this.updateSuccessHandler = function() {
      $this.hideLoadingModal();
      $this.showSuccessModal('update');
    };

    this.createCompanyUpdatePromises = function(payload) {
      var id = angular.copy(payload.id);
      return [
        companiesFactory.updateCompany(id, payload)
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

    this.formatCountryVats = function(countryVats) {
      if (!countryVats) {
        return null;
      } else if (angular.isDefined(countryVats)) {
        var payload = [];
        angular.forEach(countryVats, function(countryVat) {
          var vat = {
            companyId: countryVat.companyId,
            countryId: parseInt(countryVat.countryId),
            id: countryVat.id,
            vatAmounts: countryVat.vatAmounts
          };
          payload.push(vat);
        });

        return payload;
      }
    };

    this.formatInt = function(data) {
      if (!data) {
        return null;
      } else if (angular.isDefined(data)) {
        return parseInt(data);
      }
    };

    this.formatActive = function(data) {
      return (data === true) ? data : false;
    };

    this.formatPayload = function(companyData) {
      var company = angular.copy(companyData);
      company.companyCabinClasses = $this.formatCompanyCabinClasses(company);
      company.isActive = $this.formatActive(company.isActive);
      company.baseCurrencyId = $this.formatInt(company.baseCurrencyId);
      company.companyTypeId = $this.formatInt(company.companyTypeId);
      company.languages = $this.formatCompanyLanguages(company.languages);
      company.eposLanguages = $this.formatCompanyLanguages(company.eposLanguages);
      company.countryVats = $this.formatCountryVats(company.countryVats);
      company.timezone = company.timezone;
      return company;
    };

    //$scope functions
    $scope.addTax = function() {
      if (!$scope.viewOnly) {
        if (!$scope.isTaxIdButtonDisabled()) {
          $scope.formData.taxes.push({});
        }
      }
    };

    $scope.removeTax = function(tax) {
      if (!$scope.viewOnly) {
        $scope.formData.taxes = lodash.filter($scope.formData.taxes, function(t) {
          return t !== tax;
        });
      }
    };

    $scope.addCountryVat = function() {
      if (!$scope.viewOnly) {
        $scope.formData.countryVats.push({
          vatAmounts: []
        });
      }
    };

    $scope.removeCountryVat = function(index) {
      if (!$scope.viewOnly) {
        $scope.formData.countryVats = lodash.filter($scope.formData.countryVats, function(cv, key) {
          return key !== index;
        });
      }
    };

    $scope.addVatAmount = function(countryVat) {
      if (!$scope.viewOnly) {
        countryVat.vatAmounts.push({
          vatAmount: null
        });
      }
    };

    $scope.removeVatAmount = function(countryVat, vatAmount) {
      if (!$scope.viewOnly) {
        countryVat.vatAmounts = lodash.filter(countryVat.vatAmounts, function(va) {
          return va !== vatAmount;
        });
      }
    };

    $scope.addCabinClass = function() {
      if (!$scope.viewOnly) {
        $scope.formData.companyCabinClasses.push({});
      }
    };

    $scope.removeCabinClass = function(cabinClass) {
      if (cabinClass.readOnly) {
        return false;
      }

      if (!$scope.viewOnly) {
        $scope.formData.companyCabinClasses = lodash.filter($scope.formData.companyCabinClasses, function(cc) {
          return cc !== cabinClass;
        });
      }

    };

    $scope.submitForm = function(formData) {
      if ($scope.formData.images[0] !== undefined && $scope.formData.companyTypeId !== '1') {
        for (var i in $scope.formData.images) {
          $scope.formData.images[i].type = 2;
        }
      } else if ($scope.formData.images[0] !== undefined && $scope.formData.companyTypeId !== '6') {
        for (var i in $scope.formData.images) {
          $scope.formData.images[i].type = 4;
        }
      }

      if ($scope.validateDate()) {
        this.formatPayloadDates(formData);
        this.formatImagePayloadDates(formData);
        $scope.form.$setSubmitted(true);
        if (formData && $this.validateForm()) {
          var companyData = angular.copy(formData);
          var payload = $this.formatPayload(companyData);
          var action = $scope.editingCompany ? $this.updateCompany(payload) : $this.createCompany(payload);
          return action;
        }
      }

    };

    $scope.validateDate = function () {
      if ($scope.formData.images[0] !== undefined) {
        var imageNumber = 0;
        for (var i in $scope.formData.images) {
          var start = $scope.formData.images[i].startDate;
          var end = $scope.formData.images[i].endDate;
          start = start.split(/\D/);
          end = end.split(/\D/);
          var startDate = new Date(start[1] + '/' + start[0] + '/' + start[2]);
          var endDate = new Date(end[1] + '/' + end[0] + '/' + end[2]);
          imageNumber++;
          if (startDate > endDate) {
            messageService.display('danger', 'To date should be later than or equal to From date', 'Saved Image ' + imageNumber);
            return false;
          }

        }

        return true;
      } else {
        return true;
      }
    };

    $scope.formatImagePayloadDates = function(formData) {
      for (var imageIndex in formData.images) {
        var image = formData.images[imageIndex];
        image.startDate = dateUtility.formatDateForAPI(image.startDate);
        image.endDate = dateUtility.formatDateForAPI(image.endDate);
      }
    };

    $scope.formatPayloadDates = function(formData) {
      formData.startDate = dateUtility.formatDateForAPI(formData.startDate);
      formData.endDate = dateUtility.formatDateForAPI(formData.endDate);
    };

    $scope.formatImageDates = function(images) {
      angular.forEach(images, function(image) {
        image.startDate = dateUtility.formatDateForApp(image.startDate);
        image.endDate = dateUtility.formatDateForApp(image.endDate);
      });
    };

    $scope.removeImage = function(key) {
      $scope.formData.images.splice(key, 1);
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
      var count = ($scope.formData.taxes !== undefined && $scope.formData.taxes !== null ? $scope.formData.taxes.length : 0);
      return (count >= 3);
    };

  });
