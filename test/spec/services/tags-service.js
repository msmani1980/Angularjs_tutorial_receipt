'use strict';

describe('Tags Service |', function () {

  // instantiate service
  var tagsService,
    $httpBackend,
    testObject,
    response,
    tagsJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/tags.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_tagsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedTags_) {
      tagsJSON = _servedTags_;
    });

    tagsService = _tagsService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  it('The service should exist', function () {
    expect(tagsService).toBeDefined();
  });

  // ItemTypes API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(tagsService, 'getTagsList').and.callFake(function () {
        return tagsJSON;
      });

      // make the mock query call
      response = tagsService.getTagsList();

      // grab first item in list
      testObject = response.response[0];

    });

    it('should be able call the getTagsList method', function () {
      expect(tagsService.getTagsList).toHaveBeenCalled();
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

    it('should contain a Tag object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Tag object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Tag object to have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });

    it('should expect the Tag object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe itemTypes api

});
