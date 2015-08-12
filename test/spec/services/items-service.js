// TODO:
// Add CRUD Test cases

'use strict';

describe('Items Service |', function () {

  // instantiate service
  var itemsService,
    $httpBackend,
    testObject,
    response,
    itemsJSON,
    masterItemListJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  beforeEach(module('served/items-list.json', 'served/master-item-list.json'));


  // Inject the service and responshandler
  beforeEach(inject(function (_itemsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedItemsList_, _servedMasterItemList_) {
      itemsJSON = _servedItemsList_;
      masterItemListJSON = _servedMasterItemList_;
    });

    itemsService = _itemsService_;
    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(itemsService).toBeDefined();
  });

  // Item API
  describe('The Items API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService, 'getItemsList').and.callFake(function () {
        return itemsJSON;
      });

      // make the mock query call
      response = itemsService.getItemsList();

      // grab first item in list
      testObject = response.retailItems[0];

    });

    it('should be defined', function () {
      expect(itemsService).toBeDefined();
    });

    it('should be able call the getItemsList method', function () {
      expect(itemsService.getItemsList).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containing the retailItems object', function () {
      expect(response.retailItems).toBeDefined();
    });

    it('should have return at least one oject inside of retailItems', function () {
      expect(response.retailItems.length).toBeGreaterThan(0);
    });

    it('Retail Item should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Retail Item should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Retail Item should have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });

    it('Retail Item should have an itemName', function () {
      expect(testObject.itemName).toBeDefined();
    });

  }); // describe item api

  describe('Master retail items API', function () {
    beforeEach(function(){
      $httpBackend.whenGET(/retail-items\/master/).respond(masterItemListJSON);
    });

    it('should get the master retail item list from API', function () {
      itemsService.getItemsList({}, true);
      $httpBackend.expectGET(/retail-items\/master/);
      $httpBackend.flush();
    });
  });

  describe('getItemsByCateringStationId method', function(){
    beforeEach(function(){
      $httpBackend.whenGET(/retail-items\/caterer-station/).respond(masterItemListJSON);
    });
    it('should make get request when calling getItemsByCateringStationId', function () {
      itemsService.getItemsByCateringStationId(3);
      $httpBackend.expectGET(/retail-items\/caterer-station/);
      $httpBackend.flush();
    });
  });

}); // describe item service
