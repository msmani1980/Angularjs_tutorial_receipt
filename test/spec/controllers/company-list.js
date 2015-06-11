'use strict';

describe('Controller: CompanyListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/companies.json'));

  var CompanyListCtrl,
    scope,
    getCompanyListDeferred,
    companyService,
    companyListJSON,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _companyService_, $location) {
    inject(function (_servedCompanies_) {
      companyListJSON = _servedCompanies_;
    });
    location = $location;
    scope = $rootScope.$new();
    getCompanyListDeferred = $q.defer();
    getCompanyListDeferred.resolve(companyListJSON);
    companyService = _companyService_;
    spyOn(companyService, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);
    CompanyListCtrl = $controller('CompanyListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Manage Companies');
  });

  it('should get the company list from API', function () {
    expect(companyService.getCompanyList).toHaveBeenCalled();
  });

  describe('companyList in scope', function () {
    it('should attach a companyList after a API call to getCompanyList', function () {
      expect(!!scope.companyList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.companyList[0].companyName).toBe('StructureChangeTr');
    });
  });

  describe('action button', function () {
    it('view should change the URL based on the company object', function() {
      scope.showCompany({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/company-view/1');
    });

    it('edit should change the URL based on the company object', function() {
      scope.editCompany({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/company-edit/1');
    });

    it('manage company-relationship should change the URL based on the company object', function() {
      scope.showCompanyRelationshipList({id: 1});
      scope.$digest();
      expect(location.path()).toBe('/company-relationship-edit/1');
    });
  });
});