'use strict';

describe('ItemTypes Service |', function () {

  // instantiate service
  var itemTypesService,
    $httpBackend,
    testObject,
    response,
    itemTypesJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/itemTypes.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_itemTypesService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedItemTypes_) {
      itemTypesJSON = _servedItemTypes_;
    });

    itemTypesService = _itemTypesService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  it('The service should exist', function () {
    expect(itemTypesService).toBeDefined();
  });

  // ItemTypes API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(itemTypesService, 'getItemTypesList').and.callFake(function () {
        return itemTypesJSON;
      });

      // make the mock query call
      response = itemTypesService.getItemTypesList();

      // grab first item in list
      testObject = response[0];

    });

    it('should be able call the getItemTypesList method', function () {
      expect(itemTypesService.getItemTypesList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should have at least one object inside the response array', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('should contain an ItemType object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the ItemType object to have an itemTypeId', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the ItemType object to have a name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe itemTypes api

});