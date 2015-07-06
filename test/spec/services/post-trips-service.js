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
      //TODO: test which properties it should have

      describe('api call parameters', function () {
        it('should have a company id as payload', function () {
          var companyId = 413;
          var regex = new RegExp('companies/' + companyId + '/posttrips', 'g');
          $httpBackend.expectGET(regex, headers).respond(200, '');
          postTripsService.getPostTrips(companyId, {});
          $httpBackend.flush();
        });

        it('should take an additional payload parameter', function () {
          var scheduleNumber = '123';
          var payload = {scheduleNumber: scheduleNumber};
          var regex = new RegExp('companies/413/posttrips?scheduleNumber=' + scheduleNumber, 'g');
          $httpBackend.expectGET(regex, headers).respond(200, '');
          postTripsService.getPostTrips('413', payload);
          $httpBackend.flush();
        });

        it('should not need a payload parameter', function () {
          var companyId = '413';
          var regex = new RegExp('companies/413/posttrips', 'g');
          $httpBackend.expectGET(regex, headers).respond(200, '');
          postTripsService.getPostTrips(companyId);
          $httpBackend.flush();
        });
      });
    });


    describe('createPostTrip', function () {

      it('should be accessible in the service', function () {
        expect(!!postTripsService.createPostTrip).toBe(true);
      });

      var cashBagData;

      beforeEach(function () {
        var companyId = 403;
        var postTrip = {

        };
        var regex = new RegExp('/' + cashBagId, 'g');
        $httpBackend.expectGET(regex).respond(postTripDataListResponseJSON);

        postTripsService.createPostTrip(companyId, postTrip).then(function (dataFromAPI) {
          cashBagData = dataFromAPI;
        });
        $httpBackend.flush();
      });


      it('should return an object', function () {

      });

      // TODO: check which data is expected after create

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
