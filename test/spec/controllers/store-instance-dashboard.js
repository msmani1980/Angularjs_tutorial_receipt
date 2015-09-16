'use strict';

describe('Controller: StoreInstanceDashboardCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/store-instance-list.json'));

  var StoreInstanceDashboardCtrl;
  var scope;
  var storeInstanceDashboardFactory;

  var cateringStationDeferred;
  var cateringStationResponseJSON;
  var storeInstanceListDeferred;
  var storeInstanceListResponseJSON;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCateringStations_, _servedStoreInstanceList_) {
      cateringStationResponseJSON = _servedCateringStations_;
      storeInstanceListResponseJSON = _servedStoreInstanceList_;
    });
    scope = $rootScope.$new();

    storeInstanceDashboardFactory = $injector.get('storeInstanceDashboardFactory');

    cateringStationDeferred = $q.defer();
    cateringStationDeferred.resolve(cateringStationResponseJSON);
    storeInstanceListDeferred = $q.defer();
    storeInstanceListDeferred.resolve(storeInstanceListResponseJSON);

    spyOn(storeInstanceDashboardFactory, 'getCatererStationList').and.returnValue(cateringStationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoreInstanceList').and.returnValue(storeInstanceListDeferred.promise);

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

      it('should attach caterStation to Scope', function () {
        expect(scope.catererStationList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.catererStationList).toEqual(cateringStationResponseJSON.response);
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


  });



});
