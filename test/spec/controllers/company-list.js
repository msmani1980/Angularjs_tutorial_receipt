'use strict';

describe('Controller: CompanyListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/companies.json'));
  beforeEach(module('served/company-types.json'));

  var CompanyListCtrl;
  var scope;
  var companyFactory;
  var getCompanyListDeferred;
  var companyListJSON;
  var getCompanyTypesDeferred;
  var getCompanyTypesJSON;
  var location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    companyListJSON = $injector.get('servedCompanies');
    getCompanyTypesJSON = $injector.get('servedCompanyTypes');

    location = $location;
    scope = $rootScope.$new();
    companyFactory = $injector.get('companyFactory');

    getCompanyListDeferred = $q.defer();
    getCompanyListDeferred.resolve(companyListJSON);
    spyOn(companyFactory, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);

    getCompanyTypesDeferred = $q.defer();
    getCompanyTypesDeferred.resolve(getCompanyTypesJSON);
    spyOn(companyFactory, 'getCompanyTypes').and.returnValue(getCompanyTypesDeferred.promise);

    CompanyListCtrl = $controller('CompanyListCtrl', {
      $scope: scope
    });
    scope.loadCompanies();
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Manage Companies');
  });

  it('should get the company list from API', function () {
    expect(companyFactory.getCompanyList).toHaveBeenCalled();
  });

  describe('companyList in scope', function () {
    it('should attach a companyList after a API call to getCompanyList', function () {
      expect(!!scope.companyList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.companyList[0].companyName).toBe('StructureChangeTr');
    });

    it('should not call getCompanyList', function () {
      var expectedCompanyCount = scope.companyList;
      CompanyListCtrl.meta.offset = 100;
      CompanyListCtrl.meta.count = 1;
      scope.loadCompanies();
      scope.$digest();
      expect(scope.companyList.length).not.toBe(expectedCompanyCount);

    });
  });

  describe('Company types in scope', function () {
    it('should GET CompanyTypes', function () {
      expect(companyFactory.getCompanyTypes).toHaveBeenCalled();
    });

    it('should attach a company-types array after a API call to getCompanyTypes', function () {
      expect(!!scope.companyTypeList.length).toBeGreaterThan(0);
    });
  });

  describe('action button', function () {
    it('manage company-relationship should change the URL based on the company object', function () {
      scope.showCompanyRelationshipList({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/company-relationship-list/1');
    });

    it('should redirect to to view company with id in path', function () {
      scope.viewCompany({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/company-view/1');
    });

    it('should redirect to to edit company with id in path', function () {
      scope.editCompany({
        id: 'fakeCompanyId'
      });
      scope.$digest();
      expect(location.path()).toBe('/company-edit/fakeCompanyId');
    });
  });

  describe('search companies', function () {
    it('should clear the companyList from scope', function () {
      scope.companyList = [{
        id: 'fakeId',
        companyName: 'fakeCompanyName'
      }];

      scope.searchCompanies();

      expect(scope.companyList.length).toBe(0);
    });

    it('should clear all the search params', function () {
      var searchParams = {
        companyTypeId: 'fakeCompanyTypeId',
        companyName: 'fakeCompanyName'
      };
      scope.search = angular.copy(searchParams);
      scope.clearForm();
      expect(scope.search.companyName).not.toBe(searchParams.companyName);
    });

    it('should call getCompanyList with search params', function () {
      scope.search = {
        companyTypeId: 'fakeCompanyTypeId'
      };

      var expectedParam = jasmine.objectContaining(scope.search);

      scope.searchCompanies();
      scope.$digest();
      expect(companyFactory.getCompanyList).toHaveBeenCalledWith(expectedParam);
    });

    it('should call getCompanyList without search params', function () {
      scope.search = {
        companyTypeId: 'fakeCompanyTypeId'
      };

      var expectedParam = jasmine.objectContaining(scope.search);

      scope.clearForm();
      scope.$digest();
      expect(companyFactory.getCompanyList).not.toHaveBeenCalledWith(expectedParam);
    });
  });
});
