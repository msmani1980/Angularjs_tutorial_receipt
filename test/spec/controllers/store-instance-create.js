'use strict';

describe('Controller: StoreInstanceCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/catering-stations.json',
    'served/menu-master-list.json',
    'served/carrier-numbers.json',
    'served/stores-list.json'
  ));

  var StoreInstanceCreateCtrl,
    $scope,
    catererStationService,
    cateringStationsJSON,
    getCatererStationListDeferred,
    menuMasterService,
    menuMasterListJSON,
    getMenuMasterListDeferred,
    carrierService,
    carrierNumbersJSON,
    getCarrierNumbersDeferred,
    storesService,
    storesListJSON,
    getStoresListDeferred,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope,$injector,
     _servedCateringStations_,_servedMenuMasterList_,_servedCarrierNumbers_,_servedStoresList_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;
    carrierNumbersJSON = _servedCarrierNumbers_;
    storesListJSON = _servedStoresList_;

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();

    menuMasterService = $injector.get('menuMasterService');
    catererStationService = $injector.get('catererStationService');
    carrierService = $injector.get('carrierService');
    storesService = $injector.get('storesService');

    getMenuMasterListDeferred = $q.defer();
    getMenuMasterListDeferred.resolve(menuMasterListJSON);
    spyOn(menuMasterService, 'getMenuMasterList').and.returnValue(
      getMenuMasterListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    getCarrierNumbersDeferred = $q.defer();
    getCarrierNumbersDeferred.resolve(carrierNumbersJSON);
    spyOn(carrierService, 'getCarrierNumbers').and.returnValue(
      getCarrierNumbersDeferred.promise);

    getStoresListDeferred = $q.defer();
    getStoresListDeferred.resolve(storesListJSON);
    spyOn(storesService, 'getStoresList').and.returnValue(
      getStoresListDeferred.promise);

    StoreInstanceCreateCtrl = $controller('StoreInstanceCreateCtrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('when the controller loads', function() {

    it('should have an empty stations list before the scope is digested', function () {
      expect($scope.cateringStationList).toEqual([]);
    });

    describe('The cateringStationList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stations in the cateringStationList', function () {
        expect($scope.cateringStationList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.cateringStationList).toEqual(cateringStationsJSON.response);
      });

    });

    it('should have an empty menu list before the scope is digested', function () {
      expect($scope.menuMasterList).toEqual([]);
    });

    describe('The menuMasterList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more menus in the menuMasterList', function () {
        expect($scope.menuMasterList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.menuMasterList).toEqual(menuMasterListJSON.companyMenuMasters);
      });

    });

    it('should have an empty carrierNumbers list before the scope is digested', function () {
      expect($scope.carrierNumbers).toEqual([]);
    });

    describe('The carrierNumbers array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more carrier numbers in the carrierNumbers list', function () {
        expect($scope.carrierNumbers.length).toBeGreaterThan(0);
      });

      it('should be match the carrierNumbers list from the carrier numbers API Respone',function () {
        expect($scope.carrierNumbers).toEqual(carrierNumbersJSON.response);
      });

    });

    it('should have an empty storesList  before the scope is digested', function () {
      expect($scope.storesList).toEqual([]);
    });

    describe('The storesList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more stores in the storesList', function () {
        expect($scope.storesList.length).toBeGreaterThan(0);
      });

      it('should be match the storesList list from the stores numbers API Respone',function () {
        expect($scope.storesList).toEqual(storesListJSON.response);
      });

    });

  });

});
