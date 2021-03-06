'use strict';

describe('Price Types Service |', function () {

  // instantiate service
  var priceTypesService,
    $httpBackend,
    testObject,
    response,
    priceTypesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/price-types.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_priceTypesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedPriceTypes_) {
      priceTypesJSON = _servedPriceTypes_;
    });

    priceTypesService = _priceTypesService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(priceTypesService).toBeDefined();
  });

  // PriceTypes API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(priceTypesService, 'getPriceTypesList').and.callFake(function () {
        return priceTypesJSON;
      });

      // make the mock query call
      response = priceTypesService.getPriceTypesList();

      // grab first item in list
      testObject = response[0];

    });

    it('should be able call the getPriceTypesList method', function () {
      expect(priceTypesService.getPriceTypesList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('should contain an PriceType object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the PriceType object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the PriceType object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe priceTypes api

});
