'use strict';

describe('Controller: PostFlightDataListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/carrier-types.json'));
  beforeEach(module('served/carrier-numbers.json'));
  beforeEach(module('served/post-trips.json'));

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
    companyId,
    postTripFactory,
    location;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    inject(function (_servedPostTrips_, _servedStations_, _servedCarrierTypes_, _servedCarrierNumbers_) {
      postTripsResponseJSON = _servedPostTrips_;
      stationsListResponseJSON = _servedStations_;
      carrierTypesResponseJSON = _servedCarrierTypes_;
      carrierNumbersResponseJSON = _servedCarrierNumbers_;
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

    spyOn(postTripFactory, 'getPostTripDataList').and.returnValue(postTripsDeferred.promise);
    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    spyOn(postTripFactory, 'getCarrierTypes').and.returnValue(carrierTypesDeferred.promise);
    spyOn(postTripFactory, 'getCarrierNumbers').and.returnValue(carrierNumbersDeferred.promise);

    PostTripDataListCtrl = $controller('PostFlightDataListCtrl', {
      $scope: scope
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
      });
      it('should contain scheduleNumber', function(){

      });
      it('should container departure station', function(){

      });
      it('shoudl contain arrival station', function(){

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
      //scope.search = {data: 'data'};
      //expect(postTripFactory.getPostTripData).toHaveBeenCalledWith(scope.search);
    });

    it('should be able to clear search model and make an API call', function(){
      //scope.search = {data: 'data'};
      //scope.clearSearchForm();
      //expect(postTripFactory.getPostTripData).toHaveBeenCalledWith({});
    });
  });

  describe('updateCarrierNumber', function(){
    it('should call getCarrierNumber', function(){
      scope.updateCarrierNumbers();
      expect(postTripFactory.getCarrierNumbers).toHaveBeenCalled();
    });
  });

  describe('action buttons', function(){
    it('should allow view button to redirect to a new page', function(){
      //expect(location.path()).toBe('/cash-bag/view/1');

    });
    it('should only allow edit button to redirect if date is in future', function(){

    });
    it('should only allow delete button to redirect if date is in future', function(){

    });
    it('should change the url based on the row selected', function(){
      //expect(location.path()).toBe('/cash-bag/edit/1');
    });
  });

});
