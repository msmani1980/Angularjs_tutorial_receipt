'use strict';

describe('Items Service', function () {

  // instantiate service
  var itemsService,
    $httpBackend,
    item,
    items,
    itemType,
    itemTypes;

  // set base path for jasmine
  jasmine.getJSONFixtures().fixturesPath = 'base/test/mock'; 

  // load JSON fixtures
  var json = jasmine.getJSONFixtures().load(
    'items.json',
    'itemTypes.json'
  ); 

  // grab item list json
  var itemsJSON = json['items.json'];

  var itemTypesJSON = json['itemTypes.json'];
 
  //var itemCreateJSON = json['item-create.json']; 

  // load the service's module
  beforeEach(module('ts5App'));

  // Inject the service and responshandler
  beforeEach( inject(function (_itemsService_, $injector) { 

    itemsService = _itemsService_;

    $httpBackend = $injector.get('$httpBackend');
  
  }));

  it('should exist', function () {
    expect(itemsService).toBeDefined();
  });

  // Item API
  describe('Items API', function () {

    // inject the http request mock to the API
    beforeEach(function() {

      // spy on the query of the items service
      spyOn(itemsService.items, 'query').and.callFake(function() {
        return itemsJSON;
      });

      // make the mock query call
      items = itemsService.items.query();  

    });

    it('should have an item resource', function() {
      expect(itemsService.items).toBeDefined();
    });

    it('should be able call the query method', function() {
      expect(itemsService.items.query).toHaveBeenCalled();
    });

    it('should fetch a list of items', function () {
      expect(items.retailItems).toBeDefined();
    });
     
    it('should have return at least one item inside of retailItems', function () {

        expect(items.retailItems.length).toBeGreaterThan(0);

        describe('and a Retail Item', function() {

          // grab first item in list
          item =  items.retailItems[0]; 

          it('should exist', function () {
              expect(item).toBeDefined().and.not.beNull();
          });

          it('should have an id', function () {
            expect(item.id).toBeDefined().and.not.beNull();
          });

          it('should have an companyId', function () {
            expect(item.companyId).toBeDefined().and.not.beNull();
          });

          it('should have an itemName', function () {
            expect(item.itemName).toBeDefined().and.not.beNull();
          });

        });

    });

  }); // describe item api

  // Item Types API
  describe('Item Type API', function () {

    // inject the http request mock to the API 
    beforeEach(function() {

      // spy on the query of the item types service
      spyOn(itemsService.itemTypes, 'query').and.callFake(function() {
        return itemTypesJSON;
      });

      // make the mock query call
      itemTypes = itemsService.itemTypes.query();  

    });

    it('should have an itemTypes resource', function() {
      expect(itemsService.itemTypes).toBeDefined();
    });

    it('should be able call the query method', function() {
      expect(itemsService.itemTypes.query).toHaveBeenCalled();
    });
     
    it('should have return at least one item itemType', function () {

        expect(itemTypes.length).toBeGreaterThan(0);

        describe('and a Item Type', function() {

          // grab first item in list
          itemType =  itemTypes[0]; 

          it('should exist', function () {
              expect(itemType).toBeDefined().and.not.beNull();
          });

          it('should have an id', function () {
            expect(itemType.id).toBeDefined().and.not.beNull();
          });

          it('should have an name', function () {
            expect(item.name).toBeDefined().and.not.beNull();
          });

        });

    });

  }); // describe item api

}); // describe item service
