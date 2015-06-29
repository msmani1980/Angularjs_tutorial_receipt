// TODO: Add CRUD Test cases

'use strict';

describe('Service: companyService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/companies.json'));

  var companyService,
    $httpBackend,
    companiesResponseJSON;

  beforeEach(inject(function (_companyService_, $injector) {
    inject(function (_servedCompanies_) {
      companiesResponseJSON = _servedCompanies_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/companies/).respond(companiesResponseJSON);
    companyService = _companyService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!companyService).toBe(true);
  });

  describe('API calls', function () {
    var companyData;

    beforeEach(function () {
      companyService.getCompanyList().then(function (companyListFromAPI) {
        companyData = companyListFromAPI;
      });
      $httpBackend.flush();
    });

    it('should be an array', function () {
      expect(angular.isArray(companyData.companies)).toBe(true);
    });

    it('should have a companyName property', function () {
      expect(companyData.companies[0].companyName).toBe('StructureChangeTr');
    });

    it('should have an array of items', function () {
      expect(companyData.companies.length).toBeGreaterThan(0);
    });
  });
});
