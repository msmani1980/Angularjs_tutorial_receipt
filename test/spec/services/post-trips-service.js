'use strict';

describe('Service: postTripService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/post-trip-data-list.json'));

  var postTripsService,
    Upload,
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
          var regex = new RegExp('companies/403/posttrips\.\*scheduleNumber=' + scheduleNumber, 'g');
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

    describe('getPostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripsService.getPostTrip).toBe(true);
      });

      it('should append postTrip id to request URL', function () {
        var postTripId = '123';
        var regex = new RegExp('posttrips/' + postTripId, 'g');
        $httpBackend.expectGET(regex).respond('202');
        postTripsService.getPostTrip('403', postTripId);
        $httpBackend.flush();
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

      it('should POST data to posttrips API', function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        postTripsService.createPostTrip('403', {});
        $httpBackend.expectPOST(regex);
        $httpBackend.flush();
      });
    });

    describe('updatePostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripsService.updatePostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenPUT(regex).respond('202');
      });

      it('should PUT data to posttrips API', function () {
        var regex = new RegExp('posttrips', 'g');
        postTripsService.updatePostTrip('403', {});
        $httpBackend.expectPUT(regex);
        $httpBackend.flush();
      });
    });

    describe('deletePostTrip', function () {
      it('should be accessible in service', function () {
        expect(!!postTripsService.deletePostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenDELETE(regex).respond('202');
      });

      it('should send DELETE request', function () {
        var regex = new RegExp('posttrips', 'g');
        $httpBackend.expectDELETE(regex);
        postTripsService.deletePostTrip('403', '1');
        $httpBackend.flush();
      });

      it('should append postTrip id to request URL', function () {
        var postTripId = '123';
        var regex = new RegExp('posttrips/' + postTripId, 'g');
        $httpBackend.expectDELETE(regex).respond('202');
        postTripsService.deletePostTrip('403', postTripId);
        $httpBackend.flush();
      });
    });

    var mockFile;
    var mockFn;
    describe('uploadPostTrip', function () {
      it('should be accessible in service', function () {
        expect(!!postTripsService.deletePostTrip).toBe(true);
      });

      beforeEach(inject(function (_Upload_) {
        Upload = _Upload_;
        mockFn = {};

        mockFn.progress = jasmine.createSpy('progressFn').and.returnValue(mockFn);
        mockFn.success = jasmine.createSpy('successFn').and.returnValue(mockFn);
        mockFn.error = jasmine.createSpy('errorFn').and.returnValue(mockFn);
        spyOn(Upload, 'upload').and.returnValue(mockFn);

        mockFile =
        {
          $$hashKey: 'object:277',
          lastModified: 1430772953000,
          lastModifiedDate: 'Mon May 04 2015 16:55:53 GMT-0400 (EDT)',
          name: 'item-c8b71477-c9eb-4f7c-ac20-a29f91bb4636.png',
          size: 7801,
          type: 'file/spreadsheet',
          webkitRelativePath: ''
        };
      }));

      it('should call the upload function', function () {
        postTripsService.uploadPostTrip('403', mockFile, mockFn, mockFn);
        expect(Upload.upload).toHaveBeenCalled();
      });
    });

  });
});
