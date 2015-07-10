'use strict';

describe('Factory: companyRelationshipFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyRelationshipFactory,
    companyRelationshipService,
    companyService;

  beforeEach(inject(function ($rootScope, _companyRelationshipFactory_, _companyRelationshipService_, _companyService_) {
    companyService = _companyService_;
    companyRelationshipService = _companyRelationshipService_;

    spyOn(companyService, 'getCompanyList').and.stub();
    spyOn(companyRelationshipService, 'getCompanyRelationshipListByCompany').and.stub();
    spyOn(companyRelationshipService, 'getCompanyRelationshipTypeList').and.stub();
    spyOn(companyRelationshipService, 'createCompanyRelationship').and.stub();
    spyOn(companyRelationshipService, 'updateCompanyRelationship').and.stub();
    spyOn(companyRelationshipService, 'deleteCompanyRelationship').and.stub();

    companyRelationshipFactory = _companyRelationshipFactory_;
  }));

  it('should be defined', function () {
    expect(!!companyRelationshipFactory).toBe(true);
  });

  describe('API Calls', function () {

    it('should fetch companyList from companyService', function () {
      companyRelationshipFactory.getCompanyList();
      expect(companyService.getCompanyList).toHaveBeenCalled();
    });

    it('should fetch companyRelationshipListByCompany from companyRelationshipService', function () {
      var payload = {
        fake: 'data'
      };

      companyRelationshipFactory.getCompanyRelationshipListByCompany(payload);
      expect(companyRelationshipService.getCompanyRelationshipListByCompany).toHaveBeenCalledWith(payload);
    });

    it('should fetch companyRelationshipTypeList from companyRelationshipService', function () {
      var payload = {
        fake: 'data'
      };

      companyRelationshipFactory.getCompanyRelationshipTypeList(payload);
      expect(companyRelationshipService.getCompanyRelationshipTypeList).toHaveBeenCalledWith(payload);
    });

    it('should createCompanyRelationship from companyRelationshipService', function () {
      var payload = {
        fake: 'data'
      };

      companyRelationshipFactory.createCompanyRelationship(payload);
      expect(companyRelationshipService.createCompanyRelationship).toHaveBeenCalledWith(payload);
    });

    it('should updateCompanyRelationship from companyRelationshipService', function () {
      var payload = {
        fake: 'data'
      };

      companyRelationshipFactory.updateCompanyRelationship(payload);
      expect(companyRelationshipService.updateCompanyRelationship).toHaveBeenCalledWith(payload);
    });

    it('should deleteCompanyRelationship from companyRelationshipService', function () {
      var payload = {
        fake: 'data'
      };

      companyRelationshipFactory.deleteCompanyRelationship(payload);
      expect(companyRelationshipService.deleteCompanyRelationship).toHaveBeenCalledWith(payload);
    });
  });

});

