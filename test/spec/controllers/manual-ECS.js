'use strict';

fdescribe('Controller: ManualECSCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/catering-stations.json'));
  beforeEach(module('served/stations.json'));
  beforeEach(module('served/store-instance-list.json'));
  beforeEach(module('served/carrier-instance-list.json'));

  var ManualECSCtrl;
  var manualECSFactory;
  var cateringStationsResponseJSON;
  var cateringStationsDeferred;
  var companyStationsResponseJSON;
  var companyStationsDeferred;
  var storeInstancesResponseJSON;
  var storeInstancesDeferred;
  var carrierInstancesResponseJSON;
  var carrierInstancesDeferred;
  var scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {

    inject(function (_servedCateringStations_, _servedStations_, _servedStoreInstanceList_, _servedCarrierInstanceList_) {
      cateringStationsResponseJSON = _servedCateringStations_;
      companyStationsResponseJSON = _servedStations_;
      storeInstancesResponseJSON = _servedStoreInstanceList_;
      carrierInstancesResponseJSON = _servedCarrierInstanceList_;
    });

    manualECSFactory = $injector.get('manualECSFactory');
    scope = $rootScope.$new();

    cateringStationsDeferred = $q.defer();
    cateringStationsDeferred.resolve(cateringStationsResponseJSON);
    companyStationsDeferred = $q.defer();
    companyStationsDeferred.resolve(companyStationsResponseJSON);
    storeInstancesDeferred = $q.defer();
    storeInstancesDeferred.resolve(storeInstancesResponseJSON);
    carrierInstancesDeferred = $q.defer();
    carrierInstancesDeferred.resolve(carrierInstancesResponseJSON);

    spyOn(manualECSFactory, 'getCatererStationList').and.returnValue(cateringStationsDeferred.promise);
    spyOn(manualECSFactory, 'getCompanyStationList').and.returnValue(companyStationsDeferred.promise);
    spyOn(manualECSFactory, 'getStoreInstanceList').and.returnValue(storeInstancesDeferred.promise);
    spyOn(manualECSFactory, 'getCarrierInstanceList').and.returnValue(carrierInstancesDeferred.promise);
    spyOn(manualECSFactory, 'updateCarrierInstance').and.returnValue(carrierInstancesDeferred.promise);

    ManualECSCtrl = $controller('ManualECSCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));


  describe('init', function () {
    it('should get caterer stations', function () {
      expect(manualECSFactory.getCatererStationList).toHaveBeenCalled();
    });

    it('should get company stations', function () {
      expect(manualECSFactory.getCompanyStationList).toHaveBeenCalled();
    });

    it('should attach caterer stations to scope and format dates', function () {
      expect(scope.cateringStationList).toBeDefined();
    });

    it('should attach caterer stations to scope and format station description', function () {
      expect(scope.cateringStationList).toBeDefined();
      expect(scope.cateringStationList.length > 0).toEqual(true);
      expect(scope.cateringStationList[0].stationDescription).toBeDefined();
    });

    it('should attach company stations to scope and format dates', function () {
      expect(scope.companyStationList).toBeDefined();
    });

    it('should attach company stations to scope and format station description', function () {
      expect(scope.companyStationList).toBeDefined();
      expect(scope.companyStationList.length > 0).toEqual(true);
      expect(scope.companyStationList[0].stationDescription).toBeDefined();
    });

    it('should default view to create ECS view', function () {
      expect(scope.isCreateViewActive).toEqual(true);
    });
  });

  describe('search', function () {
    describe('portal instances search', function () {
      it('should get list of store instances from API', function () {
        scope.searchPortalInstances();
        scope.$digest();
        expect(manualECSFactory.getStoreInstanceList).toHaveBeenCalled();
        expect(scope.storeInstances).toBeDefined();
        expect(scope.storeInstances.length > 0).toEqual(true);
      });

      it('should format search payload', function () {
        scope.portalSearch = {
          scheduleDate: '10/20/2016',
          storeNumber: '123',
          station: { id: 1 },
          storeInstance: '2'
        };

        var expectedPayload = {
          scheduleDate: '20161020',
          storeNumber: '123',
          cateringStationId: 1,
          storeInstanceId: 2
        };
        scope.searchPortalInstances();
        scope.$digest();
        expect(manualECSFactory.getStoreInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format result dates and station description and attach to scope', function () {
        scope.companyStationList = [{
          stationId: 1,
          stationCode: 'mockStationCode'
        }];
        scope.searchPortalInstances();
        scope.$digest();
        expect(scope.storeInstances[0].scheduleDate).toEqual('08/13/2015');
        expect(scope.storeInstances[0].stationCode).toEqual('mockStationCode');
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.storeInstances = [{ id: 1 }];
          scope.portalSearch = { storeInstance: 2 };
          scope.clearPortalSearch();
          expect(scope.storeInstances).toEqual(null);
          expect(scope.portalSearch).toEqual({});
        });
      });
    });

    describe('epos carrier instances search', function () {
      it('should get list of store instances from API', function () {
        scope.searchEposInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalled();
      });

      it('should format search payload to resolve station and format date', function () {
        scope.eposSearch = {
          scheduleDate: '10/20/2016',
          storeNumber: '123',
          station: { id: 1, stationCode: 'ORD' }
        };

        var expectedPayload = {
          instanceDate: '20161020',
          storeNumber: '123',
          departureStation: 'ORD',
          storeInstanceId: 0
        };
        scope.searchEposInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format result dates and attach to scope', function () {
        scope.searchEposInstances();
        scope.$digest();
        expect(scope.carrierInstances[0].instanceDate).toEqual('02/24/2016');
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.carrierInstances = [{ id: 1 }];
          scope.eposSearch = { storeNumber: '123' };
          scope.clearEposSearch();
          expect(scope.carrierInstances).toEqual(null);
          expect(scope.eposSearch).toEqual({});
        });
      });
    });

    // allECSInstances
    describe('all instances search', function () {
      it('should get list of store instances from API', function () {
        scope.searchAllECSInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalled();
      });

      it('should format search payload to resolve station and format date', function () {
        scope.allInstancesSearch = {
          eposScheduleDate: '10/20/2016',
          eposStoreNumber: '123',
          eposStation: { id: 1, stationCode: 'ORD' },
          storeInstance: '12'
        };

        var expectedPayload = {
          instanceDate: '20161020',
          storeNumber: '123',
          departureStation: 'ORD',
          storeInstanceId: 12
        };
        scope.searchAllECSInstances();
        scope.$digest();
        expect(manualECSFactory.getCarrierInstanceList).toHaveBeenCalledWith(expectedPayload);
      });

      it('should format result dates and attach to scope', function () {
        scope.searchAllECSInstances();
        scope.$digest();
        expect(scope.allECSInstances[0].instanceDate).toEqual('02/24/2016');
      });

      describe('clear search', function () {
        it('should clear search model and list model', function () {
          scope.allECSInstances = [{ id: 1 }];
          scope.allInstancesSearch = { storeNumber: '123' };
          scope.clearAllInstancesSearch();
          expect(scope.allECSInstances).toEqual(null);
          expect(scope.allInstancesSearch).toEqual({});
        });
      });
    });
  });

  describe('Create Relationship', function () {
    it('should call API with epos instance id and store instance id', function () {

    });

    it('should clear models after successful create', function () {

    });

    it('should not allow saving if a portal and epos record are not selected', function () {

    });

    describe('select record helpers', function () {
      it('should attach selected records to scope', function () {

      });

      it('isRecordSelected should return true for records matching selected record on scope', function () {

      });
    });
  });

  describe('View Helpers', function () {
    describe('toggle views', function () {

    });

    describe('get class for attribute', function () {

    });

    describe('reset all', function () {

    });
  });

  describe('No Records / Search prompts', function () {
    describe('should show no record alert', function () {

    });
  });


});
