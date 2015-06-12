//TODO: Add Tests

'use strict';

describe('Service: companyRelationshipService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationships.json',
    'served/company-relationship-types.json'
  ));

  var companyRelationshipService,
    $httpBackend,
    companyRelationshipsResponseJSON,
    companyRelationshipTypesResponseJSON;

  beforeEach(inject(function (_companyRelationshipService_, $injector) {
    inject(function (_servedCompanyRelationships_, _servedCompanyRelationshipTypes_) {
      companyRelationshipsResponseJSON = _servedCompanyRelationships_;
      companyRelationshipTypesResponseJSON = _servedCompanyRelationshipTypes_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/companies/).respond(companyRelationshipsResponseJSON);
    $httpBackend.whenGET(/company-relation/).respond(companyRelationshipTypesResponseJSON);
    companyRelationshipService = _companyRelationshipService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyRelationshipService).toBe(true);
  });

  describe('API calls', function () {
    var companyRelationshipData;
    var companyRelationshipTypeData;

    describe('getCompanyRelationshipListByCompany', function () {
      beforeEach(function () {
        companyRelationshipService.getCompanyRelationshipListByCompany().then(function (companyRelationshipListFromAPI) {
          companyRelationshipData = companyRelationshipListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(companyRelationshipData.companyRelationships)).toBe('[object Array]');
      });

      it('should have an array of company-relationship', function () {
        expect(companyRelationshipData.companyRelationships.length).toBeGreaterThan(0);
      });

      it('should have a companyName property', function () {
        expect(companyRelationshipData.companyRelationships[0].companyName).toBe('British Airways');
      });
    });

    describe('getCompanyRelationshipTypeList', function () {
      beforeEach(function () {
        companyRelationshipService.getCompanyRelationshipTypeList().then(function (companyRelationshipTypeListFromAPI) {
          companyRelationshipTypeData = companyRelationshipTypeListFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(companyRelationshipTypeData.response)).toBe('[object Array]');
      });

      it('should have an array of available company-relationship-type by company-type', function () {
        expect(companyRelationshipTypeData.response.length).toBeGreaterThan(0);
      });

      it('should have a companyTypeName property', function () {
        expect(companyRelationshipTypeData.response[0].companyTypeName).toBe('Retail');
      });
    });
  });
});
