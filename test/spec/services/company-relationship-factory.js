'use strict';

describe('Factory: companyRelationshipFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyRelationshipFactory,
    companyRelationshipService,
    companyService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _companyRelationshipFactory_, _companyRelationshipService_, _companyService_) {
    companyService = _companyService_;
    companyRelationshipService = _companyRelationshipService_;

    spyOn(companyService, 'getCompany');
    spyOn(companyRelationshipService, 'getCompanyRelationshipListByCompany');
    spyOn(companyRelationshipService, 'getCompanyRelationshipTypeList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    companyRelationshipFactory = _companyRelationshipFactory_;
  }));

  it('should be defined', function () {
    expect(!!companyRelationshipFactory).toBe(true);
  });

  describe('companyService API', function () {
    it('should call companyService on getCompany', function () {
      companyRelationshipFactory.getCompany(2);
      expect(companyService.getCompany).toHaveBeenCalled();
    });
  });

  describe('companyRelationshipService API', function () {
    it('should call companyRelationshipService on getCompanyRelationshipListByCompany', function () {
      companyRelationshipFactory.getCompanyRelationshipListByCompany();
      expect(companyRelationshipService.getCompanyRelationshipListByCompany).toHaveBeenCalled();
    });

    it('should call companyRelationshipService on getCompanyRelationshipTypeList', function () {
      companyRelationshipFactory.getCompanyRelationshipTypeList();
      expect(companyRelationshipService.getCompanyRelationshipTypeList).toHaveBeenCalled();
    });
  });

});

