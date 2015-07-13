'use strict';

describe('Controller: PostTripDataCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stations.json', 'served/carrier-types.json', 'served/carrier-numbers.json', 'served/post-trip-data.json'));

  var PostTripDataCtrl,
    scope,
    stationsListResponseJSON,
    stationsListDeferred,
    carrierTypesResponseJSON,
    carrierTypesDeferred,
    carrierNumbersResponseJSON,
    carrierNumbersDeferred,
    postTripResponseJSON,
    postTripDeferred,
    newPostTripDeferred,
    postTripFactory,
    companyId;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStations_, _servedCarrierTypes_, _servedCarrierNumbers_, _servedPostTripData_) {
      stationsListResponseJSON = _servedStations_;
      carrierTypesResponseJSON = _servedCarrierTypes_;
      carrierNumbersResponseJSON = _servedCarrierNumbers_;
      postTripResponseJSON = _servedPostTripData_;
    });
    postTripFactory = $injector.get('postTripFactory');
    scope = $rootScope.$new();

    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsListResponseJSON);
    carrierTypesDeferred = $q.defer();
    carrierTypesDeferred.resolve(carrierTypesResponseJSON);
    carrierNumbersDeferred = $q.defer();
    carrierNumbersDeferred.resolve(carrierNumbersResponseJSON);
    postTripDeferred = $q.defer();
    postTripDeferred.resolve(postTripResponseJSON);
    newPostTripDeferred = $q.defer();
    newPostTripDeferred.resolve({id: 1});

    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(postTripFactory, 'getCarrierTypes').and.returnValue(carrierTypesDeferred.promise);
    spyOn(postTripFactory, 'getCarrierNumbers').and.returnValue(carrierNumbersDeferred.promise);
    spyOn(postTripFactory, 'createPostTrip').and.returnValue(newPostTripDeferred.promise);
    spyOn(postTripFactory, 'updatePostTrip').and.returnValue(postTripDeferred.promise);
    spyOn(postTripFactory, 'getPostTrip').and.returnValue(postTripDeferred.promise);

    companyId = '403';
    PostTripDataCtrl = $controller('PostFlightDataCtrl', {
      $scope: scope,
      _companyId: companyId
    });
  }));


  describe('global functions and API calls', function () {
    var routeParams = {
      state: 'view'
    };
    beforeEach(inject(function ($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    describe('constructor API calls', function () {
      it('should call getStationList', function () {
        expect(postTripFactory.getStationList).toHaveBeenCalled();
        expect(scope.stationList).toBeDefined();

      });
      it('should call getCarrierNumbers', function () {
        expect(postTripFactory.getCarrierTypes).toHaveBeenCalled();
      });
      it('should call getCarrierNumbers for each carrierType', function () {
        for (var i = 0; i < carrierTypesResponseJSON.response.length; i++) {
          expect(postTripFactory.getCarrierNumbers).toHaveBeenCalled();
        }
      });
    });

    describe('timezone helper functions', function () {
      var timeZoneString = 'Europe/Madrid';
      var utcArrOffset = '+1';
      var utcDepOffset = '+2';
      beforeEach(function () {
        scope.stationList = [{
          stationId: 1,
          timezone: timeZoneString,
          utcOffset: utcArrOffset
        }, {
          stationId: 2,
          timezone: timeZoneString,
          utcOffset: utcDepOffset
        }];
        scope.postTrip = {
          arrStationId: 1,
          depStationId: 2
        };
      });
      it('should populate and format departureTimezone', function () {
        scope.updateDepartureTimeZone();
        expect(scope.departureTimezone).toBeDefined();
        expect(scope.departureTimezone).toEqual('Europe/Madrid [UTC +2]');
      });
      it('should populate and format arrivalTimeZone', function () {
        scope.updateArrivalTimeZone();
        expect(scope.arrivalTimezone).toBeDefined();
        expect(scope.arrivalTimezone).toEqual('Europe/Madrid [UTC +1]');
      });
    });
  });

  describe('update controller action', function () {
    var routeParams = {
      state: 'edit'
    };
    beforeEach(inject(function ($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to false', function () {
      expect(scope.readOnly).toEqual(false);
    });

    it('should set view name', function(){
      expect(scope.viewName).toEqual('Edit Post Trip Data');
    });

    it('should call getPostTrip', function() {
      expect(postTripFactory.getPostTrip).toHaveBeenCalled();
      expect(scope.postTrip).toBeDefined();
    });

    describe('save form', function() {
      it('should call updatePostTrip', function() {
        scope.formSave();
        expect(postTripFactory.updatePostTrip).toHaveBeenCalled();
      });
    });
  });

  describe('create controller action', function () {
    var routeParams = {
      state: 'create'
    };
    beforeEach(inject(function ($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to false', function () {
      expect(scope.readOnly).toEqual(false);
    });

    it('should set view name', function(){
      expect(scope.viewName).toEqual('Create Post Trip Data');
    });

    describe('save form', function() {
      it('should call updatePostTrip', function() {
        scope.formSave();
        expect(postTripFactory.createPostTrip).toHaveBeenCalled();
      });
    });
  });

  describe('read controller action', function () {
    var routeParams = {
      state: 'view',
      id: 1
    };
    beforeEach(inject(function ($controller) {
      PostTripDataCtrl = $controller('PostFlightDataCtrl', {
        $scope: scope,
        $routeParams: routeParams
      });
      scope.$digest();
    }));

    it('should set readOnly to true', function () {
      expect(scope.readOnly).toEqual(true);
    });

    it('should set view name', function(){
      expect(scope.viewName).toEqual('Post Trip Data');
    });

    it('should call getPostTrip', function() {
      expect(postTripFactory.getPostTrip).toHaveBeenCalled();
      expect(scope.postTrip).toBeDefined();
    });
  });
});
