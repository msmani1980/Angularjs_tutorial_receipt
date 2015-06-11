//TODO: Add Tests

'use strict';

describe('Service: companyRelationshipService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-relationships.json'));

  var companyRelationshipService,
    $httpBackend,
    companyRelationshipsResponseJSON;

  beforeEach(inject(function (_companyRelationshipService_, $injector) {
    inject(function (_servedCompanyRelationships_) {
      companyRelationshipsResponseJSON = _servedCompanyRelationships_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/companies/).respond(companyRelationshipsResponseJSON);
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

    beforeEach(function () {
      companyRelationshipService.getCompanyRelationshipList().then(function (companyRelationshipListFromAPI) {
        companyRelationshipData = companyRelationshipListFromAPI;
      });
      $httpBackend.flush();
    });

    it('should be an array', function () {
      expect(Object.prototype.toString.call(companyRelationshipData.companyRelationships) === '[object Array]');
    });

    it('should have a companyName property', function () {
      expect(companyRelationshipData.companyRelationships[0].companyName).toBe('British Airways');
    });

    it('should have an array of items', function () {
      expect(companyRelationshipData.companyRelationships.length).toBeGreaterThan(0);
    });
  });
});
