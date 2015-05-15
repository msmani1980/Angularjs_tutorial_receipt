// TODO: 
// Add CRUD Test cases

'use strict';

describe('Companies Service |', function () {

  // instantiate service
  var companiesService,
    $httpBackend,
    testObject,
    response,
    companiesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  beforeEach(module('served/companies.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_companiesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedCompanies_) {
      companiesJSON = _servedCompanies_;
    });

    companiesService = _companiesService_;
    $httpBackend = $injector.get('$httpBackend');

  }));

  it('should exist', function () {
    expect(companiesService).toBeDefined();
  });

  // Item API
  describe('The Companies API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the companies service
      spyOn(companiesService, 'getCompaniesList').and.callFake(function () {
        return companiesJSON;
      });

      // make the mock query call
      response = companiesService.getCompaniesList();

      // grab first item in list
      testObject = response.companies[0];

    });

    it('should be defined', function () {
      expect(companiesService).toBeDefined();
    });

    it('should be able call the getCompaniesList method', function () {
      expect(companiesService.getCompaniesList).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containing the companies object', function () {
      expect(response.companies).toBeDefined();
    });

    it('should have return at least one oject inside of companies', function () {
      expect(response.companies.length).toBeGreaterThan(0);
    });

    it('Retail Item should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Retail Item should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Retail Item should have an companyCode', function () {
      expect(testObject.companyCode).toBeDefined();
    });

    it('Retail Item should have an companyName', function () {
      expect(testObject.companyName).toBeDefined();
    });
 
  }); // describe item api

}); // describe item service
