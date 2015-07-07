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
    spyOn(postTripFactory, 'createPostTrip').and.returnValue({id:360});

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
      beforeEach(function () {
        scope.stationList = [{
          stationName: '',
          stationId: 0,
          timezone: 'US/Chicago',
          utcOffset: '+2:00'
        }];
        scope.postTrip = {};
        scope.arrivalStationIndex = 0;
        scope.departureStationIndex = 0;
      });

      it('should set new arrival station', function () {
        var testStationId = 1;
        scope.stationList[0].stationId = testStationId;
        scope.updateArrivalInfo();
        expect(scope.postTrip.arrStationId).toEqual(testStationId);
      });
      it('should set new departure station', function () {
        var testStationId = 2;
        scope.stationList[0].stationId = testStationId;
        scope.updateDepartureInfo();
        expect(scope.postTrip.depStationId).toEqual(testStationId);
      });
      it('should set new arrival timezone', function () {
        scope.updateArrivalInfo();
        expect(scope.arrivalTimezone).toEqual('US/Chicago [UTC +2:00]');
      });
      it('should set new departure timezone', function () {
        scope.updateDepartureInfo();
        expect(scope.departureTimezone).toEqual('US/Chicago [UTC +2:00]');
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

    describe('create post trip', function () {
      beforeEach(function(){
        scope.postTrip = {scheduleDate:'07/17/2015'};
      });

      it('should reformat schedule date', function(){
        var _companyId = companyId;
        scope.formSave();
        expect(scope.postTrip.scheduleDate).toEqual('20150717');
      });
      it('should format employeeIds into array', function(){
        scope.formSave();
        expect(Object.prototype.toString.call(scope.postTrip.postTripEmployeeIdentifiers)).toBe('[object Array]');
      });
      it('should call createPostTrip', function(){
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

    describe('scope globals', function () {
      it('should attach a viewName to the scope', function () {
        expect(scope.viewName).toBe('Post Trip Data');
      });
      it('should set the readOnly to true in scope', function () {
        expect(scope.readOnly).toEqual(true);
      });
    });

    describe('constructor methods', function () {
      it('should call getPostTrip for routeParams id', function () {
        //expect(postTripFactory.getPostTrip).toHaveBeenCalledWith(routeParams.id);
      });
      it('should attach postTrip data to scope', function () {
        //expect(scope.postTrip).toBeDefined();
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
