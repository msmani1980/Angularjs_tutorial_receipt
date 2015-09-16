'use strict';

fdescribe('Controller: StoreInstanceDashboardCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));

  var StoreInstanceDashboardCtrl;
  var scope;
  var storeInstanceDashboardFactory;

  var cateringStationDeferred;
  var cateringStationResponseJSON;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCateringStations_) {
      cateringStationResponseJSON = _servedCateringStations_;
    });
    scope = $rootScope.$new();

    storeInstanceDashboardFactory = $injector.get('storeInstanceDashboardFactory');

    cateringStationDeferred = $q.defer();
    cateringStationDeferred.resolve(cateringStationResponseJSON);

    spyOn(storeInstanceDashboardFactory, 'getCatererStationList').and.returnValue(cateringStationDeferred.promise);

    StoreInstanceDashboardCtrl = $controller('StoreInstanceDashboardCtrl', {
      $scope: scope
    });
  }));


  describe('init', function () {

    beforeEach(function () {
      scope.$digest();
    });

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



});
