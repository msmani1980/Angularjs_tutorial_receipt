'use strict';

describe('Controller: StoreInstanceDashboardCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/stores-list.json'));

  var StoreInstanceDashboardCtrl;
  var scope;
  var storeInstanceDashboardFactory;
  var cateringStationDeferred;
  var cateringStationResponseJSON;
  var stationDeferred;
  var stationResponseJSON;
  var storeInstanceListDeferred;
  var storeInstanceListResponseJSON;
  var storesListDeferred;
  var storesListResponseJSON;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedStoresList_) {
      cateringStationResponseJSON = _servedCateringStations_;
      stationResponseJSON = _servedStations_;
      storeInstanceListResponseJSON = _servedStoreInstanceList_;
      storesListResponseJSON = _servedStoresList_;
    });
    scope = $rootScope.$new();

    storeInstanceDashboardFactory = $injector.get('storeInstanceDashboardFactory');

    cateringStationDeferred = $q.defer();
    cateringStationDeferred.resolve(cateringStationResponseJSON);
    stationDeferred = $q.defer();
    stationDeferred.resolve(stationResponseJSON);
    storeInstanceListDeferred = $q.defer();
    storeInstanceListDeferred.resolve(storeInstanceListResponseJSON);
    storesListDeferred = $q.defer();
    storesListDeferred.resolve(storesListResponseJSON);

    spyOn(storeInstanceDashboardFactory, 'getCatererStationList').and.returnValue(cateringStationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStationList').and.returnValue(stationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoreInstanceList').and.returnValue(storeInstanceListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoresList').and.returnValue(storesListDeferred.promise);

    StoreInstanceDashboardCtrl = $controller('StoreInstanceDashboardCtrl', {
      $scope: scope
    });
  }));


  describe('init', function () {

    beforeEach(function () {
      scope.$digest();
    });

    describe('getCatererStation', function () {
      it('should get catererStation from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getCatererStationList).toHaveBeenCalled();
      });

      it('should attach caterStationList to Scope', function () {
        expect(scope.catererStationList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.catererStationList).toEqual(cateringStationResponseJSON.response);
      });
    });

    describe('getStation', function () {
      it('should get station from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getStationList).toHaveBeenCalled();
      });

      it('should attach stationList to Scope', function () {
        expect(scope.stationList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.stationList).toEqual(stationResponseJSON.response);
      });
    });

    describe('getStoreInstanceList', function () {
      it('should get getStoreInstanceList from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalled();
      });

      it('should attach storeInstanceList to Scope', function () {
        expect(scope.storeInstanceList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeInstanceList).toEqual(storeInstanceListResponseJSON.response);
      });
    });

    describe('searchStoreInstanceDashboardData', function () {
      it('should get storesInstances from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getStoreInstanceList).toHaveBeenCalled();
      });

//      it('should attach storeInstances to Scope', function () {
//        expect(scope.).toBeDefined();
//      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeInstanceList).toEqual(storeInstanceListResponseJSON.response);
      });
    });

    describe('getStoresList', function () {
      it('should get getStoresList from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getStoresList).toHaveBeenCalled();
      });

      it('should attach storesList to Scope', function () {
        expect(scope.storesList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storesList).toEqual(storesListResponseJSON.response);
      });
    });

    describe('format store instance response', function () {
      it('should add store number based on storeId', function () {
        expect(scope.storeInstanceList[0].storeNumber).toBeDefined();
        expect(scope.storeInstanceList[0].storeNumber).toEqual('180485');
      });
  });



});
