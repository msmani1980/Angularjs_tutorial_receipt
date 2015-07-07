'use strict';

describe('Service: postTripService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/post-trip-data-list.json'));

  var postTripsService,
    $httpBackend,
    postTripDataListResponseJSON,
    headers = {
      companyId: 362,
      'Accept': 'application/json, text/plain, */*',
      'userId': 1
    };

  beforeEach(inject(function (_postTripsService_, $injector) {
    inject(function (_servedPostTripDataList_) {
      postTripDataListResponseJSON = _servedPostTripDataList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    postTripsService = _postTripsService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!postTripsService).toBe(true);
  });

  describe('API calls', function () {

    describe('getPostTrips', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripsService.getPostTrips).toBe(true);
      });

      var postTripDataList;
      beforeEach(function () {
        $httpBackend.whenGET(/posttrips/, headers).respond(postTripDataListResponseJSON);
        postTripsService.getPostTrips().then(function (dataFromAPI) {
          postTripDataList = dataFromAPI;
        });
        $httpBackend.flush();
      });

      it('should be an array', function () {
        expect(Object.prototype.toString.call(postTripDataList.postTrips)).toBe('[object Array]');
      });

      describe('api call parameters', function () {
        it('should have a company id as payload', function () {
          var companyId = '403';
          var regex = new RegExp('companies/' + companyId + '/posttrips', 'g');
          $httpBackend.expectGET(regex, headers);
          postTripsService.getPostTrips(companyId, {});
          $httpBackend.flush();
        });

        it('should take an optional payload parameter', function () {
          var scheduleNumber = '123';
          var payload = {scheduleNumber: scheduleNumber};
          var regex = new RegExp('companies/403/posttrips\\?\.\*scheduleNumber=' + scheduleNumber, 'g');
          $httpBackend.expectGET(regex, headers);
          postTripsService.getPostTrips('403', payload);
          $httpBackend.flush();
        });

        it('should not need a payload parameter', function () {
          var regex = new RegExp('companies/403/posttrips', 'g');
          $httpBackend.expectGET(regex, headers);
          postTripsService.getPostTrips('403');
          $httpBackend.flush();
        });
      });
    });


    describe('createPostTrip', function () {

      it('should be accessible in the service', function () {
        expect(!!postTripsService.createPostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenPOST(regex).respond({id: 36});
      });

      it('should POST data to posttrips API', function(){
        var regex = new RegExp('companies/403/posttrips', 'g');
        postTripsService.createPostTrip('403', {});
        $httpBackend.expectPOST(regex);
        $httpBackend.flush();
      });
    });

    describe('updatePostTrip', function () {
      it('should send a payload parameter', function () {

      });

      it('should return a post trip object', function () {

      });

    });

    describe('deletePostTrip', function(){
      it('should send postTrip id', function(){

      });

      it('should make a DELETE request', function(){

      });

    });

  });
});
