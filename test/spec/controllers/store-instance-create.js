'use strict';

describe('Controller: StoreInstanceCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/catering-stations.json',
    'served/menu-master-list.json'
  ));

  var StoreInstanceCreateCtrl,
    $scope,
    catererStationService,
    cateringStationsJSON,
    getCatererStationListDeferred,
    menuMasterService,
    menuMasterListJSON,
    getMenuMasterListDeferred,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope,$injector, _servedCateringStations_,_servedMenuMasterList_) {

    cateringStationsJSON = _servedCateringStations_;
    menuMasterListJSON = _servedMenuMasterList_;

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();

    menuMasterService = $injector.get('menuMasterService');
    catererStationService = $injector.get('catererStationService');

    getMenuMasterListDeferred = $q.defer();
    getMenuMasterListDeferred.resolve(menuMasterListJSON);
    spyOn(menuMasterService, 'getMenuMasterList').and.returnValue(
      getMenuMasterListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    StoreInstanceCreateCtrl = $controller('StoreInstanceCreateCtrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('the controller methods', function() {

    it('should have a init method', function () {
      expect(StoreInstanceCreateCtrl.init).toBeDefined();
    });

    it('should have a getCatererStationList method', function () {
      expect(StoreInstanceCreateCtrl.getCatererStationList).toBeDefined();
    });

    it('should have a setCatererStationList method', function () {
      expect(StoreInstanceCreateCtrl.setCatererStationList).toBeDefined();
    });

    it('should have a getMenuMasterList method', function () {
      expect(StoreInstanceCreateCtrl.getMenuMasterList).toBeDefined();
    });

    it('should have a setMenuList method', function () {
      expect(StoreInstanceCreateCtrl.setMenuMasterList).toBeDefined();
    });


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

  });

});
