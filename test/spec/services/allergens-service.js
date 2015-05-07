'use strict';

describe('Allergens Service |', function () {

  // instantiate service
  var allergensService,
    $httpBackend,
    testObject,
    response,
    allergensJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/allergens.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_allergensService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedAllergens_) {
      allergensJSON = _servedAllergens_;
    });

    allergensService = _allergensService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  it('The service should exist', function () {
    expect(allergensService).toBeDefined();
  });

  // Allergens API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(allergensService, 'getAllergensList').and.callFake(function () {
        return allergensJSON;
      });

      // make the mock query call
      response = allergensService.getAllergensList();

      // grab first item in list
      testObject = response[0];

    });

    it('should be able call the getAllergensList method', function () {
      expect(allergensService.getAllergensList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('should contain an Allergen object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Allergen object to have an allergenId', function () {
      expect(testObject.allergenId).toBeDefined();
    });

    it('should expect the Allergen object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe allergens api

});