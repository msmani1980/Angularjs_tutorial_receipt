'use strict';

describe('Langages Service |', function () {

  // instantiate service
  var languagesService,
    $httpBackend,
    testObject,
    response,
    languagesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/languages.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_languagesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedLanguages_) {
      languagesJSON = _servedLanguages_;
    });

    languagesService = _languagesService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(languagesService).toBeDefined();
  });

  // Languages API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(languagesService, 'getLanguagesList').and.callFake(function () {
        return languagesJSON;
      });

      // make the mock query call
      response = languagesService.getLanguagesList();

      // grab first item in list
      testObject = response.languages[0];

    });

    it('should be able call the getLanguagesList method', function () {
      expect(languagesService.getLanguagesList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should receive a response array', function () {
      expect(response.languages).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.languages.length).toBeGreaterThan(0);
    });

    it('should contain an Language object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Language object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Language object to have a languageCode', function () {
      expect(testObject.languageCode).toBeDefined();
    });

    it('should expect the Language object to have a languageName', function () {
      expect(testObject.languageName).toBeDefined();
    });

  }); // describe languages api

});
