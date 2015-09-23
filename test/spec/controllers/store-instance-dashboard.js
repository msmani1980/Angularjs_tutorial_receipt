'use strict';

describe('Controller: StoreInstanceDashboardCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/stores-list.json'));
  beforeEach(module('served/store-status.json'));

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
  var statusListDeferred;
  var statusListResponseJSON;

  beforeEach(inject(function ($controller, $rootScope, $injector, $q) {
    inject(function (_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedStoresList_, _servedStoreStatus_) {
      cateringStationResponseJSON = _servedCateringStations_;
      stationResponseJSON = _servedStations_;
      storeInstanceListResponseJSON = _servedStoreInstanceList_;
      storesListResponseJSON = _servedStoresList_;
      statusListResponseJSON = _servedStoreStatus_;
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
    statusListDeferred = $q.defer();
    statusListDeferred.resolve(statusListResponseJSON);

    spyOn(storeInstanceDashboardFactory, 'getCatererStationList').and.returnValue(cateringStationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStationList').and.returnValue(stationDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoreInstanceList').and.returnValue(storeInstanceListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStoresList').and.returnValue(storesListDeferred.promise);
    spyOn(storeInstanceDashboardFactory, 'getStatusList').and.returnValue(statusListDeferred.promise);

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
        expect(scope.catererStationList.length).toEqual(cateringStationResponseJSON.response.length);
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

      it('should attach all objects of JSON to scope', function () {
        expect(scope.storeInstanceList.length).toEqual(storeInstanceListResponseJSON.response.length);
      });
    });

    describe('searchStoreInstanceDashboardData', function () {
      // TODO: test Search once it is implemented
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

    describe('getStatusList', function () {
      it('should get getStatusList from storeInstanceDashboardFactory', function () {
        expect(storeInstanceDashboardFactory.getStatusList).toHaveBeenCalled();
      });

      it('should attach storeStatusList to Scope', function () {
        expect(scope.storeStatusList).toBeDefined();
      });

      it('should attach all properties of JSON to scope', function () {
        expect(scope.storeStatusList).toEqual(statusListResponseJSON);
      });
    });

    describe('format store instance response', function () {
      beforeEach(function () {
        scope.$digest();
      });

      it('should add store number', function () {
        expect(scope.storeInstanceList[0].storeNumber).toBeDefined();
      });

      it('should add status name', function () {
        expect(scope.storeInstanceList[0].storeNumber).toBeDefined();
      });

      it('should add actionButtons name', function () {
        expect(scope.storeInstanceList[0].actionButtons).toBeDefined();
      });
    });
  });

  describe('Table Accordion functions', function () {

    describe('toggleAccordion', function () {
      var testStore = {
        id: 2,
        replenishItems: [{id: 3}]
      };

      it('should only close if toggling current open accordion', function () {
        scope.openStoreInstanceId = 2;
        scope.toggleAccordionView(testStore);
        scope.$digest();
        expect(scope.openStoreInstanceId).toEqual(-1);
      });
      it('should set new openRowId if toggling a closed accordion', function () {
        scope.openStoreInstanceId = 5;
        scope.$digest();
        scope.toggleAccordionView(testStore);
        expect(scope.openStoreInstanceId).toEqual(2);
      });
    });

    describe('scope check functions', function () {
      var testStore = {
        id: 2,
        replenishItems: [{id: 3}]
      };
      it('should check store replenishItems array for doesStoreInstanceHaveReplenishments', function () {
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(true);
        testStore.replenishItems = [];
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(false);

      });
      it('should return false for isStoreViewExpanded when given store is expanded', function () {
        scope.openStoreInstanceId = 2;
        expect(scope.isStoreViewExpanded(testStore)).toEqual(true);
        testStore.id = 3;
        expect(scope.doesStoreInstanceHaveReplenishments(testStore)).toEqual(false);
      });
    });
  });

  describe('toggle checkboxes', function () {
    it('should set all stores with a Checkbox to be selected', function () {
      scope.storeInstanceList = [
        {id: 1, selected: false, actionButtons: ['Checkbox']},
        {id: 2, selected: false, actionButtons: ['Delete']}
      ];
      scope.allCheckboxesSelected = true;
      scope.toggleAllCheckboxes();
      expect(scope.storeInstanceList[0].selected).toEqual(true);
      expect(scope.storeInstanceList[1].selected).toEqual(false);
    });
  });


});
