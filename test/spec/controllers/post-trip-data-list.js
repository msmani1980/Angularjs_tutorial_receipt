'use strict';

describe('Controller: PostFlightDataListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App', 'served/stations.json', 'served/carrier-types.json', 'served/carrier-numbers.json', 'served/post-trip-data-list.json', 'served/employees.json'));

  var PostTripDataListCtrl,
    scope,
    postTripsResponseJSON,
    postTripsDeferred,
    stationsListResponseJSON,
    stationsListDeferred,
    carrierTypesResponseJSON,
    carrierTypesDeferred,
    carrierNumbersResponseJSON,
    carrierNumbersDeferred,
    deletedPostTripDeferred,
    employeesDeferred,
    employeesResponseJSON,
    companyId,
    postTripFactory,
    location;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedPostTripDataList_, _servedStations_, _servedCarrierTypes_, _servedCarrierNumbers_, _servedEmployees_) {
      postTripsResponseJSON = _servedPostTripDataList_;
      stationsListResponseJSON = _servedStations_;
      carrierTypesResponseJSON = _servedCarrierTypes_;
      carrierNumbersResponseJSON = _servedCarrierNumbers_;
      employeesResponseJSON = _servedEmployees_;
    });
    location = $location;
    postTripFactory = $injector.get('postTripFactory');
    scope = $rootScope.$new();

    postTripsDeferred = $q.defer();
    postTripsDeferred.resolve(postTripsResponseJSON);
    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsListResponseJSON);
    carrierTypesDeferred = $q.defer();
    carrierTypesDeferred.resolve(carrierTypesResponseJSON);
    carrierNumbersDeferred = $q.defer();
    carrierNumbersDeferred.resolve(carrierNumbersResponseJSON);
    deletedPostTripDeferred = $q.defer();
    deletedPostTripDeferred.resolve({id: 1});
    employeesDeferred = $q.defer();
    employeesDeferred.resolve(employeesResponseJSON);

    spyOn(postTripFactory, 'getPostTripDataList').and.returnValue(postTripsDeferred.promise);
    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(postTripFactory, 'getCarrierTypes').and.returnValue(carrierTypesDeferred.promise);
    spyOn(postTripFactory, 'getCarrierNumbers').and.returnValue(carrierNumbersDeferred.promise);
    spyOn(postTripFactory, 'deletePostTrip').and.returnValue(deletedPostTripDeferred.promise);
    spyOn(postTripFactory, 'getEmployees').and.returnValue(employeesDeferred.promise);


    PostTripDataListCtrl = $controller('PostFlightDataListCtrl', {
      $scope: scope,
      companyId: companyId
    });
    scope.$digest();
  }));
  companyId = '403';

  describe('scope globals', function () {
    it('should have postTripDataList attached to scope', function () {
      expect(scope.postTrips).toBeDefined();
    });

    it('should have viewName attached to scope', function () {
      expect(scope.viewName).toBeDefined();
    });
  });

  describe('post trip data constructor calls', function(){
    describe('getPostTripDataList', function(){
      it('should call getPostTripDataList', function(){
        expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
      });
      it('should attach an array to scope', function(){
        expect(Object.prototype.toString.call(scope.postTrips)).toBe('[object Array]');
      });
    });

    describe('getStationList', function(){
      it('should call getStationList', function(){
        expect(postTripFactory.getStationList).toHaveBeenCalled();
      });
      it('should attach stationList array to scope', function(){
        expect(scope.stationList).toBeDefined();
        expect(Object.prototype.toString.call(scope.stationList)).toBe('[object Array]');
      });
    });

    describe('getAllCarrierNumbers', function(){
      it('should call getCarrierTypes', function(){
        expect(postTripFactory.getCarrierTypes).toHaveBeenCalled();
      });
      it('should call getCarrierNumbers for each carrierType', function(){
        expect(postTripFactory.getCarrierNumbers).toHaveBeenCalled();
      });
      it('should attach carrierNumbers array to scope', function(){
        expect(scope.carrierNumbers).toBeDefined();
        expect(Object.prototype.toString.call(scope.carrierNumbers)).toBe('[object Array]');
      });
    });

    describe('getEmployees', function(){
      it('should call getEmployees', function(){
        expect(postTripFactory.getEmployees).toHaveBeenCalled();
      });
      it('should attach employee array to scope', function(){
        expect(scope.employees).toBeDefined();
        expect(Object.prototype.toString.call(scope.employees)).toBe('[object Array]');
      });
    });
  });

  describe('search post trip data', function() {
    it('should have a search object attached to scope', function(){
      expect(scope.search).toBeDefined();
    });

    it('should have search function attached to scope', function(){
      expect(scope.searchPostTripData).toBeDefined();
    });

    it('should have clear search function attached to scope', function(){
      expect(scope.clearSearchForm).toBeDefined();
    });

    it('should call getPostFlightData with search params', function(){
      scope.searchPostTripData();
      expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
    });

    it('should be able to clear search model and make an API call', function(){
      scope.search = {data: 'data'};
      scope.clearSearchForm();
      expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
      expect(scope.search).toEqual({});
    });

    it('should add and reformat multiselect values before search', function (){
      scope.search = {};
      scope.multiSelectedValues = {
        tailNumbers: [{carrierNumber: 'ABC'}, {carrierNumber: 'DEF'}],
        depStations: [{stationId: 1}, {stationId: 2}],
        arrStations: [{stationId: 1}, {stationId: 2}],
        employeeIds: [{id: 3}, {id: 4}]
      };
      var expectedTailNumbersArray = ['ABC', 'DEF'];
      var expectedStationsArray = [1, 2];
      var expectedEmployeeArray = [3, 4];
      scope.searchPostTripData();
      expect(scope.search.tailNumber).toEqual(expectedTailNumbersArray);
      expect(scope.search.depStationId).toEqual(expectedStationsArray);
      expect(scope.search.arrStationId).toEqual(expectedStationsArray);
      expect(scope.search.employeeId).toEqual(expectedEmployeeArray);
    });
  });

  describe('action buttons', function(){
    it('should allow view button to redirect to a new page', function(){
      var tripId = 1;
      scope.redirectToPostTrip(tripId, 'view');
      expect(location.path()).toBe('/post-trip-data/view/' + tripId);
    });

    it('should allow edit button to redirect to a new page', function(){
      var tripId = 1;
      scope.redirectToPostTrip(tripId, 'edit');
      expect(location.path()).toBe('/post-trip-data/edit/' + tripId);
    });

    it('should only show delete button if date is in future', function(){
      var now = new Date(2015, 7, 12);
      var pastString = '2015-05-10';
      var futureString = '2015-10-15';
      jasmine.clock().mockDate(now);
      expect(scope.showDeleteButton(pastString)).toEqual(false);
      expect(scope.showDeleteButton(futureString)).toEqual(true);
    });

    describe('delete post trip', function() {
      it('should call delete post trip', function() {
        var postTripToDelete = [{id: 1}];
        scope.removeRecord(postTripToDelete);
        expect(postTripFactory.deletePostTrip).toHaveBeenCalled();
      });

      it('should reload post trip data', function() {
        scope.postTrips = [{id: 1}];
        scope.tempDeleteIndex = 0;
        scope.removeRecord();
        expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
      });
    });
  });

});
