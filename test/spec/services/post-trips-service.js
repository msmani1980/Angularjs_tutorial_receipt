'use strict';

describe('Service: postTripService', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/post-trip-data-list.json'));

  var postTripService,
    Upload,
    $httpBackend,
    postTripDataListResponseJSON,
    headers = {
      companyId: 362,
      'Accept': 'application/json, text/plain, */*',
      'userId': 1,
      sessionToken: '9e85ffbb3b92134fbf39a0c366bd3f12f0f5'
    };

  beforeEach(inject(function (_postTripService_, $injector) {
    inject(function (_servedPostTripDataList_) {
      postTripDataListResponseJSON = _servedPostTripDataList_;
    });

    $httpBackend = $injector.get('$httpBackend');
    postTripService = _postTripService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!postTripService).toBe(true);
  });

  describe('API calls', function () {
    describe('getPostTrips', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripService.getPostTrips).toBe(true);
      });

      var postTripDataList;
      beforeEach(function () {
        $httpBackend.whenGET(/posttrips/).respond(postTripDataListResponseJSON);
        postTripService.getPostTrips().then(function (dataFromAPI) {
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
          $httpBackend.expectGET(regex);
          postTripService.getPostTrips(companyId, {});
          $httpBackend.flush();
        });

        it('should take an optional payload parameter', function () {
          var scheduleNumber = '123';
          var payload = {scheduleNumber: scheduleNumber};
          var regex = new RegExp('companies/403/posttrips\.\*scheduleNumber=' + scheduleNumber, 'g');
          $httpBackend.expectGET(regex);
          postTripService.getPostTrips('403', payload);
          $httpBackend.flush();
        });

        it('should not need a payload parameter', function () {
          var regex = new RegExp('companies/403/posttrips', 'g');
          $httpBackend.expectGET(regex);
          postTripService.getPostTrips('403');
          $httpBackend.flush();
        });
      });
    });

    describe('getPostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripService.getPostTrip).toBe(true);
      });

      it('should append postTrip id to request URL', function () {
        var postTripId = '123';
        var regex = new RegExp('posttrips/' + postTripId, 'g');
        $httpBackend.expectGET(regex).respond('202');
        postTripService.getPostTrip('403', postTripId);
        $httpBackend.flush();
      });
    });

    describe('createPostTrip', function () {

      it('should be accessible in the service', function () {
        expect(!!postTripService.createPostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenPOST(regex).respond({id: 36});
      });

      it('should POST data to posttrips API', function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        postTripService.createPostTrip('403', {});
        $httpBackend.expectPOST(regex);
        $httpBackend.flush();
      });
    });

    describe('updatePostTrip', function () {
      it('should be accessible in the service', function () {
        expect(!!postTripService.updatePostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenPUT(regex).respond('202');
      });

      it('should PUT data to posttrips API', function () {
        var regex = new RegExp('posttrips', 'g');
        postTripService.updatePostTrip('403', {});
        $httpBackend.expectPUT(regex);
        $httpBackend.flush();
      });
    });

    describe('deletePostTrip', function () {
      it('should be accessible in service', function () {
        expect(!!postTripService.deletePostTrip).toBe(true);
      });

      beforeEach(function () {
        var regex = new RegExp('companies/403/posttrips', 'g');
        $httpBackend.whenDELETE(regex).respond('202');
      });

      it('should send DELETE request', function () {
        var regex = new RegExp('posttrips', 'g');
        $httpBackend.expectDELETE(regex);
        postTripService.deletePostTrip('403', '1');
        $httpBackend.flush();
      });

      it('should append postTrip id to request URL', function () {
        var postTripId = '123';
        var regex = new RegExp('posttrips/' + postTripId, 'g');
        $httpBackend.expectDELETE(regex).respond('202');
        postTripService.deletePostTrip('403', postTripId);
        $httpBackend.flush();
      });
    });

    var mockFile;
    var mockFn;
    describe('importFromExcel', function () {
      it('should be accessible in service', function () {
        expect(!!postTripService.importFromExcel).toBe(true);
      });

      beforeEach(inject(function (_Upload_) {
        Upload = _Upload_;
        mockFn = {};
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
        postTripService.importFromExcel('403', mockFile);
        expect(Upload.upload).toHaveBeenCalled();
      });
    });

  });
});
