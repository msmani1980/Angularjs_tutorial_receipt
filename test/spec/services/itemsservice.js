'use strict';

describe('Items Service |', function () {

  // instantiate service
  var itemsService,
    $httpBackend,
    testObject,
    response,
    itemsJSON;
 /*   itemTypesJSON,
    characteristicsJSON,
    allergensJSON,
    priceTypesJSON,
    unitsDimensionJSON,
    unitsWeightJSON,
    unitsVolumeJSON;*/

  // load the service's module
  beforeEach(module('ts5App'));

  beforeEach(module(
    'served/items.json',
    'served/itemTypes.json',
    'served/characteristics.json',
    'served/allergens.json',
    'served/priceTypes.json',
    'served/unitsDimension.json',
    'served/unitsWeight.json',
    'served/unitsVolume.json'
  ));


  // Inject the service and responshandler
  beforeEach(inject(function (_itemsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedItems_) {
      itemsJSON = _servedItems_;
      /*itemTypesJSON = _servedItemTypes_;
      characteristicsJSON = _servedCharacteristics_;
      allergensJSON = _servedAllergens_;
      priceTypesJSON = _servedPriceTypes_;
      unitsDimensionJSON = _servedUnitsDimension_;
      unitsWeightJSON = _servedUnitsWeight_;
      unitsVolumeJSON = _servedUnitsVolume_;*/
    });
    itemsService = _itemsService_;
    $httpBackend = $injector.get('$httpBackend');

  }));

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
/*
  // Item Types API
  describe('The Items Type API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the item types service
      spyOn(itemsService.itemTypes, 'query').and.callFake(function () {
        return itemTypesJSON;
      });

      // make the mock query call
      response = itemsService.itemTypes.query();

      // grab the first object to check
      testObject = response[0];

    });

    it('should have an itemTypes resource', function () {
      expect(itemsService.itemTypes).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.itemTypes.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response that has at least one object inside it', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('Item Type should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Item Type should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Item Type should have an name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe item type api

  // Characteristics API
  describe('The Characteristics API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService.characteristics, 'query').and.callFake(function () {
        return characteristicsJSON;
      });

      // make the mock query call
      response = itemsService.characteristics.query();

      // grab first object in list
      testObject = response[0];

    });

    it('should have an character resource', function () {
      expect(itemsService.characteristics).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.characteristics.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should have return at least one oject inside the response', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('Characteristic should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Characteristic should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Characteristic should have an name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe characteristics api

  // Price Types API
  describe('The Price Types API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService.priceTypes, 'query').and.callFake(function () {
        return priceTypesJSON;
      });

      // make the mock query call
      response = itemsService.priceTypes.query();

      // grab first item in list
      testObject = response[0];

    });

    it('should have an priceTypes resource', function () {
      expect(itemsService.priceTypes).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.priceTypes.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should have return at least one oject inside the response', function () {
      expect(response.length).toBeGreaterThan(0);
    });

    it('PriceType should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('PriceType should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('PriceType should have an name', function () {
      expect(testObject.name).toBeDefined();
    });

  }); // describe priceTypes api

  // Units/Dimensions API
  describe('The Units/Dimension API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService.units.dimension, 'query').and.callFake(function () {
        return unitsDimensionJSON;
      });

      // make the mock query calls to the units
      response = itemsService.units.dimension.query();

      // grab first item in list
      testObject = response.units[0];

    });

    it('should have an Unit/Dimensions resource', function () {
      expect(itemsService.units.dimension).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.units.dimension.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containg a units object', function () {
      expect(response.units).toBeDefined();
    });

    it('should have return at least one object inside the response', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('Unit should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Unit should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Unit should have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('Unit should have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });


  }); // describe Units/Dimensions api

  // Units/Weight API
  describe('The Units/Weight API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService.units.weight, 'query').and.callFake(function () {
        return unitsWeightJSON;
      });

      // make the mock query calls to the units
      response = itemsService.units.weight.query();

      // grab first item in list
      testObject = response.units[0];

    });

    it('should have an Unit/Weight resource', function () {
      expect(itemsService.units.weight).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.units.weight.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containg a units object', function () {
      expect(response.units).toBeDefined();
    });

    it('should have return at least one object inside the response', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('Unit should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Unit should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Unit should have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('Unit should have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });

  }); // describe Units/Weight api

  // Units/Volume API
  describe('The Units/Volume API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(itemsService.units.volume, 'query').and.callFake(function () {
        return unitsVolumeJSON;
      });

      // make the mock query calls to the units
      response = itemsService.units.volume.query();

      // grab first item in list
      testObject = response.units[0];

    });

    it('should have an Unit/Volume resource', function () {
      expect(itemsService.units.volume).toBeDefined();
    });

    it('should be able call the query method', function () {
      expect(itemsService.units.volume.query).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containg a units object', function () {
      expect(response.units).toBeDefined();
    });

    it('should have return at least one object inside the response', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('Unit should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Unit should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Unit should have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('Unit should have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });

  }); // describe Units/Volume api

*/

}); // describe item service
