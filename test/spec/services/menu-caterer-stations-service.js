'use strict';

describe('Menu Station Relationship Service', function () {

  var menuCatererStationsService,
    $httpBackend,
    testObject,
    response,
    relationshipListJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/menu-catering-stations.json'));

  beforeEach(inject(function (_servedMenuCateringStations_,
    _menuCatererStationsService_,
    $injector) {
    relationshipListJSON = _servedMenuCateringStations_;
    menuCatererStationsService = _menuCatererStationsService_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(menuCatererStationsService).toBeDefined();
  });

  describe('The Menu Station Relationship API', function () {

    beforeEach(function () {
      spyOn(menuCatererStationsService, 'getRelationshipList').and.returnValue(
        relationshipListJSON);
      response = menuCatererStationsService.getRelationshipList();
      testObject = response.companyMenuCatererStations[0];
    });

    it('should be defined', function () {
      expect(menuCatererStationsService).toBeDefined();
    });

    it('should be able call the getRelationshipList method', function () {
      expect(menuCatererStationsService.getRelationshipList).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it(
      'should get a response containing the companyMenuCatererStations object',
      function () {
        expect(response.companyMenuCatererStations).toBeDefined();
      });

    it('should have return at least one object inside of response',
      function () {
        expect(response.companyMenuCatererStations.length).toBeGreaterThan(
          0);
      });

    it('Relationship should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Relationship should have an id', function () {
      expect(testObject.id).toBeDefined();
      expect(testObject.id).toEqual(jasmine.any(Number));
    });

    it('Relationship should have an menuId', function () {
      expect(testObject.menuId).toBeDefined();
      expect(testObject.menuId).toEqual(jasmine.any(Number));
    });

    it('Relationship should have an catererStationIds array', function () {
      expect(testObject.catererStationIds).toBeDefined();
      expect(angular.isArray(testObject.catererStationIds)).toBeTruthy();
    });

    it(
      'Relationship should have at least one station id in catererStationIds array',
      function () {
        expect(testObject.catererStationIds.length).toBeGreaterThan(0);
      });

    it('Relationship should have startDate', function () {
      expect(testObject.startDate).toBeDefined();
      expect(testObject.startDate).toEqual('2015-07-01');
    });

    it('Relationship should have endDate', function () {
      expect(testObject.endDate).toBeDefined();
      expect(testObject.endDate).toEqual('2015-08-08');
    });

  });

});
