'use strict';

describe('The Company Create Controller', function() {

  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company-create.json'));
  beforeEach(module('served/company-types.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/company-list.json'));
  beforeEach(module('served/country-list.json'));
  beforeEach(module('served/languages.json'));

  var CompanyCreateCtrl;
  var $rootScope;
  var scope;
  var $controller;
  var $location;
  var $httpBackend;
  var companyCreateJSON;

  function createController($injector, state) {
    var params = {
      state: (state ? state : 'create')
    };
    if (params.state === 'edit') {
      params.id = 1;
    }
    $location = $injector.get('$location');
    $location.path('/company-' + params.state);
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    CompanyCreateCtrl = $controller('CompanyCreateCtrl', {
      $scope: scope,
      $routeParams: params
    });
  }

  function renderView($templateCache, $compile) {
    var html = $templateCache.get('/views/company-create.html');
    var compiled = $compile(angular.element(html))(scope);
    var view = angular.element(compiled[0]);
    return view;
  }

  describe('The CompanyCreateCtrl', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should be defined', function() {
      expect(CompanyCreateCtrl).toBeDefined();
    });
    it('should have a the route /company-create', function() {
      expect($location.path()).toBe('/company-create');
    });
  });

  describe('getDependencies() method', function() {
    var responseArray;
    var companiesFactory;
    var currencyFactory;
    var companyTypesService;
    var languagesService;
    var countriesService;
    var getCompanyTypesDeferred;
    var getCompanyCurrenciesDeferred;
    var getCompanyListDeferred;
    var getLaunguagesListDeferred;
    var getCountriesListDeferred;
    var getDependenciesDeferred;

    beforeEach(inject(function($injector, $q, $rootScope, _servedCompanyTypes_, _servedCompanyCurrencyGlobals_,
      _servedCompanyList_, _servedLanguages_, _servedCountryList_) {

      responseArray = [
        _servedCompanyTypes_,
        _servedCompanyCurrencyGlobals_,
        _servedCompanyList_,
        _servedLanguages_,
        _servedCountryList_
      ];

      companiesFactory = $injector.get('companiesFactory');
      currencyFactory = $injector.get('currencyFactory');
      companyTypesService = $injector.get('companyTypesService');
      languagesService = $injector.get('languagesService');
      countriesService = $injector.get('countriesService');

      getCompanyTypesDeferred = $q.defer();
      getCompanyCurrenciesDeferred = $q.defer();
      getCompanyListDeferred = $q.defer();
      getLaunguagesListDeferred = $q.defer();
      getCountriesListDeferred = $q.defer();
      getDependenciesDeferred = $q.defer();

      spyOn(companyTypesService, 'getCompanyTypes').and.returnValue(responseArray[0]);
      spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(responseArray[1]);
      spyOn(companiesFactory, 'getCompanyList').and.returnValue(responseArray[2]);
      spyOn(languagesService, 'getLanguagesList').and.returnValue(responseArray[3]);
      spyOn(countriesService, 'getCountriesList').and.returnValue(responseArray[4]);

      getCompanyTypesDeferred.resolve();
      getCompanyCurrenciesDeferred.resolve();
      getCompanyListDeferred.resolve();
      getLaunguagesListDeferred.resolve();
      getCountriesListDeferred.resolve();
      getDependenciesDeferred.resolve(responseArray);
      createController($injector);

    }));

    it('should expect dependencies to be empty', function() {
      expect(scope.companyTypes).toBeUndefined();
      expect(scope.currencies).toBeUndefined();
      expect(scope.companies).toBeUndefined();
      expect(scope.languages).toBeUndefined();
      expect(scope.countries).toBeUndefined();
    });

    describe('setDependencies', function() {
      beforeEach(function() {
        spyOn(CompanyCreateCtrl, 'setDependencies').and.callThrough();
        CompanyCreateCtrl.getDependencies();
        scope.$digest();
      });
      it('should have been called setDependencies after the promises are resolved', function() {
        expect(CompanyCreateCtrl.setDependencies).toHaveBeenCalled();
      });
      it('should set all dependencies', function() {
        expect(scope.companyTypes).toBeDefined();
        expect(scope.currencies).toBeDefined();
        expect(scope.companies).toBeDefined();
        expect(scope.languages).toBeDefined();
        expect(scope.countries).toBeDefined();
      });
    });
  });

  describe('The formData collection', function() {
    it('should be defined', function() {
      expect(scope.formData).toBeDefined();
    });

    describe('The formatPayload method', function() {
      var payload;
      var company;
      beforeEach(inject(function(_servedCompanyCreate_) {
        companyCreateJSON = _servedCompanyCreate_;
        payload = {
          languages: [{
            id: 4,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 3,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }],
          companyCabinClasses: [{
            cabinClass: 'Common',
            code: 'CC',
            cabinClassDescription: 'Common Class'
          }],
          eposLanguages: [{
            id: 3,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 5,
            languageCode: 'de',
            languageName: 'German (Standard)'
          }]
        };
        scope.showAdditionalFields = true;
        company = CompanyCreateCtrl.formatPayload(payload);
        spyOn(CompanyCreateCtrl, 'formatCompanyCabinClasses').and.callThrough();
      }));
      it('should format the languages', function() {
        expect(company.languages).toEqual(companyCreateJSON.languages);
      });
      it('should format the eposLanguages', function() {
        expect(company.eposLanguages).toEqual(companyCreateJSON.eposLanguages);
      });
      it('should return companyCabinClasses ', function() {
        expect(company.companyCabinClasses).toEqual(companyCreateJSON.companyCabinClasses);
      });
    });

    describe('The formatPayload method without additional fields', function() {
      var payload;
      var company;
      beforeEach(inject(function(_servedCompanyCreate_) {
        scope.showAdditionalFields = false;
        companyCreateJSON = _servedCompanyCreate_;
        payload = {
          languages: [{
            id: 4,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 3,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }],
          companyCabinClasses: [{
            cabinClass: 'Common',
            code: 'CC',
            cabinClassDescription: 'Common Class'
          }],
          eposLanguages: [{
            id: 3,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 5,
            languageCode: 'de',
            languageName: 'German (Standard)'
          }]
        };
        company = CompanyCreateCtrl.formatPayload(payload);
      }));
      it('should format the languages', function() {
        expect(company.languages).toEqual(companyCreateJSON.languages);
      });
      it('should format the eposLanguages', function() {
        expect(company.eposLanguages).toEqual(companyCreateJSON.eposLanguages);
      });
      it('should return companyCabinClasses  as undefined', function() {
        expect(company.companyCabinClasses).toEqual(undefined);
      });
    });
  });

  describe('scope.submitForm - createCompany', function() {
    var createCompanyDeferred;
    var response = [];
    beforeEach(inject(function($injector, $q, $templateCache, $compile) {
      renderView($templateCache, $compile);
      createCompanyDeferred = $q.defer();
      spyOn(CompanyCreateCtrl, 'createCompany').and.callThrough();
      spyOn(CompanyCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(CompanyCreateCtrl, 'validateForm').and.callThrough();
      scope.formData = angular.copy(companyCreateJSON);
      scope.submitForm(scope.formData);
      $httpBackend.when('POST').respond(response.$promise);
    }));
    it('should call validateForm', function() {
      expect(CompanyCreateCtrl.validateForm).toHaveBeenCalled();
    });
    it('should call createCompany', function() {
      createCompanyDeferred.resolve();
      var payload = CompanyCreateCtrl.formatPayload(companyCreateJSON);
      expect(CompanyCreateCtrl.createCompany).toHaveBeenCalledWith(payload);
    });
  });

  describe('scope.submitForm - updateCompany', function() {
    var updateCompanyDeferred;
    var response = [];
    beforeEach(inject(function($injector, $q, $templateCache, $compile) {
      renderView($templateCache, $compile);
      updateCompanyDeferred = $q.defer();
      scope.editingCompany = true;
      spyOn(CompanyCreateCtrl, 'updateCompany').and.callThrough();
      spyOn(CompanyCreateCtrl, 'formatPayload').and.callThrough();
      spyOn(CompanyCreateCtrl, 'validateForm').and.callThrough();
      scope.formData = angular.copy(companyCreateJSON);
      scope.submitForm(scope.formData);
      $httpBackend.when('POST').respond(response.$promise);
    }));
    it('should call validateForm', function() {
      expect(CompanyCreateCtrl.validateForm).toHaveBeenCalled();
    });
    it('should call updateCompany', function() {
      updateCompanyDeferred.resolve();
      var payload = CompanyCreateCtrl.formatPayload(companyCreateJSON);
      expect(CompanyCreateCtrl.updateCompany).toHaveBeenCalledWith(payload);
    });
  });

  describe('Taxes', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should return true if count is 3', function() {
      scope.formData.taxes = companyCreateJSON.taxes;
      expect(scope.isTaxIdButtonDisabled()).toBeTruthy();
    });
    it('should return false if one is removed and if count is 0', function() {
      scope.formData.taxes = companyCreateJSON.taxes;
      scope.removeTax(companyCreateJSON.taxes[0]);
      expect(scope.isTaxIdButtonDisabled()).toBeFalsy();
    });
    it('should add a new tax', function() {
      scope.formData.taxes = companyCreateJSON.taxes;
      scope.removeTax(companyCreateJSON.taxes[0]);
      scope.addTax();
      expect(scope.formData.taxes.length).toEqual(3);
    });
    it('should not allow user to add a new tax', function() {
      scope.formData.taxes = companyCreateJSON.taxes;
      scope.addTax();
      expect(scope.formData.taxes.length).toEqual(3);
    });
  });

  describe('Country VAT', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should be empty', function() {
      expect(scope.formData.countryVats.length).toBe(0);
    });
    it('should add a Country VAT', function() {
      scope.addCountryVat();
      expect(scope.formData.countryVats.length).toBe(1);
    });
    it('should remove a Country VAT', function() {
      scope.formData.countryVats = angular.copy(companyCreateJSON.countryVats);
      scope.removeCountryVat(scope.formData.countryVats[0]);
      expect(scope.formData.countryVats.length).toBe(1);
    });
    it('should add a VAT Amount', function() {
      scope.addCountryVat();
      scope.addVatAmount(scope.formData.countryVats[0]);
      expect(scope.formData.countryVats[0].vatAmounts.length).toBe(1);
    });
    it('should remove a VAT Amount', function() {
      scope.addCountryVat();
      scope.addVatAmount(scope.formData.countryVats[0]);
      scope.removeVatAmount(scope.formData.countryVats[0], scope.formData.countryVats[0].vatAmounts[0]);
      expect(
        scope.formData.countryVats[0].vatAmounts[0]).toBeUndefined();
    });
  });

  describe('addCabinClass and add companyCabinClass', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should be empty', function() {
      expect(scope.formData.companyCabinClasses).toEqual([]);
    });
    it('scope.addCabinClass should add a class', function() {
      scope.addCabinClass();
      expect(scope.formData.companyCabinClasses.length).toBe(1);
    });
    it('scope.removeCabinClass should return false if readOnly', function() {
      scope.addCabinClass();
      var cabin = companyCreateJSON.companyCabinClasses[0];
      cabin.readOnly = true;
      expect(scope.removeCabinClass(cabin)).toBeFalsy();
    });
    it('scope.removeCabinClass should remove a class', function() {
      scope.addCabinClass();
      scope.removeCabinClass(scope.formData.companyCabinClasses[0]);
      expect(scope.formData.companyCabinClasses.length).toBe(0);
    });
  });

  describe('scope.uiSelectTemplateReady variable', function() {
    it('should be defined', function() {
      expect(scope.uiSelectTemplateReady).toBeDefined();
    });
    it('should return false', function() {
      expect(scope.uiSelectTemplateReady).toBeFalsy();
    });
  });

  describe('calculateFieldsVisibility', function() {
    beforeEach(function() {
      scope.formData.companyTypeId = '1';
      spyOn(CompanyCreateCtrl, 'calculateFieldsVisibility').and.callThrough();
      spyOn(CompanyCreateCtrl, 'addCommonClass').and.callThrough();
      CompanyCreateCtrl.calculateFieldsVisibility();
    });
    it('should set showAdditionalFields to true', function() {
      expect(scope.showAdditionalFields).toBeTruthy();
    });
    it('should call addCommonClass', function() {
      expect(CompanyCreateCtrl.addCommonClass).toHaveBeenCalled();
    });
  });

  describe('addCommonClass', function() {
    var payload = {
      cabinClass: 'Common',
      code: 'CC',
      cabinClassDescription: 'Common Class',
      readOnly: true
    };
    beforeEach(function() {
      spyOn(CompanyCreateCtrl, 'addCommonClass').and.callThrough();
    });
    it('should add the common class to companyCabinClasses', function() {
      scope.showAdditionalFields = true;
      CompanyCreateCtrl.addCommonClass();
      expect(scope.formData.companyCabinClasses[0]).toEqual(payload);
    });
    it('should add the common class to companyCabinClasses', function() {
      scope.formData.companyCabinClasses = [];
      scope.showAdditionalFields = false;
      CompanyCreateCtrl.addCommonClass();
      expect(scope.formData.companyCabinClasses.length).toBe(0);
    });
  });

  describe('setSelected', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should return false if model and id do not match', function() {
      expect(scope.setSelected(3, 1)).toBeFalsy();
    });
    it('should return true if model and id match', function() {
      expect(scope.setSelected(3, 3)).toBeTruthy();
    });
    it('should return true if model and id match, even if one is not an int', function() {
      expect(scope.setSelected(3, '3')).toBeTruthy();
    });
  });

  describe('the error handler', function() {
    var mockError;
    beforeEach(function() {
      mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'bogan',
          code: '000'
        }
      };
      CompanyCreateCtrl.errorHandler(mockError);
    });
    it('should set error data ', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });
    it('should return false', function() {
      expect(scope.displayError).toBeTruthy();
    });
  });

  describe('checkFormState state as view', function() {
    beforeEach(inject(function($injector) {
      spyOn(CompanyCreateCtrl, 'checkFormState').and.callThrough();
      createController($injector, 'view');
    }));
    it('should set viewOnly to true', function() {
      expect(scope.viewOnly).toBeTruthy();
    });
  });

  describe('checkFormState state as edit', function() {
    beforeEach(inject(function($injector) {
      spyOn(CompanyCreateCtrl, 'checkFormState').and.callThrough();
      createController($injector, 'edit');
    }));
    it('should set editingCompany to true', function() {
      expect(scope.editingCompany).toBeTruthy();
    });
    it('should set buttonText to Save ', function() {
      expect(scope.buttonText).toBe('Save');
    });
  });

});
