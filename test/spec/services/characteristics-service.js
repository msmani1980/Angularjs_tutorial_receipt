'use strict';

describe('Characteristics Service |', function () {

  // instantiate service
  var characteristicsService,
    $httpBackend,
    testObject,
    response,
    characteristicsJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/characteristics.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_characteristicsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedCharacteristics_) {
      characteristicsJSON = _servedCharacteristics_;
    });

    characteristicsService = _characteristicsService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(characteristicsService).toBeDefined();
  });

  // Characteristics API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(characteristicsService, 'getCharacteristicsList').and.callFake(function () {
        return characteristicsJSON;
      });

      // make the mock query call
      response = characteristicsService.getCharacteristicsList();

      // grab first item in list
      testObject = response[0];

    });

    it('should be able call the getCharacteristicsList method', function () {
      expect(characteristicsService.getCharacteristicsList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('should contain an Characteristic object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Characteristic object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Characteristic object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe itemTypes api

});
