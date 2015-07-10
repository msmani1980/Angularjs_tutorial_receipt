// TODO:
// Add CRUD Test cases

'use strict';

describe('CatererStation Service |', function () {

  var catererStationService,
    $httpBackend,
    testObject,
    response,
    catererStationsJSON;

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));

  beforeEach(inject(function (_servedCateringStations_,
    _catererStationService_,
    $injector) {
    catererStationsJSON = _servedCateringStations_;
    catererStationService = _catererStationService_;
    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(catererStationService).toBeDefined();
  });

  // Item API
  describe('The CatererStation API', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      // spy on the query of the items service
      spyOn(catererStationService, 'getCatererStationList').and.callFake(
        function () {
          return catererStationsJSON;
        });

      // make the mock query call
      response = catererStationService.getCatererStationList();

      // grab first item in list
      testObject = response.response[0];

    });

    it('should be defined', function () {
      expect(catererStationService).toBeDefined();
    });

    it('should be able call the getCatererStationList method', function () {
      expect(catererStationService.getCatererStationList).toHaveBeenCalled();
    });

    it('should get a response', function () {
      expect(response).toBeDefined();
    });

    it('should get a response containing the response object', function () {
      expect(response.response).toBeDefined();
    });

    it('should have return at least one oject inside of response',
      function () {
        expect(response.response.length).toBeGreaterThan(0);
      });

    it('Caterer Station should exist', function () {
      expect(testObject).toBeDefined();
    });

    it('Caterer Station should have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('Caterer Station should have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });

    it('Caterer Station should have an name', function () {
      expect(testObject.name).toBeDefined();
    });

    it('Caterer Station should have code', function () {
      expect(testObject.code).toBeDefined();
    });

  });

});
