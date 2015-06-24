'use strict';

describe('Controller: PostFlightDataListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stations.json'));

  var PostTripDataListCtrl,
    scope,
    postTripDataResponseJSON,
    postTripDataDeferred,
    stationsListResponseJSON,
    stationsListDeferred,
    companyId,
    postTripFactory,
    location;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, $q, $location) {
    //inject(function (_servedPostTripDataList_) {
    //  postTripDataResponseJSON = _servedPostTripDataList_;
    //});
    inject(function (_servedStations_) {
      stationsListResponseJSON = _servedStations_;
    });
    location = $location;
    postTripFactory = $injector.get('postTripFactory');
    scope = $rootScope.$new();

    stationsListDeferred = $q.defer();
    stationsListDeferred.resolve(stationsListResponseJSON);
    //postTripDataDeferred = $q.defer();
    //postTripDataDeferred.resolve(postTripDataResponseJSON);

    //spyOn(postTripFactory, 'getPostTripDataList').and.returnValue(postTripDataDeferred.promise);
    spyOn(postTripFactory, 'getStationList').and.returnValue(stationsListDeferred.promise);
    PostTripDataListCtrl = $controller('PostFlightDataListCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));
  companyId = '403';

  describe('scope globals', function () {
    it('should have postTripDataList attached to scope', function () {
      expect(scope.postTripDataList).toBeDefined();
    });

    it('should have viewName attached to scope', function () {
      expect(scope.viewName).toBeDefined();
    });
  });

  describe('post trip data constructor calls', function(){
    it('should call getPostTripDataList', function(){
      expect(postTripFactory.getPostTripDataList).toHaveBeenCalled();
    });
    it('shoudl call getCompanyId', function(){
      expect(postTripFactory.getCompanyId).toHaveBeenCalled();
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
      scope.search = {data: 'data'};
      expect(postTripFactory.getPostTripData).toHaveBeenCalledWith(scope.search);
    });

    it('should be able to clear search model and make an API call', function(){
      scope.search = {data: 'data'};
      scope.clearSearchForm();
      expect(postTripFactory.getPostTripData).toHaveBeenCalledWith({});
    });
  });

  describe('helper functions', function(){

  });

  describe('updateCarrierNumber', function(){
    it('should call getCarrierNumber', function(){
      scope.updateCarrierNumbers();
      expect(postTripFactory.getCarrierNumbers).toHaveBeenCalled();
    });
    it('should attach carrierNumbers to scope', function(){
      scope.updateCarrierNumbers();
      expect(scope.carrierNumbers).toBeDefined();
    });
  });

  describe('action buttons', function(){
    it('should allow view button to redirect to a new page', function(){

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
