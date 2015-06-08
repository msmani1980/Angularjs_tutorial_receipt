'use strict';

describe('Units Service |', function () {

  // instantiate service
  var unitsService,
    $httpBackend,
    testObject,
    response,
    unitsDimensionJSON,
    unitsWeightJSON,
    unitsVolumeJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  beforeEach(module(
    'served/units-dimension.json',
    'served/units-weight.json',
    'served/units-volume.json'
  ));


  // Inject the service and responshandler
  beforeEach(inject(function (_unitsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedUnitsDimension_,_servedUnitsWeight_,_servedUnitsVolume_) {
      unitsDimensionJSON = _servedUnitsDimension_;
      unitsWeightJSON = _servedUnitsWeight_;
      unitsVolumeJSON = _servedUnitsVolume_;
    });
    unitsService = _unitsService_;
    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(unitsService).toBeDefined();
  });


  // Units/Dimensions API
  describe('When calling the Dimensions API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(unitsService, 'getDimensionList').and.callFake(function () {
        return unitsDimensionJSON;
      });

      // make the mock query calls to the units
      response = unitsService.getDimensionList();

      // grab first item in list
      testObject = response.units[0];

    });


    it('should be able call the getDimensionList method', function () {
      expect(unitsService.getDimensionList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should recieve a response containg a units array', function () {
      expect(response.units).toBeDefined();
    });

    it('should have at least one object inside the units array', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('should contain a unit object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Unit object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Unit object to have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('should expect the Unit object to have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });

    it('should expect the Unit object to have unitType to be Volume', function () {
      expect(testObject.unitType).toBe('Dimensions');
    });

  }); // describe Units/Dimensions api

   // Units/Volume API
  describe('When calling the Volume API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(unitsService, 'getVolumeList').and.callFake(function () {
        return unitsVolumeJSON;
      });

      // make the mock query calls to the units
      response = unitsService.getVolumeList();

      // grab first item in list
      testObject = response.units[0];

    });


    it('should be able call the getVolumeList method', function () {
      expect(unitsService.getVolumeList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should recieve a response containg a units array', function () {
      expect(response.units).toBeDefined();
    });

    it('should have at least one object inside the units array', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('should contain a unit object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Unit object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Unit object to have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('should expect the Unit object to have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });

    it('should expect the Unit object to have unitType to be Volume', function () {
      expect(testObject.unitType).toBe('Volume');
    });

  }); // describe Units/Volume api

  // Units/Weight API
  describe('When calling the Weight API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(unitsService, 'getWeightList').and.callFake(function () {
        return unitsWeightJSON;
      });

      // make the mock query calls to the units
      response = unitsService.getWeightList();

      // grab first item in list
      testObject = response.units[0];

    });


    it('should be able call the getWeightList method', function () {
      expect(unitsService.getWeightList).toHaveBeenCalled();
    });

    it('should receive a response', function () {
      expect(response).toBeDefined();
    });

    it('should recieve a response containg a units array', function () {
      expect(response.units).toBeDefined();
    });

    it('should have at least one object inside the units array', function () {
      expect(response.units.length).toBeGreaterThan(0);
    });

    it('should contain a unit object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Unit object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Unit object to have an unitCode', function () {
      expect(testObject.unitCode).toBeDefined();
    });

    it('should expect the Unit object to have an unitName', function () {
      expect(testObject.unitName).toBeDefined();
    });

    it('should expect the Unit object to have unitType to be Weight', function () {
      expect(testObject.unitType).toBe('Weight');
    });

  }); // describe Units/Weight api


}); // describe item service
