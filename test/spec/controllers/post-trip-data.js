'use strict';

describe('Controller: PostTripDataCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/carrier-types.json'));
  beforeEach(module('served/carrier-numbers.json'));

  var PostTripDataCtrl,
    scope,
    stationsListResponseJSON,
    stationsListDeferred,
    carrierTypesResponseJSON,
    carrierTypesDeferred,
    carrierNumbersResponseJSON,
    carrierNumbersDeferred,
    postTripFactory,
    companyId;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedStations_, _servedCarrierTypes_, _servedCarrierNumbers_) {
      stationsListResponseJSON = _servedStations_;
      carrierTypesResponseJSON = _servedCarrierTypes_;
      carrierNumbersResponseJSON = _servedCarrierNumbers_;
    });
    postTripFactory = $injector.get('postTripFactory');
    scope = $rootScope.$new();

    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsListResponseJSON);
    carrierTypesDeferred = $q.defer();
    carrierTypesDeferred.resolve(carrierTypesResponseJSON);
    carrierNumbersDeferred = $q.defer();
    carrierNumbersDeferred.resolve(carrierNumbersResponseJSON);

    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(postTripFactory, 'getCarrierTypes').and.returnValue(carrierTypesDeferred.promise);
    spyOn(postTripFactory, 'getCarrierNumbers').and.returnValue(carrierNumbersDeferred.promise);

    PostTripDataCtrl = $controller('PostFlightDataCtrl', {
      $scope: scope
    });
    companyId = '403';
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
      it('should call getCarrierTypes', function () {
        expect(postTripFactory.getCarrierTypes).toHaveBeenCalled();
        expect(scope.carrierTypes).toBeDefined();
      });
    });

    describe('updateCarrierNumbers', function () {
      it('should call getCarrierNumbers', function () {
        scope.updateCarrierNumbers();
        expect(postTripFactory.getCarrierNumbers).toHaveBeenCalled();
      });
    });
    describe('update arrival/departure info', function () {
      beforeEach(function(){
        scope.stationList =  [{
          stationName: '',
          timezone: 'US/Chicago',
          utcOffset: '+2:00'
        }];
        scope.postTrip = {};
        scope.arrivalStationIndex = 0;
        scope.departureStationIndex = 0;
      });

      it('should set new arrival station', function () {
        var testStationName = 'testStation';
        scope.stationList[0].stationName = testStationName;
        scope.updateArrivalInfo();
        expect(scope.postTrip.arrivalStation).toEqual(testStationName);
      });
      it('should set new departure station', function () {
        var testStationName = 'testStation2';
        scope.stationList[0].stationName = testStationName;
        scope.updateDepartureInfo();
        expect(scope.postTrip.departureStation).toEqual(testStationName);
      });
      it('should set new arrival timezone', function () {
        scope.updateArrivalInfo();
        expect(scope.postTrip.arrivalTimezone).toEqual('US/Chicago [UTC +2:00]');
      });
      it('should set new departure timezone', function () {
        scope.updateDepartureInfo();
        expect(scope.postTrip.departureTimezone).toEqual('US/Chicago [UTC +2:00]');
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
    describe('scope globals', function () {
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Create Post Trip Data');
      });
      it('should set the readOnly to false in scope', function () {
        expect(scope.readOnly).toEqual(false);
      });
    });
  });

  describe('read controller action', function () {
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

    describe('scope globals', function () {
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Post Trip Data');
      });
      it('should set the readOnly to true in scope', function () {
        expect(scope.readOnly).toEqual(true);
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

    describe('scope globals', function () {
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Post Trip Data');
      });
      it('should set the readOnly to false in scope', function () {
        expect(scope.readOnly).toEqual(false);
      });
    });
  });

});
