'use strict';

describe('Controller: CompanyRelationshipListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationships.json',
    'served/company-relationship-types.json'
  ));

  var CompanyRelationshipListCtrl,
    scope,
    getCompanyRelationshipListByCompanyDeferred,
    getCompanyRelationshipTypeListDeferred,
    companyRelationshipService,
    companyRelationshipListByCompanyJSON,
    companyRelationshipTypeListJSON,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _companyRelationshipService_, $location) {
    inject(function (_servedCompanyRelationships_, _servedCompanyRelationshipTypes_) {
      companyRelationshipListByCompanyJSON = _servedCompanyRelationships_;
      companyRelationshipTypeListJSON = _servedCompanyRelationshipTypes_;
    });
    location = $location;
    scope = $rootScope.$new();
    getCompanyRelationshipListByCompanyDeferred = $q.defer();
    getCompanyRelationshipListByCompanyDeferred.resolve(companyRelationshipListByCompanyJSON);
    getCompanyRelationshipTypeListDeferred = $q.defer();
    getCompanyRelationshipTypeListDeferred.resolve(companyRelationshipTypeListJSON);
    companyRelationshipService = _companyRelationshipService_;
    spyOn(companyRelationshipService, 'getCompanyRelationshipListByCompany').and.returnValue(getCompanyRelationshipListByCompanyDeferred.promise);
    spyOn(companyRelationshipService, 'getCompanyRelationshipTypeList').and.returnValue(getCompanyRelationshipTypeListDeferred.promise);
    CompanyRelationshipListCtrl = $controller('CompanyRelationshipListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Company Relationships')
  });

  it('should get the company relationship list from API', function () {
    expect(companyRelationshipService.getCompanyRelationshipListByCompany).toHaveBeenCalled();
  });

  describe('companyRelationshipList in scope', function () {
    it('should attach a companyRelationshipList after a API call to getCompanyRelationshipList', function () {
      expect(!!scope.companyRelationshipList).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.companyRelationshipList[0].companyName).toBe('British Airways');
    });
  });

  describe('Action buttons', function () {
    var fakeMenuItem;

    beforeEach(function () {
      fakeMenuItem = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });
  });
});