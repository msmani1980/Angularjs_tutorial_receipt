'use strict';

fdescribe('The Company Create Controller', function() {
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company-create.json',
    'served/company-types.json',
    'served/company-currency-globals.json',
    'served/company-list.json',
    'served/country-list.json',
    'served/languages.json'));

  var CompanyCreateCtrl;
  var $rootScope;
  var $scope;
  var $controller;
  var $location;
  var $httpBackend;
  var companyCreateJSON;

  function createController($injector) {
    $location = $injector.get('$location');
    $location.path('/company-create');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    CompanyCreateCtrl = $controller('CompanyCreateCtrl', {
      $scope: $scope
    });
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

      getCompanyTypesDeferred.resolve();
      getCompanyCurrenciesDeferred.resolve();
      getCompanyListDeferred.resolve();
      getLaunguagesListDeferred.resolve();
      getCountriesListDeferred.resolve();

      spyOn(companyTypesService, 'getCompanyTypes').and.returnValue(responseArray[0]);
      spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(responseArray[1]);
      spyOn(companiesFactory, 'getCompanyList').and.returnValue(responseArray[2]);
      spyOn(languagesService, 'getLanguagesList').and.returnValue(responseArray[3]);
      spyOn(countriesService, 'getCountriesList').and.returnValue(responseArray[4]);
      createController($injector);
      getDependenciesDeferred.resolve(responseArray);
    }));

    it('should expect dependencies to be empty', function() {
      expect($scope.companyTypes).toBeUndefined();
      expect($scope.currencies).toBeUndefined();
      expect($scope.companies).toBeUndefined();
      expect($scope.languages).toBeUndefined();
      expect($scope.countries).toBeUndefined();
    });

    describe('setDependencies', function() {
      beforeEach(function() {
        spyOn(CompanyCreateCtrl, 'setDependencies').and.callThrough();
        CompanyCreateCtrl.getDependencies();
        $scope.$digest();
      });
      it('should have been called setDependencies after the promises are resolved', function() {
        expect(CompanyCreateCtrl.setDependencies).toHaveBeenCalled();
      });
      it('should set all dependencies', function() {
        expect($scope.companyTypes).toBeDefined();
        expect($scope.currencies).toBeDefined();
        expect($scope.companies).toBeDefined();
        expect($scope.languages).toBeDefined();
        expect($scope.countries).toBeDefined();
      });
    });

  });

  describe('The formData collection', function() {
    it('should be defined', function() {
      expect($scope.formData).toBeDefined();
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
        $scope.showAdditionalFields = true;
        company = CompanyCreateCtrl.formatPayload(payload);
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
        $scope.showAdditionalFields = false;
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

  describe('Taxes', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should return true if count is 3', function() {
      $scope.formData.taxes = companyCreateJSON.taxes;
      expect($scope.isTaxIdButtonDisabled()).toBeTruthy();
    });
    it('should return false if one is removed and if count is 0', function() {
      $scope.formData.taxes = companyCreateJSON.taxes;
      $scope.removeTax(companyCreateJSON.taxes[0]);
      expect($scope.isTaxIdButtonDisabled()).toBeFalsy();
    });
    it('should add a new tax', function() {
      $scope.formData.taxes = companyCreateJSON.taxes;
      $scope.removeTax(companyCreateJSON.taxes[0]);
      $scope.addTax();
      expect($scope.formData.taxes.length).toEqual(3);
    });
    it('should not allow user to add a new tax', function() {
      $scope.formData.taxes = companyCreateJSON.taxes;
      $scope.addTax();
      expect($scope.formData.taxes.length).toEqual(3);
    });
  });


  describe('Country VAT', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should be empty', function() {
      expect($scope.formData.countryVats.length).toBe(0);
    });
    it('should add a Country VAT', function() {
      $scope.addCountryVat();
      expect($scope.formData.countryVats.length).toBe(1);
    });
    it('should remove a Country VAT', function() {
      $scope.addCountryVat();
      $scope.removeCountryVat($scope.formData.countryVats[0]);
      expect($scope.formData.countryVats.length).toBe(0);
    });
    it('should add a VAT Amount', function() {
      $scope.addCountryVat();
      $scope.addVatAmount($scope.formData.countryVats[0]);
      expect($scope.formData.countryVats[0].vatAmounts.length).toBe(1);
    });
    it('should remove a VAT Amount', function() {
      $scope.addCountryVat();
      $scope.addVatAmount($scope.formData.countryVats[0]);
      $scope.removeVatAmount($scope.formData.countryVats[0], $scope.formData.countryVats[0].vatAmounts[0]);
      expect(
        $scope.formData.countryVats[0].vatAmounts[0]).toBeUndefined();
    });
  });

  describe('$scope.uiSelectTemplateReady variable', function() {
    it('should be defined', function() {
      expect($scope.uiSelectTemplateReady).toBeDefined();
    });
    it('should return false', function() {
      expect($scope.uiSelectTemplateReady).toBeFalsy();
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
      expect($scope.errorResponse).toEqual(mockError);
    });
    it('should return false', function() {
      expect($scope.displayError).toBeTruthy();
    });
  });

  describe('setSelected', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));
    it('should return false if model and id do not match', function() {
      expect($scope.setSelected(3, 1)).toBeFalsy();
    });
    it('should return true if model and id match', function() {
      expect($scope.setSelected(3, 3)).toBeTruthy();
    });
    it('should return true if model and id match, even if one is not an int', function() {
      expect($scope.setSelected(3, '3')).toBeTruthy();
    });
  });

});
