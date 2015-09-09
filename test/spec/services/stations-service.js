// TODO: Add in test cases for business logic regarding station constraints like start / end date
'use strict';

describe('Stations Service |', function () {

  // instantiate service
  var stationsService,
    $httpBackend,
    globalStationsJSON,
    stationsJSON;

  // load the service's module
  beforeEach(module('ts5App'));

  // Load json
  beforeEach(module('served/global-stations.json'));
  beforeEach(module('served/stations.json'));

  // Inject the service and responshandler
  beforeEach(inject(function (_stationsService_, $injector) {

    // Inject the JSON fixtures
    inject(function (_servedGlobalStations_, _servedStations_) {
      globalStationsJSON = _servedGlobalStations_;
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

  it('should have a getGlobalStationList method accessible from controller', function () {
    expect(!!stationsService.getGlobalStationList).toBe(true);
  });

  describe('global station API calls', function () {
    var globalStationData;

    describe('getGlobalStationList', function () {

      beforeEach(function () {
        $httpBackend.whenGET(/company-station-globals/).respond(globalStationsJSON);

        stationsService.getGlobalStationList().then(function (dataFromAPI) {
          globalStationData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(globalStationData.response)).toBe('[object Array]');
      });

      it('should have id property', function(){
        expect(globalStationData.response[0].id).not.toBe(undefined);
      });

    });

  });

  it('should have a getStationList method accessible from controller', function () {
    expect(!!stationsService.getStationList).toBe(true);
  });

  describe('station API calls', function () {
    var stationData;
    describe('getStationList', function () {
      beforeEach(function () {
        var companyId = 403;
        var regex = new RegExp(companyId + '/stations', 'g');
        $httpBackend.expectGET(regex).respond(stationsJSON);

        stationsService.getStationList(companyId).then(function (dataFromAPI) {
          stationData = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(stationData.response)).toBe('[object Array]');
      });

    });

    describe('getStation', function () {
      it('should GET station by Id', function () {
        var fakeId = 123;
        var expectedURL = /stations\/\d+$/;
        $httpBackend.expectGET(expectedURL).respond({id: fakeId});

        stationsService.getStation(fakeId).then(function (response) {
          expect(response.id).toBe(fakeId);
        });
        $httpBackend.flush();
      });
    });
  });
});
