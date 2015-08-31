'use strict';

describe('Controller: StoreInstanceStep1Ctrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module(
    'served/catering-stations.json',
    'served/menus.json'
  ));

  var StoreInstanceStep1Ctrl,
    $scope,
    catererStationService,
    cateringStationsJSON,
    getCatererStationListDeferred,
    menuService,
    menusJSON,
    getMenuListDeferred,
    location,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope,$injector, _servedCateringStations_,_servedMenus_) {

    cateringStationsJSON = _servedCateringStations_;
    menusJSON = _servedMenus_;

    httpBackend = $injector.get('$httpBackend');
    location = $injector.get('$location');
    $scope = $rootScope.$new();

    menuService = $injector.get('menuService');
    catererStationService = $injector.get('catererStationService');

    getMenuListDeferred = $q.defer();
    getMenuListDeferred.resolve(menusJSON);
    spyOn(menuService, 'getMenuList').and.returnValue(
      getMenuListDeferred.promise);

    getCatererStationListDeferred = $q.defer();
    getCatererStationListDeferred.resolve(cateringStationsJSON);
    spyOn(catererStationService, 'getCatererStationList').and.returnValue(
      getCatererStationListDeferred.promise);

    StoreInstanceStep1Ctrl = $controller('StoreInstanceStep1Ctrl', {
      $scope: $scope
    });

  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('the controller methods', function() {

    it('should have a init method', function () {
      expect(StoreInstanceStep1Ctrl.init).toBeDefined();
    });

    it('should have a getCatererStationList method', function () {
      expect(StoreInstanceStep1Ctrl.getCatererStationList).toBeDefined();
    });

    it('should have a setCatererStationList method', function () {
      expect(StoreInstanceStep1Ctrl.setCatererStationList).toBeDefined();
    });

    it('should have a getMenuList method', function () {
      expect(StoreInstanceStep1Ctrl.getMenuList).toBeDefined();
    });

    it('should have a setMenuList method', function () {
      expect(StoreInstanceStep1Ctrl.setMenuList).toBeDefined();
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
      expect($scope.menuList).toEqual([]);
    });

    describe('The menuList array', function () {

      beforeEach(function() {
        $scope.$digest();
      });

      it('should have (1) or more menus in the menuList', function () {
        expect($scope.menuList.length).toBeGreaterThan(0);
      });

      it('should be match the stations list from the stations API Respone',function () {
        expect($scope.menuList).toEqual(menusJSON.menus);
      });

    });

  });

});
