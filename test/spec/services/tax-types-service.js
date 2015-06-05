'use strict';

describe('Tax Types Service |', function () {

  // instantiate service
  var taxTypesService,
    $httpBackend,
    testObject,
    response,
    taxTypesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/tax-types.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_taxTypesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedTaxTypes_) {
      taxTypesJSON = _servedTaxTypes_;
    });

    taxTypesService = _taxTypesService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(taxTypesService).toBeDefined();
  });

  // Tax Types API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(taxTypesService, 'getTaxTypesList').and.callFake(function () {
        return taxTypesJSON;
      });

      // make the mock query call
      response = taxTypesService.getTaxTypesList();

      // grab first item in list
      testObject = response.response[0];

    });

    it('should be able call the getTaxTypesList method', function () {
      expect(taxTypesService.getTaxTypesList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should receive a response with a response array', function () {
      expect(response.response).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.response.length).toBeGreaterThan(0);
    });

    it('should contain a Tax Type object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Tax Type object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Tax Type object to have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });

    it('should expect the Tax Type object to have a name', function () {
      expect(testObject.description).toBeDefined();
    });

    it('should expect the Tax Type object to have a taxTypeCode', function () {
      expect(testObject.taxTypeCode).toBeDefined();
    });


  }); // describe Tax Types api

});
