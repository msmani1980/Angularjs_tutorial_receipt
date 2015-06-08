// TODO: Add in test cases for business logic regarding station constraints like start / end date
'use strict';

describe('Stations Service |', function () {

  // instantiate service
  var stationsService,
    $httpBackend,
    testObject,
    response,
    stationsJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/stations.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_stationsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedStations_) {
      stationsJSON = _servedStations_;
    });

    stationsService = _stationsService_;

    $httpBackend = $injector.get('$httpBackend');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('The service should exist', function () {
    expect(stationsService).toBeDefined();
  });

  // Stations API
  describe('When calling the API it', function () {

    // inject the http request mock to the API
    beforeEach(function () {

      spyOn(stationsService, 'getStationsList').and.callFake(function () {
        return stationsJSON;
      });

      // make the mock query call
      response = stationsService.getStationsList();

      // grab first item in list
      testObject = response.response[0];

    });

    it('should be able call the getStationsList method', function () {
      expect(stationsService.getStationsList).toHaveBeenCalled();
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

    it('should contain a Station object in the response', function () {
      expect(testObject).toBeDefined();
    });

    it('should expect the Station object to have an id', function () {
      expect(testObject.id).toBeDefined();
    });

    it('should expect the Station object to have an companyId', function () {
      expect(testObject.companyId).toBeDefined();
    });

    it('should expect the Station object to have a stationName', function () {
      expect(testObject.stationName).toBeDefined();
    });

    it('should expect the Station object to have a startDate', function () {
      expect(testObject.startDate).toBeDefined();
    });

     it('should expect the Station object to have a endDate', function () {
      expect(testObject.endDate).toBeDefined();
    });


  }); // describe Stations api

});
