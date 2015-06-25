'use strict';

describe('Controller: CompanyRelationshipListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/company-list.json',
    'served/company-relationship-list.json',
    'served/company-relationship-type-list.json'
  ));

  var CompanyRelationshipListCtrl,
    scope,
    getCompanyListDeferred,
    getCompanyRelationshipListByCompanyDeferred,
    getCompanyRelationshipTypeListDeferred,
    companyRelationshipFactory,
    companyListJSON,
    companyRelationshipListByCompanyJSON,
    companyRelationshipTypeListJSON,
    location;

  beforeEach(inject(function ($q, $controller, $rootScope, _companyRelationshipFactory_, $location) {
    inject(function (_servedCompanyList_, _servedCompanyRelationshipList_, _servedCompanyRelationshipTypeList_) {
      companyListJSON = _servedCompanyList_;
      companyRelationshipListByCompanyJSON = _servedCompanyRelationshipList_;
      companyRelationshipTypeListJSON = _servedCompanyRelationshipTypeList_;
    });

    location = $location;
    scope = $rootScope.$new();

    getCompanyListDeferred = $q.defer();
    getCompanyListDeferred.resolve(companyListJSON);
    getCompanyRelationshipListByCompanyDeferred = $q.defer();
    getCompanyRelationshipListByCompanyDeferred.resolve(companyRelationshipListByCompanyJSON);
    getCompanyRelationshipTypeListDeferred = $q.defer();
    getCompanyRelationshipTypeListDeferred.resolve(companyRelationshipTypeListJSON);

    companyRelationshipFactory = _companyRelationshipFactory_;

    spyOn(companyRelationshipFactory, 'getCompanyList').and.returnValue(getCompanyListDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipListByCompany').and.returnValue(getCompanyRelationshipListByCompanyDeferred.promise);
    spyOn(companyRelationshipFactory, 'getCompanyRelationshipTypeList').and.returnValue(getCompanyRelationshipTypeListDeferred.promise);
    CompanyRelationshipListCtrl = $controller('CompanyRelationshipListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBe('Company Relationships')
  });

  it('should get the company relationship list from API', function () {
    expect(companyRelationshipFactory.getCompanyRelationshipListByCompany).toHaveBeenCalled();
  });

  describe('companyRelationshipList in scope', function () {
    it('should attach a companyRelationshipList after a API call to getCompanyRelationshipList', function () {
      expect(!!scope.formData).toBe(true);
    });

    it('should have a menu name property', function () {
      expect(scope.formData[0].companyName).toBe('British Airways');
    });
  });

  //describe('Action buttons', function () {
  //  var fakeCompanyRelationship;
  //
  //  beforeEach(function () {
  //    fakeCompanyRelationship = {
  //      relativeCompanyId: 1,
  //      startDate: '2015-01-01',
  //      endDate: '2015-01-01'
  //    };
  //  });
  //
  //  describe('addCompanyRelationship()', function() {
  //
  //  });
  //});
});