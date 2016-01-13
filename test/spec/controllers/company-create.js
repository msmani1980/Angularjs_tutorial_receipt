'use strict';

fdescribe('The Company Create Controller', function() {

  // load the controller's module
  //TODO:remove all retail item junk
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module('served/company-create.json'));

  var $rootScope, $scope, $controller, $location, CompanyCreateCtrl, $httpBackend;
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
  /*
    function renderView($templateCache, $compile) {
      var html = $templateCache.get('/views/company-create.html');
      var compiled = $compile(angular.element(html))($scope);
      var view = angular.element(compiled[0]);
      $scope.$digest();
      return view;
    }
  */
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

  describe('The formData collection', function() {
    it('should be defined', function() {
      expect($scope.formData).toBeDefined();
    });

    describe('The formatPayload method', function() {
      var payload;
      var company;
      beforeEach(inject(function(_servedCompanyCreate_) {
        $scope.showAdditionalFields = true;
        companyCreateJSON = _servedCompanyCreate_;
        payload = {
          taxes: [{
            taxIdNumber: '432434234'
          }, {
            taxIdNumber: '23423432'
          }, {
            taxIdNumber: '235235325'
          }],
          languages: [{
            id: 4,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 3,
            languageCode: 'de',
            languageName: 'German (Standard)'
          }],
          countryVats: [{
            vatAmounts: [{
              vatAmount: '34524525235'
            }],
            'countryId': '240'
          }],
          companyCabinClasses: [{
            cabinClass: 'Common',
            code: 'CC',
            cabinClassDescription: 'Common Class',
          }],
          companyName: 'testCompanyName',
          legalName: 'testLegalName',
          companyCode: 'code341',
          dbaName: 'testDBAName',
          ediName: 'testEDI',
          companyTypeId: '1',
          baseCurrencyId: '1',
          parentCompanyId: '554',
          eposLanguages: [{
            id: 3,
            languageCode: 'en-gb',
            languageName: 'English (United Kingdom)'
          }, {
            id: 5,
            languageCode: 'de',
            languageName: 'German (Standard)'
          }],
          isActive: true
        };
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
